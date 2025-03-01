/**
 * @description Mouse event handlers
 */

import globals from './globals.js';
import { rotate, trans } from './transform.js';

/**
 * Transform mouse coordinates to canvas
 * @param {object} canvas Viewer canvas
 * @param {object} e Mouse event
 */
function mouse2canvas(canvas, e) {
  const r = canvas.getBoundingClientRect();
  const sx = canvas.width / r.width;
  const sy = canvas.height / r.height;

  return {
    x: (e.clientX - r.left)*sx,
    y: (e.clientY - r.top)*sy

    // use this to force translation by discrete steps
    // x: Math.floor((e.clientX - r.left)*sx),
    // y: Math.floor((e.clientY - r.top)*sy)
  };
}

/**
 * Respond to mouse down
 * @param {object} view MRIViewer object
 * @param {object} e Mouse event
 */
function mouseDown(view, e) {
  globals.mouseIsDown = true;
  view.prevMouseCoords = mouse2canvas(view.canvas, e);
}

/**
 * Respond to mouse move for rotations and translations
 * @param {object} view MRIViewer object
 * @param {object} e Event
 */
function mouseMove(view, e) {
  if( !globals.mouseIsDown ) {
    return;
  }
  const m = mouse2canvas(view.canvas, e);
  const delta = {
    x: m.x - view.prevMouseCoords.x,
    y: m.y - view.prevMouseCoords.y
  };

  switch(globals.selectedTool) {
    case 'Translate':
      switch(view.plane) {
        case 'sag':
          trans([0, -delta.x, delta.y]);
          break;
        case 'cor':
          trans([-delta.x, 0, delta.y]);
          break;
        case 'axi':
          trans([-delta.x, delta.y, 0]);
          break;
      }
      break;
    case 'Rotate': {
      const n = Math.sqrt(view.prevMouseCoords.x**2 + view.prevMouseCoords.y**2);
      const i = {
        x: view.prevMouseCoords.x/n,
        y: view.prevMouseCoords.y/n
      };
      const j = {x:-i.y, y: i.x};
      const x = m.x*i.x + m.y*i.y;
      const y = m.x*j.x + m.y*j.y;
      const angle = Math.atan2(y, x);
      switch(view.plane) {
        case 'sag':
          rotate('z', angle);
          break;
        case 'cor':
          rotate('y', angle);
          break;
        case 'axi':
          rotate('x', angle);
          break;
      }
      break;
    }
  }
}

/**
 * Respond to mouse up, resets the transformation matrix
 */
function mouseUp() {
  globals.mouseIsDown = false;
  globals.prevMatrix = null;
}

export { mouseDown, mouseMove, mouseUp };
