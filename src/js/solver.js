import { BoardTypes } from './board';

class Solver {
  constructor() {

  }

  cellHasConflicts(board, row = 0, col = 0) {
    let playerBoard = board.boards[BoardTypes.PLAYER];
    let value = playerBoard[row][column];

    if (value === 0)
      return false;

    // loop through row and column which cell is on
    for (let i = 0; i < 9; i++) {
      // check if we're not on the same row and then check if cell is a duplicate value
      if (i != row && playerBoard[i][col] === value) {
        return true;
      }

      // check if we're not on the same column and then check if cell is a duplicate value
      if (i != col && playerBoard[row][i] === value) {
        return true;
      }
    }

    // finally, check region for duplicate value
    return !this.regionValid(board, row, col);
  }

  isRegionValid(board, row, column) {
    let playerBoard = board.boards[BoardTypes.PLAYER];
    let regionLimits = board.getRegionBounds(BoardTypes.PLAYER, row, column);
    let numbers = [];

    // loop through 3x3 region looking for any duplicate values
    for (let r = regionLimits.start.row; r < regionLimits.end.row; r++) {
      for (let c = regionLimits.start.col; c < regionLimits.end.col; c++) {
        let value = playerBoard[r][c];
        if (value === 0)
          continue;

        if (numbers.indexOf(value) > -1)
          return false;

        numbers.push(value);
      }
    }

    return true;
  }

  guaranteeUniqueness(numCellsToRemove) {
    // grab time started, count and kick off first test
    this.startTime = utilities.getTime();
    var tryCount = 1;
    this.cullNumber = numCellsToRemove;

    if (this.enableWebWorkers) {
      // start the workers
      this.sendNewBoardsToSolver(this.cullNumber);
    } else {
      var unique = this._testUniqueness(tryCount);
      // while the sudoku puzzle is not unique or unsolvable, keep retrying with different culls / boards
      while (unique != sudokuUniqueResult.unique) {
        // if we've tried 5 different culls on a board, regenerate a board to try again
        if (tryCount % 5 == 0) {
          this.clearBoards();
          this.generate();
        }

        // re-cull with number to remove
        this.cull(numCellsToRemove);

        // test uniqueness and increment
        unique = this._testUniqueness(tryCount);

        tryCount++;
      }

      // reset culled to player board to ensure no changes were made to board during testing for uniqueness
      for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
          this.culledBoard[r][c] = this.playerBoard[r][c];
        }
      }

      // stop time
      var endtime = utilities.getTime();
      //console.log('culled ' + numCellsToRemove + ' cells, took ' + tryCount + ' tries(s) and ' + ((endtime - this.startTime) / 1000) + ' sec(s) to generate board.');

      $('body').trigger('loadBoard', boardLoadType.fresh); // trigger event that a new board has been created
    }
  }

  isUnqieSolution(tryCount) {
    // Find untouched location with most information
    var rp = 0, cp = 0;
    var Mp = null;
    var cMp = 10;

    for (var r = 0; r < 9; r++) {
      for (var c = 0; c < 9; c++) {
        // Is this spot unused?
        if (this.culledBoard[r][c] == 0) {
          // Set M of possible solutions
          var M = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
          var cM = 0;

          // Remove used numbers in the vertical direction
          for (var a = 0; a < 9; a++) {
            M[this.culledBoard[r][a]] = 0;
          }

          // Remove used numbers in the horizontal direction
          for (var b = 0; b < 9; b++) {
            M[this.culledBoard[b][c]] = 0;
          }

          // Remove used numbers in the region
          var regionLimits = this.getRegionLocation(r, c);

          for (var x = regionLimits.start.r; x < regionLimits.end.r; x++) {
            for (var y = regionLimits.start.c; y < regionLimits.end.c; y++) {
              M[this.culledBoard[x][y]] = 0;
            }
          }

          // Calculate cardinality of M
          for (var d = 1; d < 10; d++) {
            cM += M[d] == 0 ? 0 : 1;
          }

          // Is there more information in this spot than in the best yet?
          if (cM < cMp) {
            cMp = cM;
            Mp = M;
            rp = r;
            cp = c;
          }
        }
      }
    }

    // Finished?
    if (cMp == 10) {
      //console.log('NON-THREADED result: unique (cMp == 10)');
      return sudokuUniqueResult.unique;
    }

    // Couldn't find a solution?
    if (cMp == 0) {
      //console.log('NON-THREADED result: no solution (cMp == 0)');
      return sudokuUniqueResult.noSolution;
    }

    // Try elements
    var success = 0;
    for (var i = 1; i < 10; i++) {
      if (Mp[i] != 0) {
        this.culledBoard[rp][cp] = Mp[i];

        //console.log('NON-THREADED row: ' + rp + ' col: ' + cp + ' value: ' + Mp[i]);

        switch (this._testUniqueness(tryCount)) {

          case sudokuUniqueResult.unique:
            success++;
            //console.log('NON-THREADED result: unique (_testUniqueness result)');
            break;

          case sudokuUniqueResult.notUnique:
            //console.log('NON-THREADED result: not unique (_testUniqueness result)');
            return sudokuUniqueResult.notUnique;

          case sudokuUniqueResult.noSolution:
            //console.log('NON-THREADED result: no solution (_testUniqueness result)');
            break;
        }

        // More than one solution found?
        if (success > 1) {
          //console.log('NON-THREADED result: not unique (success > 1)');
          return sudokuUniqueResult.notUnique;
        }
      }
    }

    // Restore to original state.
    this.culledBoard[rp][cp] = 0;

    switch (success) {
      case 0:
        //console.log('NON-THREADED result: no solution (success switch)');
        return sudokuUniqueResult.noSolution;

      case 1:
        //console.log('NON-THREADED result: unique (success switch)');
        return sudokuUniqueResult.unique;

      default:
        // Won't happen, not unique
        //console.log('NON-THREADED result: not unique (success switch)');
        return sudokuUniqueResult.notUnique;
    }
  }
}

let solver = new Solver();

export default solver;
