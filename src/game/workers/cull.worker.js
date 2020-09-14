import sudoku from 'sudoku-umd';
import { times } from 'lodash';

import * as BoardUtils from '../board';
import * as Solver from '../solver';
import { SHOW_LOGS, UNIQUE_RESULT } from '../constants';

onmessage = function(event) {
  let startTime = Date.now();

  if (SHOW_LOGS) {
    console.log('CULL WORKER', event);
  }

  const { board, cullCount, attempts } = event.data;
  let attemptCount = 1;
  let culledBoard = null;
  let solution = false;

  // while the sudoku puzzle is not unique or unsolvable, keep retrying with different culls
  while (attemptCount < attempts) {
    console.time('Cull');
    culledBoard = cull(board, cullCount);
    console.timeEnd('Cull');

    console.time('Test Unique');
    //let copiedBoard = BoardUtils.createBoard(BoardUtils.toString(culledBoard));
    let isUnique = Solver.testUniqueness(culledBoard);
    console.timeEnd('Test Unique');

    if (isUnique !== UNIQUE_RESULT.UNIQUE) {
      if (SHOW_LOGS) {
        console.log('not a unique board');
      }

      continue;
    }

    console.time('Solve');
    //let solved = sudoku.solve(BoardUtils.toString(culledBoard).replace(/0/g, '.'));
    console.log(solved);
    //let solved = Solver.solve(culledBoard);
    console.timeEnd('Solve');

    //if (Solver.isBoardValid(solved) && BoardUtils.equals(board, solved)) {
    if (Solver.isBoardValid(culledBoard) && Solver.isBoardValid(board)) {
      if (SHOW_LOGS) {
        console.log('sweet, found a solution', BoardUtils.toString(solved));
      }

      // we already found a solution and current solution is not the same, board isn't unique
      if (solution !== null && !BoardUtils.equals(solution, solved)) {
        solution = false;
        break;
      }

      solution = true;
    }

    attemptCount++;
  }

  // if no unique solution was found, return null
  postMessage({ board: solution ? culledBoard : null, time: Date.now() - startTime });
}

// clears N cells from supplied sudoku board randomly
function cull(board, cullCount) {
  let culledBoard = BoardUtils.createBoard(board);
  let cells = times(81, i => i);  // fill array with seed values

  // pick a random number, splice off rnd number from array, set calculated row and column to 0
  times(cullCount, () => {
    let rnd = Math.floor(Math.random() * cells.length);
    let value = cells.splice(rnd, 1);
    let row = Math.floor(value / 9);
    let col = value - (row * 9);

    // set board cell to empty (0)
    //culledBoard[row][col] = 0;

    BoardUtils.setCell(culledBoard, row, col, 0);
  });

  return BoardUtils.createBoard(BoardUtils.toString(culledBoard));
}
