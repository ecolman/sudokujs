import { isArray, isNumber, isString, map, reduce } from 'lodash';

import { BLANK_ROW, ROWS } from './constants';
import { getRegionBounds } from './utilities';

export const Board = {
  difficulty: null,
  type: null,
  0: [...BLANK_ROW],
  1: [...BLANK_ROW],
  2: [...BLANK_ROW],
  3: [...BLANK_ROW],
  4: [...BLANK_ROW],
  5: [...BLANK_ROW],
  6: [...BLANK_ROW],
  7: [...BLANK_ROW],
  8: [...BLANK_ROW]
};

export function createBoard(cells, props) {
  let newBoard = Object.assign({}, Board, { ...props });
  setBoard(newBoard, cells);
  return newBoard;
}

export function setBoard(board, cells) {
  let cellsToSet = [];

  if (isString(cells)) {
    cellsToSet = cells.split('');
  } else if (isArray(cells)) {
    cellsToSet = cells;
  }

  if (cellsToSet.length === 81) {
    map(ROWS, row => {
      board[row] = map(cellsToSet.slice(row * 9, row * 9 + 9), Number);
    });
  }
}

export function clearBoard(board) {
  for (let row = 0; row < 9; row++) {
    board[row] = [...BLANK_ROW];
  }
}

export function getRow(board, index) {
  return board[index];
}

export function getColumn(board, index) {
  return map(ROWS, r => board[r][index]);
}

export function getCell(board, row = 0, col = 0) {
  return board[row][col];
}

export function setCell(board, row = 0, col = 0, value = 0) {
  if (isNumber(value)) {
    board[row][col] = value;

    return board[row][col];
  }
}

export function checkCell(board, row = 0, col = 0, value = 0) {
  return getCell(board, row, col) === value;
}

export function clearCell(board, row = 0, col = 0) {
  return setCell(board, row, col);
}

export function getRegion(board, row = 0, col = 0) {
  let region = [];
  let regionBounds = getRegionBounds(row, col);

  for (let r = regionBounds.start.row; r < regionBounds.end.row; r++) {
    let c = regionBounds.start.col;

    region.push(board[r][c]);
    region.push(board[r][c + 1]);
    region.push(board[r][c + 2]);
  }

  return region;
}

export function equals(boardA, boardB) {
  return toString(boardA) === toString(boardB);
}

export function hasEmpty(board) {
  return toString(board).indexOf(0) > -1;
}

export function toString(board) {
  return toArray(board).join('');
}

export function toArray(board) {
  return reduce(ROWS, (arr, row) => arr.concat(board[row]), []);
}

export function toDimensionalArray(board) {
  return map(ROWS, r => board[r]);
}
