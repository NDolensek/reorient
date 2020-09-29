'''
Apply rotation and selection files to reorient
a nifti volume
'''

import numpy as np
import nibabel as nib
import sys
from tqdm import tqdm

def trilinear(x, y, z, data, dim):
  '''Code from http://paulbourke.net/miscellaneous/interpolation/'''
  [i, j, k] = [int(x), int(y), int(z)]
  V000 = int(data[ i   , j   ,  k   ])
  V100 = int(data[(i+1), j   ,  k   ])
  V010 = int(data[ i   ,(j+1),  k   ])
  V001 = int(data[ i   , j   , (k+1)])
  V101 = int(data[(i+1), j   , (k+1)])
  V011 = int(data[ i   ,(j+1), (k+1)])
  V110 = int(data[(i+1),(j+1),  k   ])
  V111 = int(data[(i+1),(j+1), (k+1)])

  x = x - i
  y = y - j
  z = z - k

  Vxyz = (V000 * (1 - x)*(1 - y)*(1 - z)
          + V100 * x * (1 - y) * (1 - z) +
          + V010 * (1 - x) * y * (1 - z) +
          + V001 * (1 - x) * (1 - y) * z +
          + V101 * x * (1 - y) * z +
          + V011 * (1 - x) * y * z +
          + V110 * x * y * (1 - z) +
          + V111 * x * y * z)

  return Vxyz

def value_at_absolute_coordinate(a, mm2vox, data, dim):
  v = mm2vox.dot(a)
  [x, y, z] = [int(v[0]), int(v[1]), int(v[2])]
  if x<0 or x>=dim[0] or y<0 or y>=dim[1] or z<0 or z>=dim[2]:
    return 0

  return trilinear(v[0], v[1], v[2], data, dim)

def world_pixdim(nii):
  v2w = nii.affine[:3,:3]

  mi = {"i": 0, "v": 0}
  for n,o in enumerate(v2w[0]):
    if np.abs(o) > np.abs(mi["v"]): mi = {"i": n, "v": o}
  
  mj = {"i": 0, "v": 0}
  for n,o in enumerate(v2w[1]):
    if np.abs(o) > np.abs(mj["v"]): mj = {"i": n, "v": o}

  mk = {"i": 0, "v": 0}
  for n,o in enumerate(v2w[2]):
    if np.abs(o) > np.abs(mk["v"]): mk = {"i": n, "v": o}

  pixdim = nii.header["pixdim"][1:4]
  wpixdim = np.zeros(3)
  wpixdim[mi["i"]] = pixdim[0]
  wpixdim[mj["i"]] = pixdim[1]
  wpixdim[mk["i"]] = pixdim[2]

  return wpixdim

def reorient(img, rotation, selection):
  pixdim = world_pixdim(img)
  dim = [
    int(np.ceil(selection[1,0] - selection[0,0])),
    int(np.ceil(selection[1,1] - selection[0,1])),
    int(np.ceil(selection[1,2] - selection[0,2]))
  ]
  mm2vox = np.linalg.inv(rotation)
  orig_data = img.get_data()
  orig_dim = img.shape

  data = np.zeros(list(dim), dtype = np.float32)
  for i in tqdm(range(dim[0])):
    for j in range(dim[1]):
      for k in range(dim[2]):
        w = [
          (selection[0,0] + i)*pixdim[0],
          (selection[0,1] + j)*pixdim[1],
          (selection[0,2] + k)*pixdim[2],
          1
        ]
        val = value_at_absolute_coordinate(w, mm2vox, orig_data, orig_dim)
        data[i,j,k] = val

  affine = np.array([
    [pixdim[0], 0, 0, selection[0,0]*pixdim[0]],
    [0, pixdim[1], 0, selection[0,1]*pixdim[1]],
    [0, 0, pixdim[2], selection[0,2]*pixdim[2]],
    [0, 0, 0, 1]
  ])
  result = nib.Nifti1Image(data, affine)

  return result

def main(argv):
  _,input_file, rotation_file, selection_file, output_file = argv

  img = nib.load(input_file)
  rotation = np.loadtxt(rotation_file)
  selection = np.loadtxt(selection_file)
  result = reorient(img, rotation, selection)
  nib.save(result, output_file)

if __name__ == "__main__":
    main(sys.argv)