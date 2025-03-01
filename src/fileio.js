/**
 * @description File I/O functions for loading and saving files
 */

import globals from './globals.js';
import { printInfo, multiplyAndUpdate } from './transform.js';
import { updateOverlaysFromCropBox } from './cropbox.js';
import { eye } from './matrix.js';

/**
 * Load an affine matrix from a text file. Use it instead of
 * the one in the current MRI.
 */
function loadMatrix() {
  const { mv } = globals;
  const input = document.createElement("input");
  input.type = "file";
  input.onchange = function() {
    const [file] = this.files;
    const reader = new FileReader();
    reader.onload = function(e) {
      const str = e.target.result;
      const arr = str.split('\n');
      const v2m = arr.map((o) => o.split(' ').map((oo) => parseFloat(oo))).slice(0, 4);
      mv.mri.NiiHdrLE.fields.srow_x[0] = v2m[0][0];
      mv.mri.NiiHdrLE.fields.srow_x[1] = v2m[0][1];
      mv.mri.NiiHdrLE.fields.srow_x[2] = v2m[0][2];
      mv.mri.NiiHdrLE.fields.srow_x[3] = v2m[0][3];
      mv.mri.NiiHdrLE.fields.srow_y[0] = v2m[1][0];
      mv.mri.NiiHdrLE.fields.srow_y[1] = v2m[1][1];
      mv.mri.NiiHdrLE.fields.srow_y[2] = v2m[1][2];
      mv.mri.NiiHdrLE.fields.srow_y[3] = v2m[1][3];
      mv.mri.NiiHdrLE.fields.srow_z[0] = v2m[2][0];
      mv.mri.NiiHdrLE.fields.srow_z[1] = v2m[2][1];
      mv.mri.NiiHdrLE.fields.srow_z[2] = v2m[2][2];
      mv.mri.NiiHdrLE.fields.srow_z[3] = v2m[2][3];
      mv.mri.MatrixMm2Vox = mv.mri.mm2vox();
      globals.prevMatrix = null;
      multiplyAndUpdate(eye());
      mv.draw();
      printInfo();
    };
    reader.readAsText(file);
  };
  input.click();
}

/**
 * Load an affine matrix from a text file. Append it to
 * the one in the current MRI.
 */
function appendMatrix() {
  const { mv } = globals;
  const input = document.createElement("input");
  input.type = "file";
  input.onchange = function() {
    const [file] = this.files;
    const reader = new FileReader();
    reader.onload = function(e) {
      const str = e.target.result;
      const arr = str.split('\n');
      const newV2M = arr.map((o) => o.split(' ').map((oo) => parseFloat(oo))).slice(0, 4);
      const v2m = mv.mri.multMatMat(mv.mri.MatrixVox2Mm, newV2M);
      mv.mri.NiiHdrLE.fields.srow_x[0] = v2m[0][0];
      mv.mri.NiiHdrLE.fields.srow_x[1] = v2m[0][1];
      mv.mri.NiiHdrLE.fields.srow_x[2] = v2m[0][2];
      mv.mri.NiiHdrLE.fields.srow_x[3] = v2m[0][3];
      mv.mri.NiiHdrLE.fields.srow_y[0] = v2m[1][0];
      mv.mri.NiiHdrLE.fields.srow_y[1] = v2m[1][1];
      mv.mri.NiiHdrLE.fields.srow_y[2] = v2m[1][2];
      mv.mri.NiiHdrLE.fields.srow_y[3] = v2m[1][3];
      mv.mri.NiiHdrLE.fields.srow_z[0] = v2m[2][0];
      mv.mri.NiiHdrLE.fields.srow_z[1] = v2m[2][1];
      mv.mri.NiiHdrLE.fields.srow_z[2] = v2m[2][2];
      mv.mri.NiiHdrLE.fields.srow_z[3] = v2m[2][3];
      mv.mri.MatrixMm2Vox = mv.mri.mm2vox();
      globals.prevMatrix = null;
      multiplyAndUpdate(eye());
      mv.draw();
      printInfo();
    };
    reader.readAsText(file);
  };
  input.click();
}

