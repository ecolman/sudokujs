import sudoku from 'sudoku-umd';

export function generate(given) {
  const startTime = Date.now();
  const base = sudoku.generate(given);
  let solutions = []

  for (let index = 0; index < 100; index++) {
    let solution = sudoku.solve(base);

    if (solutions.indexOf(solution) === -1) {
      solutions.push(solution);
    }
  }

  console.log(`generation took ${(Date.now() - startTime) / 1000} seconds, has ${solutions.length} solution(s)`);

  let convertedBase = base.replace(/\./g, 0)

  if (solutions.length === 1) {
    return {
      base: convertedBase,
      solution: solutions[0]
    };
  } else {
    return {
      base: convertedBase,
      solution: null
    };
  }
}
