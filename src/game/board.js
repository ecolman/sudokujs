import { isArray, isNumber, isString, map, reduce } from 'lodash';

import * as Utils from './utilities';

const rows = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8);

export default class {
  constructor(cells, type = null, difficulty = null) {
    this.startTime = new Date().getTime();
    this.timePlayed = 0;
    this.notes = [];

    this.difficulty = difficulty;
    this.type = type;

    if (cells) {
      this.set(cells);
    } else {
      this.clear();
    }
  }

  // BOARD
  set(cells) {
    let cellsToSet = [];

    if (isString(cells)) {
      cellsToSet = cells.split('');
    }

    if (isArray(cells)) {
      cellsToSet = cells;
    }

    if (cellsToSet.length === 81) {
      for (let row = 0; row < 9; row++) {
        this[row] = map(cellsToSet.slice(row * 9, row * 9 + 9), Number);
      }
    }
  }

  clear() {
    for (let row = 0; row < 9; row++) {
      this[row] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
  }

  // ROWS
  getRow(index) {
    return this[index];
  }

  // COLUMNS
  getColumn(index) {
    return map(rows, r => this[r][index]);
  }

  // CELLS
  checkCell(row = 0, col = 0, value = 0) {
    return this.getCell(row, col) === value;
  }

  getCell(row = 0, col = 0) {
    return this[row][col];
  }

  setCell(row = 0, col = 0, value = 0) {
    if (isNumber(value)) {
      this[row][col] = value;
      this[row] = this[row];

      return this[row][col];
    }
  }

  clearCell(row = 0, col = 0) {
    this[row][col] = 0;

    return this[row][col];
  }

  // REGIONS
  getRegion(row = 0, col = 0) {
    let region = [];
    let regionBounds = Utils.getRegionBounds(row, col);

    for (let r = regionBounds.start.row; r < regionBounds.end.row; r++) {
      let c = regionBounds.start.col;

      region.push(this[r][c]);
      region.push(this[r][c + 1]);
      region.push(this[r][c + 2]);
    }

    return region;
  }

  // UTILS
  equals(board) {
    return board ? this.toString() === board.toString() : false;
  }

  hasEmpty() {
    return this.toString().indexOf(0) > -1;
  }

  toString() {
    return this.toArray().join('');
  }

  toArray() {
    return reduce(rows, (board, row) => board.concat(this[row]), []);
  }

  toDimensionalArray() {
    return map(rows, r => this[r]);
  }
}
