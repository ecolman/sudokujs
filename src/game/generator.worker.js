import { flatten } from 'lodash';
import SudokuToolCollection from 'sudokutoolcollection';

import { BOARDS_TO_ATTEMPT, SHOW_LOGS } from './constants';

const sudoku = SudokuToolCollection();

onmessage = function (event) {
  const startTime = Date.now();
  let generationAttempts = 0;
  let shownMessage = false

  let boards = {
    base: null,
    solution: null
  };

  // loop to generate and test boards
  while (boards.solution === null && generationAttempts < BOARDS_TO_ATTEMPT) {
    const base = sudoku.generator.generate(event.data);
    const zeroedBase = base.replace(/\./g, 0)
    const candidates = sudoku.getCandidates.get(base);
    const flattenedCandidates = flatten(candidates);

    // if there are more than 81 candidate values, it means there is more than one solution
    const hasDupes = flattenedCandidates.join('').length > 81;

    generationAttempts++;

    if (generationAttempts > BOARDS_TO_ATTEMPT / 3 && !shownMessage) {
      console.log('Taking a long time to gererate, keep waiting...');
      shownMessage = true;
    }

    if (!hasDupes) {
      let solution = sudoku.solver.solve(base);
      boards.base = zeroedBase;
      boards.solution = solution;
    }
  }

  if (boards.base && boards.solution) {
    //if (SHOW_LOGS) {
      console.log(`Generated ${generationAttempts} boards to find one with a unique solution, took ${(Date.now() - startTime) / 1000 } seconds`);
      console.log('Boards', boards);
    //}

    postMessage({
      base: boards.base.replace(/\./g, 0),
      solution: boards.solution.replace(/\./g, 0)
    });
  } else {
    //if (SHOW_LOGS) {
      console.log(`Generated ${generationAttempts} boards, wasn't able to find board with a unique solution, took ${(Date.now() - startTime) / 1000 } seconds`);
    //}

    postMessage({
      base: null,
      solution: null
    });
  }
};
