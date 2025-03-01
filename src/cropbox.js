/**
 * @description Crop box manipulation functions
 */

import globals from './globals.js';
import { printInfo } from './transform.js';

/**
 * Update the display of the selection box overlay 
 * based on the cropBox dimensions
 */
function updateOverlaysFromCropBox() {
  const { cropBox, mv } = globals;
  /*
  Currently, all views have the same dimensions, which allows us
  to get rect dimensions only from the first one
  */
  const rect = mv.views[0].canvas.getBoundingClientRect();

  // the size of the cropBox in screen pixels
  const { W } = mv.dimensions.absolute.sag;
  console.log("Width:", W);
  const step = rect.width/W;
  const origin = (W-Math.floor(W/2))*step;
  const min = {
    x: cropBox.min.x * step,
    y: cropBox.min.y * step,
    z: cropBox.min.z * step
  };
  const max = {
    x: cropBox.max.x * step,
    y: cropBox.max.y * step,
    z: cropBox.max.z * step
  };

  for(const view of mv.views) {
    const [ov] = $(view.elem).find('.overlay');
    switch(view.plane) {
      case 'sag':
        $(ov).css({
          left: `${rect.width - origin + min.y}px`,
          top: `${origin - max.z}px`,
          width: `${max.y - min.y}px`,
          height: `${max.z - min.z}px`
        });
        break;
      case 'cor':
        $(ov).css({
          left: `${rect.width - origin + min.x}px`,
          top: `${origin - max.z}px`,
          width: `${max.x - min.x}px`,
          height: `${max.z - min.z}px`
        });
        break;
      case 'axi':
        $(ov).css({
          left: `${rect.width - origin + min.x}px`,
          top: `${origin - max.y}px`,
          width: `${max.x - min.x}px`,
          height: `${max.y - min.y}px`
        });
        break;
    }
  }
}

/**
 * Update the cropBox based on the displayed overlay
 * @param {object} view MRIViewer object
 * @param {object} box A rectangle with properties {left, top, width, height}
 */
function updateCropBoxFromOverlay(view, box) {
  const { mv, cropBox } = globals;
  const rect = view.canvas.getBoundingClientRect();
  const { W } = mv.dimensions.absolute.sag;
  const g = W/rect.width;
  const origin = (W-Math.floor(W/2))/g;

  switch(view.plane) {
    case 'sag':
      cropBox.min.y = Math.round(g*(box.left - rect.width + origin));
      cropBox.min.z = Math.round(g*(origin - box.top - box.height));
      cropBox.max.y = Math.round(g*(box.width + box.left - rect.width + origin));
      cropBox.max.z = Math.round(g*(origin - box.top));
      break;
    case 'cor':
      cropBox.min.x = Math.round(g*(box.left - rect.width + origin));
      cropBox.min.z = Math.round(g*(origin - box.top - box.height));
      cropBox.max.x = Math.round(g*(box.width + box.left - rect.width + origin));
      cropBox.max.z = Math.round(g*(origin - box.top));
      break;
    case 'axi':
      cropBox.min.x = Math.round(g*(box.left - rect.width + origin));
      cropBox.min.y = Math.round(g*(origin - box.top - box.height));
      cropBox.max.x = Math.round(g*(box.width + box.left - rect.width + origin));
      cropBox.max.y = Math.round(g*(origin - box.top));
      break;
  }
  updateOverlaysFromCropBox();
  printInfo();
}

/**
 * Reset the selection to the default value
 */
function resetSelection() {
  initCropBox();
  updateOverlaysFromCropBox();
  printInfo();
}

/**
 * Initialise cropBox to default values
 */
function initCropBox() {
  globals.cropBox = JSON.parse(JSON.stringify(globals.defaultCropBox));
}

export { updateOverlaysFromCropBox, updateCropBoxFromOverlay, resetSelection, initCropBox };
