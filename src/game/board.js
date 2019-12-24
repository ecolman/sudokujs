import { isArray, isNumber, isString, map, reduce } from 'lodash';

import { rows } from './constants';
import { getRegionBounds } from './utilities';

const blankRow = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);

export const Board = {
  difficulty: null,
  startTime: new Date().getTime(),
  timePlayed: 0,
  type: null,
  0: [...blankRow],
  1: [...blankRow],
  2: [...blankRow],
  3: [...blankRow],
  4: [...blankRow],
  5: [...blankRow],
  6: [...blankRow],
  7: [...blankRow],
  8: [...blankRow],
  9: [...blankRow]
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
  }

  if (isArray(cells)) {
    cellsToSet = cells;
  }

  if (cellsToSet.length === 81) {
    for (let row = 0; row < 9; row++) {
      board[row] = map(cellsToSet.slice(row * 9, row * 9 + 9), Number);
    }
  }
}

export function clearBoard(board) {
  for (let row = 0; row < 9; row++) {
    board[row] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}

export function getRow(board, index) {
  return board[index];
}

export function getColumn(board, index) {
  return map(rows, r => board[r][index]);
}

export function checkCell(board, row = 0, col = 0, value = 0) {
  return getCell(board, row, col) === value;
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
  return reduce(rows, (arr, row) => arr.concat(board[row]), []);
}

export function toDimensionalArray(board) {
  return map(rows, r => board[r]);
}
