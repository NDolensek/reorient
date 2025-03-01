/**
 * @description UI setup and event handlers
 */

import globals from './globals.js';
import { resetMatrix } from './transform.js';
import { resetSelection } from './cropbox.js';
import { loadMatrix, appendMatrix, saveMatrix, loadSelection, saveSelection, saveNifti } from './fileio.js';
import { loadNifti } from './viewer.js';

/**
 * Select the active tool (Translate, Rotate, or Select)
 * @param {string} option Tool name
 */
function selectTool(option) {
  globals.selectedTool = option;
  if(globals.selectedTool === 'Select') {
    $('.overlay').show();
  } else {
    $('.overlay').hide();
  }
}

/**
 * Connect UI elements to functions
 * @param {object} MUI Reference to UI widgets
 */
function initUI(MUI) {
  // Initialise UI
  MUI.chose($('#tools'), selectTool);
  MUI.push($('#loadNifti'), loadNifti);
  MUI.push($('#saveNifti'), saveNifti);
  MUI.push($('#loadMatrix'), loadMatrix);
  MUI.push($('#appendMatrix'), appendMatrix);
  MUI.push($('#saveMatrix'), saveMatrix);
  MUI.push($('#loadSelection'), loadSelection);
  MUI.push($('#saveSelection'), saveSelection);
  MUI.push($('#resetMatrix'), resetMatrix);
  MUI.push($('#resetSelection'), resetSelection);

  // selectTool("Select");
}

export { selectTool, initUI };
