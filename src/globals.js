/**
 * @description Global variables and constants
 */
const globals = {
  mouseIsDown: false,
  // Global variable that keeps track of the tool used: Translate, Rotate or Select
  // (set to Translate by default).
  selectedTool: 'Translate',
  defaultCropBox: {
    min: {
      x: -20,
      y: -20,
      z: -20
    },
    max: {
      x: 20,
      y: 20,
      z: 20
    }
  },
  cropBox: {},
  mv: null,
  origMatrix: null,
  prevMatrix: null
};

export default globals;
