import * as BoardUtils from './board';
import Solver from './solver';
import * as Utils from './utilities';

class Generator {
  constructor() {
    this.lastGeneration = {
      steps: 0,
      time: 0
    };
    this.enableWebWorkers = false;
    this.attemptsPerBoard = 10;
    this.boardsToAttempt = 10;
  }

  generate(cullCount) {
    this.lastGeneration.time = 0;
    this.lastGeneration.steps = 0;
    let solved = null;
    let culled = null;
    let boards = 1;

    // loop to generate board and then try to create a player board with a unique solution
    while (boards < this.boardsToAttempt && culled === null) {
      solved = this.generateSolved();
      culled = this.generateCulled(solved, cullCount, this.attemptsPerBoard);

      boards++;
      //console.log(solved.toString(), culled ? culled.toString() : '');
    }

    // console.log(solved);
    // console.log(culled);
    console.log(`culled ${cullCount} cells from ${boards} boards with ${this.lastGeneration.steps} steps, taking ${this.lastGeneration.time / 1000} seconds to complete`);

    return {
      base: culled,
      solved: solved
    }
  }

  // clears N cells from supplied sudoku board randomly
  cull(board, cullCount) {
    let culledBoard = BoardUtils.createBoard(BoardUtils.toString(board));
    let cells = _.times(81, i => i);  // fill array with seed values

    // pick a random number, splice off rnd number from array, set calculated row and column to 0
    _.times(cullCount, () => {
      let rnd = Math.floor(Math.random() * cells.length);
      let value = cells.splice(rnd, 1);
      let row = Math.floor(value / 9);
      let col = value - (row * 9);

      // set board cells to empty (0)
      BoardUtils.setCell(culledBoard, row, col, 0);
    })

    return culledBoard;
  }

  // generate a single solution culled board
  generateCulled(board, cullCount, attempts = 5) {
    let attemptCount = 1;
    let culledBoard = this.cull(board, cullCount);;
    let solution = null;

    if (this.enableWebWorkers) {
      // start the workers
      this.sendNewBoardsToSolver(cullCount);
    } else {
      // while the sudoku puzzle is not unique or unsolvable, keep retrying with different culls
      while (attemptCount < attempts) {
        let copiedBoard = BoardUtils.createBoard(BoardUtils.toString(culledBoard));
        let solved = Solver.solve(copiedBoard);

        this.lastGeneration.time += Solver.lastSolution.time;
        this.lastGeneration.steps += Solver.lastSolution.steps;

        if (Solver.isBoardValid(solved) && BoardUtils.equals(board, solved)) {
          console.log('sweet, found a solution', BoardUtils.toString(solved));
          // we already found a solution and current solution is not the same, board isn't unique
          if (solution !== null && !BoardUtils.equals(solution, solved)) {
            solution = false;
            break;
          }

          solution = solved;
        }

        attemptCount++;
      }
    }

    // if no unique solution was found, return null
    return solution ? culledBoard : null;
  }

  // generate solved sudoku board using the backtrack algorithm
  generateSolved() {
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

    console.log(BoardUtils.toString(newBoard));
    return newBoard;
  }
}

export default new Generator();
