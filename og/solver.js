import * as boardConstants from './constants';
import Board from './board';
import Utils from './utilities';

class Solver {
  constructor() {
    this.lastSolution = {
      board: null,
      steps: 0,
      time: 0
    };
  }

  isCellValid(board, row = 0, col = 0, zeroValid = false) {
    if (board) {
      let value = board[row][col];

      if (!zeroValid && value === 0) {
        return false;
      }

      return this.isRowValid(board, row, zeroValid) && this.isColumnValid(board, col, zeroValid) && this.isRegionValid(board, row, col, zeroValid);
    }

    return null;
  }

  isRowValid(board, row = 0, zeroValid = false) {
    if (board) {
      let r = board.getRow(row);
      let numbers = [];

      for (let count = 0; count < r.length; count++) {
        let value = r[count];

        if (!zeroValid && value === 0) {
          return false;
        }

        if (numbers.indexOf(value) > -1) {
          return false;
        }

        if (value !== 0) {
          numbers.push(value);
        }
      }

      return true;
    }

    return false;
  }

  isColumnValid(board, col = 0, zeroValid = false) {
    if (board) {
      let c = board.getColumn(col);
      let numbers = [];

      for (let count = 0; count < c.length; count++) {
        let value = c[count];

        if (!zeroValid && value === 0) {
          return false;
        }

        if (numbers.indexOf(value) > -1) {
          return false;
        }

        if (value !== 0) {
          numbers.push(value);
        }
      }

      return true;
    }

    return false;
  }

  isRegionValid(board, row = 0, col = 0, zeroValid = false) {
    if (board) {
      let region = board.getRegion(row, col);
      let numbers = [];

      for (let count = 0; count < region.length; count++) {
        let value = region[count];

        if (!zeroValid && value === 0) {
          return false;
        }

        if (numbers.indexOf(value) > -1) {
          return false;
        }

        if (value !== 0) {
          numbers.push(value);
        }
      }

      return true;
    }

    return false;
  }

  isBoardValid(board, zeroValid = false) {
    if (board) {
      let valid = true;

      for(let i = 0; i < 81; i++) {
        let pos = Utils.getRowColumn(i);
        valid = this.isCellValid(board, pos.row, pos.col, zeroValid);

        if (!valid) {
          //console.log(`validation failed on position ${pos.row}, ${pos.col}`)
          break;
        }
      }

      return valid;
    }

    return false;
  }

  solve(board) {
    const startTime = Date.now();
    const possibleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const originalBoard = new Board(board.toArray());

    let invalidNumbers = [];
    let lastCellIndex = 0;
    let steps = 0;
    let attempts = 0;

    if (!this.isBoardValid(board, true)) {
      return false;
    }

    for (let i = 0; i < 81; i++) {
      steps++;

      if (steps >= 100000) {
        break;
      }

      let pos = Utils.getRowColumn(i);

      if (board[pos.row][pos.col] === 0) {
        let found = false;

        // get all numbers used on row, column, and region
        let usedNumbers = board.getRow(pos.row)
          .concat(board.getColumn(pos.col))
          .concat(board.getRegion(pos.row, pos.col));

        usedNumbers = _.sortBy(_.filter(_.uniq(usedNumbers), i => i != 0)); // unique values, remove 0's
        let validNumbers = _.difference(possibleNumbers, usedNumbers.concat(invalidNumbers[i]));  // find unused and valid numbers

        let validNumbersEmpty = !validNumbers || validNumbers.length === 0;

        if (!validNumbersEmpty) {
          //console.log(`testing ${validNumbers} in cell ${pos.row}, ${pos.col}`);
        }

        while (validNumbers.length > 0) {
          // pick a random number to try
          let rnd = Math.floor(Math.random() * validNumbers.length);
          let value = validNumbers.splice(rnd, 1)[0];
          board.setCell(pos.row, pos.col, value);

          // check that we haven't seen this solution before, then check if it's valid
          if (this.isCellValid(board, pos.row, pos.col, true)) {
            found = true;
            //console.log(`${value} is valid in cell ${pos.row}, ${pos.col}`);
            break;
          } else {
            //console.log(`${value} is not valid in cell ${pos.row}, ${pos.col}, removing`);
          }
        }

        // no valid value found, backtrack
        if (validNumbersEmpty || !found) {
          board.setCell(pos.row, pos.col, 0);
          //console.log(`no values worked for cell ${pos.row}, ${pos.col}, backtracking`);

          if (i >= 1) {
            // get previously set cell and set that to 0
            let prevPos = Utils.getRowColumn(lastCellIndex);
            let prevValue = board.getCell(prevPos.row, prevPos.col);

            // since no solution was found, add that number to invalid numbers
            invalidNumbers[lastCellIndex] = [prevValue].concat(invalidNumbers[lastCellIndex] || []);
            board.setCell(prevPos.row, prevPos.col, 0);

            i = lastCellIndex - 1;
          } else {
            attempts++;

            if (attempts > 10) {
              //break;
            }

            // reset everything
            board = new Board(originalBoard.toArray());
            invalidNumbers = [];
            i = -1;
            lastCellIndex = 0;
            continue;
          }
        }

        lastCellIndex = i;
      }
    }

    this.lastSolution.board = board;
    this.lastSolution.time = Date.now() - startTime;
    this.lastSolution.steps = steps;

    console.log(`${steps} steps solved ${_.filter(board.toArray(), s => s !== 0).length} cells, ${board.toString()}`);

    return _.filter(board.toArray(), s => s !== 0).length === 81 && !board.equals(originalBoard) ? board : null;
  }
}

let solver = new Solver();

export default solver;
