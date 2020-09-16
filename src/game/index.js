import * as Board from './board';
import * as Generator from './generator';
import * as Solver from './solver';

import { testUniqueness } from './solver';
import { BOARDS_TO_ATTEMPT, UNIQUENESS_ATTEMPTS, UNIQUE_RESULT } from './constants';

export function generate(given) {
  const startTime = Date.now();
  let generationAttempts = 0;

  let boards = {
    base: null,
    solution: null
  };

  // loop to test board uniqueness multiple times
  while (boards.solution === null && generationAttempts < BOARDS_TO_ATTEMPT) {
    let base = Generator.generate(given);
    let solution = Solver.solve(base);
    let isUnique = testUniqueness();

    generationAttempts++;

    if (isUnique === UNIQUE_RESULT.UNIQUE) {
      boards.base = base;
      boards.solution = solution;
    }
  }

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
