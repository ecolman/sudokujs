import { flatten } from 'lodash';
import SudokuToolCollection from 'sudokutoolcollection';

import { BOARDS_TO_ATTEMPT, SHOW_LOGS } from './constants';

const sudoku = SudokuToolCollection();

onmessage = function (event) {
  const startTime = Date.now();
  const given = event.data || 42;
  let generationAttempts = 0;
  let shownMessage = false

  let boards = {
    base: null,
    solution: null
  };

  // loop to generate and test boards
  while (boards.solution === null && generationAttempts < BOARDS_TO_ATTEMPT) {
    const base = sudoku.generator.generate(given);
    const candidates = sudoku.getCandidates.get(base);
    const flattenedCandidates = flatten(candidates);

    // more than 81 candidate values means there is more than one solution to board
    const hasDupes = flattenedCandidates.join('').length > 81;

    generationAttempts++;

    if (generationAttempts > BOARDS_TO_ATTEMPT / 3 && !shownMessage) {
      console.log('Taking a long time to gererate, keep waiting...');
      shownMessage = true;
    }

    if (!hasDupes) {
      let solution = sudoku.solver.solve(base);
      boards.base = base.replace(/\./g, 0);
      boards.solution = solution.replace(/\./g, 0);
    }
  }

  postMessage(boards);

  //if (SHOW_LOGS) {
    if (boards.base && boards.solution) {
      console.log(`Generated ${generationAttempts} boards to find one with a unique solution, took ${(Date.now() - startTime) / 1000 } seconds`);
      console.log('Boards', boards);
    } else {
      console.log(`Generated ${generationAttempts} boards, wasn't able to find board with a unique solution, took ${(Date.now() - startTime) / 1000 } seconds`);
    }
  //}
};
