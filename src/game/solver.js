import * as BoardUtils from './board';
import * as Utils from './utilities';
import { SHOW_LOGS, UNIQUE_RESULT } from './constants';

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
  console.time('isBoardValid');
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

    console.timeEnd('isBoardValid');
    return valid;
  }

  console.timeEnd('isBoardValid');
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

/**
* Runs board through a series of tests to ensure that it only has one solution
* @method
* @private
*/
export function testUniqueness(board) {
  // Find untouched location with most information
  let rp = 0
  let cp = 0;
  let Mp = null;
  let cMp = 10;
  const boardCopy = BoardUtils.createBoard(board);

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      // is this spot unused?
      if (boardCopy[row][col] == 0) {
        let M = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // set M of possible solutions
        let cM = 0;

        // remove used numbers in the vertical direction
        for (let c = 0; c < 9; c++) {
          M[boardCopy[row][c]] = 0;
        }

        // remove used numbers in the horizontal direction
        for (let r = 0; r < 9; r++) {
          M[boardCopy[r][col]] = 0;
        }

        // remove used numbers in the region
        let regionLimits = Utils.getRegionBounds(row, col);

        for (let x = regionLimits.start.row; x < regionLimits.end.row; x++) {
          for (let y = regionLimits.start.col; y < regionLimits.end.col; y++) {
            M[boardCopy[x][y]] = 0;
          }
        }

        // calculate cardinality of M
        for (let d = 1; d < 10; d++) {
          cM += M[d] == 0 ? 0 : 1;
        }

        // is there more information in this spot than in the best yet?
        if (cM < cMp) {
          cMp = cM;
          Mp = M;
          rp = row;
          cp = col;
        }
      }
    }
  }

  // finished?
  if (cMp == 10) {
    if (SHOW_LOGS) {
      console.log('result: unique (cMp == 10)');
    }
    return UNIQUE_RESULT.UNIQUE;
  }

  // couldn't find a solution?
  if (cMp == 0) {
    if (SHOW_LOGS) {
      console.log('result: no solution (cMp == 0)');
    }
    return UNIQUE_RESULT.NO_SOLUTION;
  }

  let success = 0;

  for (let i = 1; i < 10; i++) {
    if (Mp[i] != 0) {
      boardCopy[rp][cp] = Mp[i];

      if (SHOW_LOGS) {
        console.log('row: ' + rp + ' col: ' + cp + ' value: ' + Mp[i]);
      }

      switch (testUniqueness(boardCopy)) {
        case UNIQUE_RESULT.UNIQUE:
          success++;

          if (SHOW_LOGS) {
            console.log('result: unique (_testUniqueness result)');
          }

          break;

        case UNIQUE_RESULT.NOT_UNIQUE:
          if (SHOW_LOGS) {
            console.log('result: not unique (_testUniqueness result)');
          }

          return UNIQUE_RESULT.NOT_UNIQUE;

        case UNIQUE_RESULT.NO_SOLUTION:
          if (SHOW_LOGS) {
            console.log('result: no solution (_testUniqueness result)');
          }

          break;
      }

      // more than one solution found?
      if (success > 1) {
        if (SHOW_LOGS) {
          console.log('result: not unique (success > 1)');
        }

        return UNIQUE_RESULT.NOT_UNIQUE;
      }
    }
  }

  switch (success) {
    case 0:
      if (SHOW_LOGS) {
        console.log('result: no solution (success switch)');
      }

      return UNIQUE_RESULT.NO_SOLUTION;

    case 1:
      if (SHOW_LOGS) {
        console.log('result: unique (success switch)');
      }

      return UNIQUE_RESULT.UNIQUE;

    default:
      // won't happen, not unique
      if (SHOW_LOGS) {
        console.log('result: not unique (success switch)');
      }

      return UNIQUE_RESULT.NOT_UNIQUE;
  }
}
