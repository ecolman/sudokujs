import * as BoardUtils from '../board';
import * as Solver from '../solver';
import * as Utils from '../utilities';
import { SHOW_LOGS } from '../constants';

onmessage = function(event) {
  let startTime = Date.now();

  if (SHOW_LOGS) {
    console.log('SOLVER WORKER', event);
  }

  const newBoard = BoardUtils.createBoard();
  let cellNumbers = []; // multi-dimensional array to keep track of which numbers have been tried in each cell

  for (let x = 0; x < 81; x++) {
    cellNumbers[x] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  for (let i = 0; i < 81; i++) {
    let found = false;
    const pos = Utils.getRowColumn(i);

    while (cellNumbers[i].length > 0) {
      // picks a random number to try
      const rnd = Math.floor(Math.random() * cellNumbers[i].length);
      const value = cellNumbers[i].splice(rnd, 1)[0];

      BoardUtils.setCell(newBoard, pos.row, pos.col, value);

      if (Solver.isCellValid(newBoard, pos.row, pos.col, true)) {
        found = true;
        break;
      } else {
        BoardUtils.setCell(newBoard, pos.row, pos.col, 0);
        found = false;
        continue;
      }
    }

    // couldn't find a possible number, backtrack and try again
    if (!found) {
      cellNumbers[i] = [1, 2, 3, 4, 5, 6, 7, 8, 9];  // reset cell numbers

      // go back 2 in the loop to backtrack to last cell
      i -= 2;
    }
  }

  if (SHOW_LOGS) {
    console.log(BoardUtils.toString(newBoard));
  }

  postMessage({ board: newBoard, time: Date.now() - startTime });
}
