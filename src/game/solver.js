import * as BoardUtils from './board';
import * as Utils from './utilities';
import { SHOW_LOGS } from './constants';

export let lastSolution = {
  board: null,
  steps: 0,
  time: 0
};

export function isCellValid(board, row = 0, col = 0, zeroValid = false) {
  if (board) {
    let value = board[row][col];

    if (!zeroValid && value === 0) {
      return false;
    }

    return isRowValid(board, row, zeroValid) && isColumnValid(board, col, zeroValid) && isRegionValid(board, row, col, zeroValid);
  }

  return null;
}

export function isRowValid(board, row = 0, zeroValid = false) {
  if (board) {
    let r = BoardUtils.getRow(board, row);
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

export function isColumnValid(board, col = 0, zeroValid = false) {
  if (board) {
    let c = BoardUtils.getColumn(board, col);
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

export function isRegionValid(board, row = 0, col = 0, zeroValid = false) {
  if (board) {
    let region = BoardUtils.getRegion(board, row, col);
    let numbers = [];

    for (let count = 0; count < region.length; count++) {
      let value = region[count];

      if (!zeroValid && value === 0) {
        return false;
      } else if (zeroValid && value === 0) {
        continue;
      }

      if (numbers.indexOf(value) > -1) {
        return false;
      }

      numbers.push(value);
    }

    return true;
  }

  return false;
}

export function isBoardValid(board, zeroValid = false) {
  if (board) {
    let valid = true;

    for(let i = 0; i < 81; i++) {
      const pos = Utils.getRowColumn(i);
      valid = isCellValid(board, pos.row, pos.col, zeroValid);

      if (!valid) {
        if (SHOW_LOGS) {
          console.log(`validation failed on position ${pos.row}, ${pos.col}`)
        }

        break;
      }
    }

    return valid;
  }

  return false;
}

export function solve(board) {
  const startTime = Date.now();
  const possibleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const originalBoard = BoardUtils.createBoard(BoardUtils.toString(board));

  let invalidNumbers = [];
  let lastCellIndex = 0;
  let steps = 0;
  let attempts = 0;

  if (!isBoardValid(board, true)) {
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
      let usedNumbers = BoardUtils.getRow(board, pos.row)
        .concat(BoardUtils.getColumn(board, pos.col))
        .concat(BoardUtils.getRegion(board, pos.row, pos.col));

      usedNumbers = _.sortBy(_.filter(_.uniq(usedNumbers), i => i != 0)); // unique values, remove 0's
      let validNumbers = _.difference(possibleNumbers, usedNumbers.concat(invalidNumbers[i]));  // find unused and valid numbers

      let validNumbersEmpty = !validNumbers || validNumbers.length === 0;

      if (!validNumbersEmpty && SHOW_LOGS) {
        console.log(`testing ${validNumbers} in cell ${pos.row}, ${pos.col}`);
      }

      while (validNumbers.length > 0) {
        // pick a random number to try
        let rnd = Math.floor(Math.random() * validNumbers.length);
        let value = validNumbers.splice(rnd, 1)[0];
        BoardUtils.setCell(board, pos.row, pos.col, value);

        // check that we haven't seen this solution before, then check if it's valid
        if (isCellValid(board, pos.row, pos.col, true)) {
          found = true;
          if (SHOW_LOGS) {
            console.log(`${value} is valid in cell ${pos.row}, ${pos.col}`);
          }
          break;
        } else if (SHOW_LOGS) {
          console.log(`${value} is not valid in cell ${pos.row}, ${pos.col}, removing`);
        }
      }

      // no valid value found, backtrack
      if (validNumbersEmpty || !found) {
        BoardUtils.setCell(board, pos.row, pos.col, 0);

        if (SHOW_LOGS) {
          console.log(`no values worked for cell ${pos.row}, ${pos.col}, backtracking`);
        }

        if (i >= 1) {
          // get previously set cell and set that to 0
          let prevPos = Utils.getRowColumn(lastCellIndex);
          let prevValue = BoardUtils.getCell(board, prevPos.row, prevPos.col);

          // since no solution was found, add that number to invalid numbers
          invalidNumbers[lastCellIndex] = [prevValue].concat(invalidNumbers[lastCellIndex] || []);
          BoardUtils.setCell(board, prevPos.row, prevPos.col, 0);

          i = lastCellIndex - 1;
        } else {
          attempts++;

          if (attempts > 10) {
            //break;
          }

          // reset everything
          board = BoardUtils.createBoard(BoardUtils.toString(originalBoard));

          invalidNumbers = [];
          i = -1;
          lastCellIndex = 0;
          continue;
        }
      }

      lastCellIndex = i;
    }
  }

  lastSolution = {
    board: board,
    steps,
    time: Date.now() - startTime
  };

  if (SHOW_LOGS) {
    console.log(`${steps} steps solved ${_.filter(BoardUtils.toArray(board), s => s !== 0).length} cells, ${BoardUtils.toString(board)}`);
  }

  return _.filter(BoardUtils.toArray(board), s => s !== 0).length === 81 && !BoardUtils.equals(board, originalBoard) ? board : null;
}
