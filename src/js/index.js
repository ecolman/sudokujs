'use strict';

import Board from './board';
import Game from './game';
import Solver from './solver';
import Generator from './generator';
import Ui from './svg';

import { boardTypes } from './constants';

let cells = [0,0,0,1,2,3,0,0,0,0,8,2,0,0,9,0,0,0,0,0,0,4,0,0,2,5,9,0,2,0,0,0,8,0,6,4,3,0,0,0,6,4,0,0,1,0,0,6,0,7,0,0,0,0,2,9,0,0,1,0,0,8,0,7,6,0,0,0,0,0,0,0,8,0,5,3,0,0,0,0,2];

// let board = new Board([0,0,0,0,0,5,0,7,0,0,6,0,0,0,4,5,3,8,0,0,0,0,0,9,0,0,2,0,0,8,0,0,0,0,0,9,0,3,0,0,1,0,0,6,0,7,0,0,0,0,0,8,0,0,3,0,0,5,0,0,0,0,0,8,1,2,3,0,0,0,4,0,0,7,0,2,0,0,0,0,0]);
// let solved = Solver.solve(board);

// console.log(Solver.isBoardValid(board), solved.toString());
// console.log(`${Solver.lastSolution.steps} steps, ${Solver.lastSolution.time}ms`);

// let boards = Generator.generate(50);

let board = new Board(cells);

console.log(board.toString());

_.times(10, i => {
  let solved = Solver.solve(board);

  if (solved) {
    console.log(i, solved.toString());
  } else {
    console.log(i, 'no solution found');
  }
})


// if (boards && boards.base && boards.solved) {
//   let result = Solver.isBoardValid(boards.base, true);
//   console.log(boards.base.toString(), boards.solved.toString());
//   console.log('RESULT - ', result);
// } else {
//   console.log('no solution found');
// }

// initialize ui with id and board
// Ui(b);

// console.log(b, b.getRegion(BoardTypes.IN_PROGRESS, 5, 3));

// console.log(b.toArray(boardTypes.player));

// console.log(Solver.isRegionValid(b, 5, 5));

