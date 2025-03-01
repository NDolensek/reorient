/**
 * @description Transformation functions for rotation and translation
 */

import globals from './globals.js';
import { alpha, beta, gamma, eye, matrix2str } from './matrix.js';

/**
 * Update the current MRI affine matrix
 * @param {array} mat 4x4 matrix
 */
function multiplyAndUpdate(mat) {
  const { mv } = globals;
  let m2v = mv.mri.MatrixMm2Vox;
  const tmp = mv.mri.inv4x4Mat([...m2v[0], ...m2v[1], ...m2v[2], ...m2v[3]]);
  const v2m = [tmp.splice(0, 4), tmp.splice(0, 4), tmp.splice(0, 4), tmp];
  if(globals.prevMatrix === null ) {
    globals.prevMatrix = JSON.parse(JSON.stringify(m2v));
  }
  m2v = mv.mri.multMatMat(globals.prevMatrix, mat);
  mv.mri.MatrixMm2Vox = m2v;
  mv.mri.MatrixVox2Mm = v2m;
}

/**
 * Rotate the current MRI
 * @param {string} axis Rotation axis, either 'x', 'y' or 'z'
 * @param {number} val Rotation angle
 */
function rotate(axis, val) {
  const { mv } = globals;

  if(globals.prevMatrix === null) {
    globals.prevMatrix = JSON.parse(JSON.stringify(mv.mri.MatrixMm2Vox));
  }
  switch(axis) {
    case 'x':
      multiplyAndUpdate(alpha(val));
      break;
    case 'y':
      multiplyAndUpdate(beta(val));
      break;
    case 'z':
      multiplyAndUpdate(gamma(val));
      break;
  }
  mv.draw();
  printInfo();
}

/**
 * Translate the current MRI
* @param {array} delta Array with translation [x, y, z]
 */
function trans(delta) {
  const { mv } = globals;
  if(globals.prevMatrix === null) {
    globals.prevMatrix = JSON.parse(JSON.stringify(mv.mri.MatrixMm2Vox));
  }
  const m = eye();
  // const {pixdim} = mv.mri;
  // m[0][3] = delta[0]*pixdim[0];
  // m[1][3] = delta[1]*pixdim[1];
  // m[2][3] = delta[2]*pixdim[2];
  const [pix] = mv.dimensions.absolute.pixdim; //  mv.mri.pixdim;
  m[0][3] = delta[0]*pix;
  m[1][3] = delta[1]*pix;
  m[2][3] = delta[2]*pix;
  multiplyAndUpdate(m);
  mv.draw();
  printInfo();
}

/**
 * Reset the MRI affine matrix to its original value
 */
function resetMatrix() {
  const { mv, origMatrix } = globals;
  mv.mri.MatrixMm2Vox = JSON.parse(JSON.stringify(origMatrix));
  globals.prevMatrix = null;
  multiplyAndUpdate(eye());
  mv.draw();
  printInfo();
}

/**
 * Print information about the current MRI
 */
function printInfo() {
  const { cropBox, mv } = globals;
  const v2m = mv.mri.MatrixVox2Mm;
  const m2v = mv.mri.MatrixMm2Vox;
  const str = [
    `${mv.mri.fileName}`,
    `${mv.mri.dim[0]}x${mv.mri.dim[1]}x${mv.mri.dim[2]}`,
    matrix2str(m2v),
    matrix2str(v2m),
    `(${cropBox.min.x},${cropBox.min.y},${cropBox.min.z})\n(${cropBox.max.x},${cropBox.max.y},${cropBox.max.z})`
  ];
  for(let i = 0; i < str.length; i++ ) {
    document.querySelector(`#info${i}`).innerHTML = `<pre>${str[i]}</pre>`;
  }
}

export { multiplyAndUpdate, rotate, trans, resetMatrix, printInfo };
