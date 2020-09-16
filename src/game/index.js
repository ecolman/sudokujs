import sudokuUmd from 'sudoku-umd';
import SudokuToolCollection from 'sudokutoolcollection';
import { flatten, findIndex } from 'lodash';

import { testUniqueness } from './solver';
import { BOARDS_TO_ATTEMPT, UNIQUENESS_ATTEMPTS, UNIQUE_RESULT } from './constants';

export function generate(given) {
  const startTime = Date.now();
  let generationAttempts = 0;
  let uniqueAttempts = 0;

  let boards = {
    base: null,
    solution: null
  };

  // loop to generate and test boards
  const sudoku = SudokuToolCollection();

  while (boards.solution === null && generationAttempts < BOARDS_TO_ATTEMPT) {
    const base = sudoku.generator.generate(given);
    const zeroedBase = base.replace(/\./g, 0)
    const candidates = sudoku.getCandidates.get(base);
    const dupes = flatten(candidates);
    const hasDupes = dupes.join('').length > 81;

    generationAttempts++;

    if (!hasDupes) {
      let solution = sudoku.solver.solve(base);
      boards.base = zeroedBase;
      boards.solution = solution;
    } else {
      console.log('had duplicates');
    }
  }

  // while (boards.solution === null && generationAttempts < BOARDS_TO_ATTEMPT) {
  //   let base = sudokuUmd.generate(given);
  //   let isUnique = testUniqueness(base.replace(/\./g, 0));

  //   generationAttempts++;

  //   if (isUnique === UNIQUE_RESULT.UNIQUE) {
  //     let solution = sudokuUmd.solve(base);
  //     boards.base = base;
  //     boards.solution = solution;
  //   }
  // }

  // while (boards.solution === null && generationAttempts < BOARDS_TO_ATTEMPT) {
  //   let base = sudoku.generate(given);
  //   let solution = sudoku.solve(base);
  //   let uniqueValues = [];

  //   generationAttempts++;

  //   // loop to test board uniqueness multiple times
  //   while (uniqueValues.indexOf(UNIQUE_RESULT.NOT_UNIQUE) === -1 && uniqueValues.indexOf(UNIQUE_RESULT.NO_SOLUTION) === -1 && uniqueAttempts < UNIQUENESS_ATTEMPTS) {
  //     uniqueAttempts++;

  //     let isUnique = testUniqueness(base.replace(/\./g, 0));

  //     if (uniqueValues.indexOf(isUnique) === -1) {
  //       uniqueValues.push(isUnique);
  //     }
  //   }

  //   if (uniqueValues.length === 1 && uniqueValues.indexOf(UNIQUE_RESULT.UNIQUE) > -1) {
  //     boards.base = base;
  //     boards.solution = solution;
  //   }

  //   console.log(uniqueValues, uniqueAttempts);
  // }

  console.log(`Generated ${generationAttempts} board(s) to find a unique solution, took ${(Date.now() - startTime) / 1000 } seconds`);

  if (boards.base && boards.solution) {
    return {
      base: boards.base.replace(/\./g, 0),
      solution: boards.solution.replace(/\./g, 0)
    };
  } else {
    return {
      base: null,
      solution: null
    }
  }
}
