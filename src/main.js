/**
 * @description Main entry point for the Reorient application
 */

/* globals MUI, $ */

import globals from './globals.js';
import { initUI } from './ui.js';
import { init, loadNiftiFailedMessage } from './viewer.js';

// Make globals available to the window object for debugging
window.globals = globals;

// Initialize the UI when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  initUI(MUI);

  // Set up drag and drop functionality
  let file = false;
  $(".box")
    .on("drag dragstart dragend dragover dragenter dragleave drop", function(e) {
      e.preventDefault();
      e.stopPropagation();
    })
    .on("dragover dragenter", function() {
      $(".box").addClass("is-dragover");
    })
    .on("dragleave dragend drop", function() {
      $(".box").removeClass("is-dragover");
    })
    .on("drop", function(e) {
      file = e.originalEvent.dataTransfer.files;
      if ($(".box").hasClass("is-uploading")) {
        return false;
      }
      $(".box").addClass("is-uploading").removeClass("is-error");
      e.preventDefault();
      if (file) {
        init(file[0])
          .catch(loadNiftiFailedMessage);
      }
    });
});
