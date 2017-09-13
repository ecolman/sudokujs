import Raphael from 'raphael';
import ScaleRaphael from './frameworks/scale.raphael'
import $ from 'jquery';

import { BoardTypes, Board } from './board';
import State from './state'
import Solver from './solver'

const boardId = 'board';

$(document).ready(() => {
  $('body').prepend(`<div id="${boardId}"></div>`);

  let b = new Board();

  const boardArray = [2,9,5,4,8,3,6,7,1,4,1,3,7,5,6,8,9,2,7,6,8,1,2,9,3,4,5,8,4,1,5,6,2,7,3,9,3,2,7,8,9,4,1,5,6,6,5,9,3,1,7,4,2,8,5,7,6,9,4,1,2,8,3,9,3,2,6,7,8,5,1,4,1,8,4,2,3,5,9,6,7];

  b.setBoard(BoardTypes.PLAYER, boardArray);

  // console.log(b, b.getRegion(BoardTypes.IN_PROGRESS, 5, 3));

  console.log(b.toArray(BoardTypes.PLAYER));

  console.log(Solver.isRegionValid(b, 5, 5));
});
