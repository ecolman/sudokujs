import { uniqWith, isEqual } from 'lodash';

export function getRowColumn(index = 0) {
  let row = Math.floor(index / 9);

  return {
    col: index - (row * 9),
    row
  };
}

export function getCellIndex(row = 0, col = 0) {
  return row * 9 + col;
}

export function getRegionBounds(row = 0, col = 0) {
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

export function getCellRelations(row, col) {
  let relations = [];
  const regionLimits = getRegionBounds(row, col); // get region cells

  // add region cell
  for (let r = regionLimits.start.row; r < regionLimits.end.row; r++) {
    for (let c = regionLimits.start.col; c < regionLimits.end.col; c++) {
      relations.push({ row: r, col: c });
    }
  }

  // get row cells
  for (let tempCol = 0; tempCol < 9; tempCol++) {
    relations.push({ row, col: tempCol });
  }

  // get column cells
  for (let tempRow = 0; tempRow < 9; tempRow++) {
    relations.push({ row: tempRow, col });
  }

  return uniqWith(relations, isEqual);
}

export function getElapsedTime(time, startedAt, stoppedAt = new Date().getTime()) {
  if (!startedAt) {
    return 0;
  } else {
    //const calculatedDiff = stoppedAt - startedAt;
    const calculatedDiff = Math.floor((stoppedAt - startedAt)/1000) * 1000

    return time !== 0 && calculatedDiff !== time ? calculatedDiff + time : calculatedDiff;
  }
}
