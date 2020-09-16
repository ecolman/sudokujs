import { times } from 'lodash';

// import CullWorker from './workers/cull.worker';
// import SolverWorker from './workers/solver.worker';
import * as BoardUtils from './board';
import * as Solver from './solver';
import * as Utils from './utilities';
import { SHOW_LOGS, UNIQUE_RESULT } from './constants';

import { ATTEMPTS_PER_BOARD, BOARDS_TO_ATTEMPT, WEB_WORKERS_ENABLED } from './constants';

export let lastGeneration = {
  steps: 0,
  time: 0,
  boards: 0
};

export function generate(cullCount) {
  lastGeneration = {
    steps: 0,
    time: 0,
    boards: 0
  };

  let solution = null;
  let culled = null;
  let boards = 0;
  let totalTime = 0;

  return new Promise((resolve, reject) => {
    if (WEB_WORKERS_ENABLED) {
      const solverWorker = new SolverWorker();

      solverWorker.onmessage = sEvent => {
        let attempts = 0;
        let board = sEvent.data.board;

        //if (SHOW_LOGS) {
          console.log(`SOLVER WORKER MESSAGE, took ${sEvent.data.time / 1000}`, sEvent, boards);
        //}

        totalTime += sEvent.data.time;
        attempts = 0;
        boards++;

        const cullWorker = new CullWorker();

        // cull message
        cullWorker.onmessage = cEvent => {
          totalTime += cEvent.data.time;
          attempts++;
          //if (SHOW_LOGS) {
            console.log(`CULL WORKER MESSAGE, took ${cEvent.data.time / 1000}`, cEvent, attempts);
          //}

          if (cEvent.data) {
            lastGeneration.boards = boards;

            resolve({
              base: BoardUtils.toString(cEvent.data),
              solution: BoardUtils.toString(sEvent.data),
              time: totalTime
            });
          } else if (attempts < ATTEMPTS_PER_BOARD) {
            cullWorker.postMessage({ board, cullCount, attempts: ATTEMPTS_PER_BOARD })
          } else if (boards < BOARDS_TO_ATTEMPT) {
            solverWorker.postMessage({});
          } else {
            reject({ message: 'cull error, attempt limit exceeded'});
          }
        }

        // cull error
        cullWorker.onerror = event => {
          console.error(event);
        }

        // kick off cull if we're under board limit
        if (boards < BOARDS_TO_ATTEMPT) {
          cullWorker.postMessage({ board: sEvent.data, cullCount, attempts: ATTEMPTS_PER_BOARD })
        } else {
          reject({ message: 'solver error, board limit exceeded', boards});
        }
      }

      // solver erropr
      solverWorker.onerror = event => {
        console.error(event);
      }

      // kick it off
      solverWorker.postMessage({});
    } else {
      let startTime = Date.now();
      // loop to generate board and then try to create a player board with a unique solution
      while (boards < BOARDS_TO_ATTEMPT && culled === null) {
        solution = generateSolved();
        culled = generateCulled(solution, cullCount, ATTEMPTS_PER_BOARD);

        boards++;
      }

      lastGeneration.boards = boards;

      if (SHOW_LOGS) {
        console.log(`culled ${cullCount} cells from ${boards} boards with ${lastGeneration.steps} steps, taking ${lastGeneration.time / 1000} seconds to complete`);
        console.log('solution', solution);
      }

      resolve({
        base: BoardUtils.toString(culled),
        solution: BoardUtils.toString(solution),
        time: Date.now() - startTime
      });
    }
  });
}

// clears N cells from supplied sudoku board randomly
export function cull(board, cullCount) {
  let culledBoard = BoardUtils.createBoard(BoardUtils.toString(board));
  let cells = times(81, i => i);  // fill array with seed values

  // pick a random number, splice off rnd number from array, set calculated row and column to 0
  times(cullCount, () => {
    let rnd = Math.floor(Math.random() * cells.length);
    let value = cells.splice(rnd, 1);
    let row = Math.floor(value / 9);
    let col = value - (row * 9);

    // set board cell to empty (0)
    BoardUtils.setCell(culledBoard, row, col, 0);
  })

  return culledBoard;
}

// generate a single solution culled board
export function generateCulled(board, cullCount, attempts = ATTEMPTS_PER_BOARD) {
  let attemptCount = 1;
  let culledBoard = null;
  let solution = null;

  // while the sudoku puzzle is not unique or unsolvable, keep retrying with different culls
  while (attemptCount < attempts) {
    culledBoard = cull(board, cullCount);
    //let copiedBoard = BoardUtils.createBoard(BoardUtils.toString(culledBoard));
    let isUnique = Solver.testUniqueness(culledBoard);

    if (isUnique !== UNIQUE_RESULT.UNIQUE) {
      console.log('not a unique board');
      continue;
    }

    let solved = Solver.solve(culledBoard);

    lastGeneration.time += Solver.lastSolution.time;
    lastGeneration.steps += Solver.lastSolution.steps;

    if (Solver.isBoardValid(solved) && BoardUtils.equals(board, solved)) {
      if (SHOW_LOGS) {
        console.log('sweet, found a solution', BoardUtils.toString(solved));
      }

      // we already found a solution and current solution is not the same, board isn't unique
      if (solution !== null && !BoardUtils.equals(solution, solved)) {
        solution = false;
        break;
      }

      solution = solved;
    }

    attemptCount++;
  }

  // if no unique solution was found, return null
  return solution ? culledBoard : null;
}

// generate solved sudoku board using the backtrack algorithm
export function generateSolved() {
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

  return newBoard;
}
