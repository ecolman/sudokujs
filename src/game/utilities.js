export const getRowColumn = (index = 0) => {
  let row = Math.floor(index / 9);

  return {
    col: index - (row * 9),
    row
  };
}

export const getCellIndex = (row = 0, col = 0) => {
  return row * 9 + col;
}

export const getRegionBounds = (row = 0, col = 0) => {
  // very snazzy way to determine which 3x3 region cell belongs to
  // too bad I didn't come up with it =( (nice one Jani)
  let mgCol = Math.floor(col / 3);
  let mgRow = Math.floor(row / 3);

  return {
    start: {
      col: mgCol * 3,
      row: mgRow * 3
    },
    end: {
      col: (mgCol + 1) * 3,
      row: (mgRow + 1) * 3
    }
  };
}

export const getElapsedTime = (time, startedAt, stoppedAt = new Date().getTime()) => {
  if (!startedAt) {
    return 0;
  } else {
    let calculatedDiff = stoppedAt - startedAt;

    return calculatedDiff !== time ? calculatedDiff + time : calculatedDiff;
  }
}
