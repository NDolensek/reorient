/**
 * @description MRI viewer initialization and display functions
 */

import globals from './globals.js';
import { printInfo } from './transform.js';
import { mouseDown, mouseMove, mouseUp } from './events.js';
import { updateOverlaysFromCropBox, updateCropBoxFromOverlay, initCropBox } from './cropbox.js';

/**
 * Update progress during file loading
 * @param {object} e Progress event
 */
function updateProgress(e) {
  if (e.lengthComputable) {
    const percentComplete = e.loaded / e.total;
    console.log("%", percentComplete);
  } else {
    console.log('Unable to compute progress information since the total size is unknown');
  }
}

/**
 * Create an MRI viewer with 3 panes
 */
function newMRIViewer({file, path}) {
  globals.mv = new MRIViewer({
    mriFile: file,
    mriPath: path,
    space: "absolute",
    views: [
      { elem: $('#viewer1').get(0), plane: 'sag' },
      { elem: $('#viewer2').get(0), plane: 'cor' },
      { elem: $('#viewer3').get(0), plane: 'axi' }
    ]
  });
}

/**
 * Load and display the MRI views
 */
async function displayMRI() {
  const { mv } = globals;

  try {
    await mv.display(updateProgress);
  } catch(err) {
    throw new Error(err);
  }

  // Save the original matrix for reset
  globals.origMatrix = JSON.parse(JSON.stringify(mv.mri.MatrixMm2Vox));

  // Add click event listeners
  for(let ii=0; ii<mv.views.length; ii++) {
    (function(i) {
      mv.views[i].canvas.addEventListener('mousedown', (e) => mouseDown(mv.views[i], e));
      mv.views[i].canvas.addEventListener('mousemove', (e) => mouseMove(mv.views[i], e));
      mv.views[i].canvas.addEventListener('mouseup', (e) => mouseUp(mv.views[i], e));
    }(ii));
  }

  // Add an overlay for the cropping
  for(let ii=0; ii<mv.views.length; ii++) {
    $(mv.views[ii].elem).find('.wrap')
      .append(`<div class='overlay' id='overlay${ii}'>`);
    (function(i) {
      MUI.crop(`#overlay${i}`, (box) => { updateCropBoxFromOverlay(mv.views[i], box); });
    }(ii));
  }
  updateOverlaysFromCropBox();

  // print transformation matrix
  printInfo();

  $('span').show();
  $('#tools, #saveNifti, #loadSelection, #saveSelection, #loadMatrix, #appendMatrix, #saveMatrix, #resetMatrix, #resetSelection, #info').show();
  $('#footer').hide();
  $('#buttons').removeClass('init');
  $('#loadNifti').removeClass('mui-no-border');
}

/**
 * Start Reorient from an MRI file path
 * @param {string} path Local path to MRI file
 */
async function initWithPath(path) {
  initCropBox();
  newMRIViewer({path});
  try {
    await displayMRI();
  } catch(err) {
    throw new Error(err);
  }
  console.log("globals.mv.mri", globals.mv.mri);
}

/**
 * Start Reorient from a File object
 * @param {object} file File object
 */
async function init(file) {
  initCropBox();
  newMRIViewer({file: file});
  try {
    await displayMRI();
  } catch(err) {
    throw new Error(err);
  }
}

/**
 * Display error message when loading NIFTI file fails
 * @param {Error} err Error object
 */
function loadNiftiFailedMessage(err) {
  let errorMessage = `
    <div>
      Sorry, something went wrong with that file.
      You can
      <a
        href="https://neuroanatomy.github.io/reorient"
        style="color:white"
      >reload</a> and try again, or
      <a
        href="https://github.com/neuroanatomy/reorient/issues"
        style="color:white"
      >get in touch with us</a> if you think it's a bug.
    </div>
    `;

  // check if file is unusually large
  const res = err.toString().match(/Invalid typed array length: ([0-9]+)/);
  if(res) {
    const mb = parseInt(res[1])/2**20;
    if(mb>200) {
      errorMessage += `
        <div>
        The file size (${Math.round(mb)} MB) is unusually large.
        </div>
        `;
    }
  }

  document.querySelector(".box_error").innerHTML = errorMessage;
  $(".box").addClass("is-error").removeClass("is-uploading");;
  console.log(err);
}

/**
 * Load a nifti file.
 */
function loadNifti() {
  const input=document.createElement("input");
  input.type="file";
  input.onchange=function() {
    $(".box").addClass("is-uploading").removeClass("is-error");
    const [file]=this.files;
    console.log('loading', file);
    init(file)
      .catch(loadNiftiFailedMessage);
  };
  input.click();
}

export { updateProgress, initWithPath, init, loadNifti, loadNiftiFailedMessage };
