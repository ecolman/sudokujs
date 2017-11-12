'use strict';

import * as boardConstants from './constants';
import Board from './board';
import Solver from './solver';
import Utils from './utilities';

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
    let culledBoard = new Board(board.toArray());
    let cells = _.times(81, i => i);  // fill array with seed values

    // pick a random number, splice off rnd number from array, set calculated row and column to 0
    _.times(cullCount, () => {
      let rnd = Math.floor(Math.random() * cells.length);
      let value = cells.splice(rnd, 1);
      let row = Math.floor(value / 9);
      let col = value - (row * 9);

      // set board cells to empty (0)
      culledBoard.setCell(row, col, 0);
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
        let solved = Solver.solve(new Board(culledBoard.toArray()));

        this.lastGeneration.time += Solver.lastSolution.time;
        this.lastGeneration.steps += Solver.lastSolution.steps;

        if (Solver.isBoardValid(solved) && board.equals(solved)) {
          console.log('sweet, found a solution', solved.toString());
          // we already found a solution and current solution is not the same, board isn't unique
          if (solution !== null && !solution.equals(solved)) {
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
    return Solver.solve(new Board());
  }
}

let generator = new Generator();

export default generator;
