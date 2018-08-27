'use strict';

import $ from 'jquery';

import Raphael from 'raphael';
import ScaleRaphael from './scale.raphael'

import Menu from './menu';
import uiBoard from './board';

var paper = null;

export default function(board, id = 'board') {
  $(document).ready(() => {
    $('body').prepend(`<div id="${id}"></div>`);

    let el = $(`#${id}`);

    Raphael(() => {
      paper = new ScaleRaphael(id, 545, 623); // create paper

      let b = new uiBoard(paper, board);
      let m = new Menu(paper);

      // sudoku.initialize();    // init sudoku engine
      // board.initialize(paper);   // init board UI
      // menu.initialize(paper);    // init menu UI
      resizePaper();  // resize paper based on size of window

      $(window).resize(resizePaper);  // set resize event to a utility function
    });
  });
}



/**
* Checks if the page is touch enabled or not, then resizes based on window size + modifier
* @method
*/
function resizePaper() {
  var win = $(window);

  var ox = paper.h;
  var oy = paper.w;

  var x = (win.width() > 900) ? 900 : win.width();
  var y = (win.height() > 800) ? 800 : win.height() - 50;  // if touch enabled, change the height slightly
  // var y = (win.height() > 800 && !board.touchEnabled) ? 800 : win.height() - 50;  // if touch enabled, change the height slightly
  //var y = win.height() - 50;  // if touch enabled, change the height slightly

  paper.changeSize(x, y, false, false); // set size of paper. method signature: (w, h, center, clipping)
}
