import _ from 'lodash';

import { BoardTypes, clearBoard, setBoard, setCell, clearCell } from '../redux/actions';
import Utils from './utilities';
import * as Constants from './constants';

export default class {
  constructor(cells, type, store) {
    this.difficulty = 0;
    this.startTime = new Date().getTime();
    this.timePlayed = 0;

    this.notes = [];
    this.cells = [];
    this.type = type;

    if (type && store) {
      this.Store = store;
      this.type = type

      if (cells) {
        this.Store.dispatch(setBoard(this.type, cells));
      } else {
        this.Store.dispatch(clearBoard(this.type));
      }

      this.Store.subscribe(() => {
        let board = this.Store.getState().boards[this.type];

        // update board
        _.forEach(board, (row, index) => {
          this[index] = row;
        });
      });
    }
  }

  // BOARD
  set(cells) {
    if (this.Store) {
      Store.dispatch(setBoard(this.type, cells));
    } else {
      let cellsToSet = [];

      if (_.isString(cells)) {
        cellsToSet = cells.split(',');
      }

      if (_.isArray(cells)) {
        cellsToSet = cells;
      }

      if (cellsToSet.length === 81) {
        for (let row = 0; row < 9; row++) {
          this[row] = cellsToSet.slice(row * 9, row * 9 + 9);
        }
      }
    }
  }

  clear() {
    if (this.Store) {
      Store.dispatch(clearBoard(this.type));
    } else {
      for (let row = 0; row < 9; row++) {
        this[row] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
      }
    }
  }

  // ROWS
  getRow(index) {
    return this[index];
  }

  // COLUMNS
  getColumn(index) {
    return _.map(Constants.rows, r => this[r][index]);
  }

  // CELLS
  checkCell(row = 0, col = 0, value = 0) {
    return this.getCell(row, col) === value;
  }

  getCell(row = 0, col = 0) {
    return this[row][col] || -1;
  }

  setCell(row = 0, col = 0, value = 0) {
    if (_.isNumber(value)) {
      if (this.Store) {
        this.Store.dispatch(setCell(this.type, row, col, value));
      } else {
        this[row][col] = value;
      }

      return this[row][col];
    }
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
    return _.reduce(Constants.rows, (board, row) => board.concat(this[row]), []);
  }
}