/**
 * Save the affine matrix of the current MRI
 * to a text file.
 */
function saveMatrix() {
  const { mv } = globals;
  const a = document.createElement('a');
  const m = mv.mri.MatrixVox2Mm;
  const str = m.map((o) => o.join(' ')).join('%0A');
  a.href = 'data:text/plain;charset=utf-8,' + str;
  const name = prompt("Save Voxel To World Matrix (the inverse of the one displayed) As...", "reorient.mat");
  if(name !== null) {
    a.download = name;
    document.body.appendChild(a);
    a.click();
  }
}

/**
 * Load a volume selection from a text file.
 */
function loadSelection() {
  const { cropBox, mv } = globals;
  const input = document.createElement("input");
  input.type = "file";
  input.onchange = function() {
    const [file] = this.files;
    const reader = new FileReader();
    reader.onload = function(e) {
      const str = e.target.result;
      const arr = str.split('\n');
      const sel = arr.map((o) => o.split(' ').map((oo) => parseFloat(oo)));
      cropBox.min = {
        x: sel[0][0],
        y: sel[0][1],
        z: sel[0][2]
      };
      cropBox.max = {
        x: sel[1][0],
        y: sel[1][1],
        z: sel[1][2]
      };
      updateOverlaysFromCropBox();
      mv.draw();
      printInfo();
    };
    reader.readAsText(file);
  };
  input.click();
}

/**
 * Save the current selection to a text file.
 */
function saveSelection() {
  const { cropBox } = globals;
  const a = document.createElement('a');
  const str = [
    [cropBox.min.x, cropBox.min.y, cropBox.min.z].join(' '),
    [cropBox.max.x, cropBox.max.y, cropBox.max.z].join(' ')
  ].join('%0A');
  a.href = 'data:text/plain;charset=utf-8,' + str;
  const name = prompt("Save Selection As...", "selection.txt");
  if(name !== null) {
    a.download = name;
    document.body.appendChild(a);
    a.click();
  }
}

/**
 * Save the transformed version of the current MRI
 * in nifti format.
 */
function saveNifti() {
  const { cropBox, defaultCropBox, mv } = globals;

  // check whether cropBox was adjusted or still has default values
  if( JSON.stringify(cropBox) === JSON.stringify(defaultCropBox) ) {
    if(!confirm([
      "Did you remember to adapt the selection box?",
      "It still has the default values.",
      "Click OK to continue anyway,",
      "or Cancel and adjust it using the Select button."
    ].join(" "))) {
      return;
    }
  }

  // pixdim has 3 times the same value: the median of the original 3 pixdim values
  const { pixdim } = mv.dimensions.absolute;
  const dim = [
    Math.round(cropBox.max.x - cropBox.min.x),
    Math.round(cropBox.max.y - cropBox.min.y),
    Math.round(cropBox.max.z - cropBox.min.z)
  ];

  console.log("Crop volume dimensions:", dim);

  // Crop
  const data = new Float32Array(dim[0]*dim[1]*dim[2]);

  for(let i=0; i<dim[0]; i++) {
    for(let j=0; j<dim[1]; j++) {
      for(let k=0; k<dim[2]; k++) {
        const w = [
          (cropBox.min.x + i)*pixdim[0],
          (cropBox.min.y + j)*pixdim[1],
          (cropBox.min.z + k)*pixdim[2]
        ];
        const val = mv.A2Value(w);
        data[k*dim[1]*dim[0] + j*dim[0] + i] = val;
      }
    }
  }
  const v2m = [
    [pixdim[0], 0, 0, cropBox.min.x*pixdim[0]],
    [0, pixdim[1], 0, cropBox.min.y*pixdim[1]],
    [0, 0, pixdim[2], cropBox.min.z*pixdim[2]],
    [0, 0, 0, 1]
  ];
  const niigz = mv.mri.createNifti(dim, pixdim, v2m, data);
  const name = prompt("Save selection as...", "reoriented.nii.gz");
  if(name !== null) {
    mv.mri.saveNifti(niigz, name);
  }
}

export { loadMatrix, appendMatrix, saveMatrix, loadSelection, saveSelection, saveNifti };
