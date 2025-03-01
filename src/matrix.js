/**
 * @description Matrix manipulation functions
 */

/**
 * Rotation in the X-axis
 * @param {number} a Rotation angle in radians
 */
function alpha(a) {
  const c = Math.cos(a);
  const s = Math.sin(a);

  return [
    [c, -s, 0, 0],
    [s, c, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
}

/**
 * Rotation in the Y-axis
 * @param {number} a Rotation angle in radians
 */
function beta(a) {
  const c = Math.cos(a);
  const s = Math.sin(a);

  return [
    [c, 0, -s, 0],
    [0, 1, 0, 0],
    [s, 0, c, 0],
    [0, 0, 0, 1]
  ];
}

/**
 * Rotation in the Z-axis
 * @param {number} a Rotation angle in radians
 */
function gamma(a) {
  const c = Math.cos(a);
  const s = Math.sin(a);

  return [
    [1, 0, 0, 0],
    [0, c, -s, 0],
    [0, s, c, 0],
    [0, 0, 0, 1]
  ];
}

/**
 * 4x4 Identity matrix
 */
function eye() {
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
}

/**
 * Convert matrix to string representation
 * @param {array} matrix 4x4 matrix
 */
function matrix2str(matrix) {
  const str = matrix.map((row) => {
    return row.map((value) => {
      return ((value>=0)?' ':'') + value.toPrecision(2)
    });
  }).join('\n');

  return str;
}

export { alpha, beta, gamma, eye, matrix2str };
