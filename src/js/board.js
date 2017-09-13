'use strict';

import _ from 'lodash';

export const BoardTypes = {
  BASE: 'base',
  PLAYER: 'player',
  SOLVED: 'solved'
}

export class Board {
  constructor() {
    this.boards = {
      base: [],
      player: [],
      solved: []
    }

    this.difficulty = 0;
    this.startTime = new Date().getTime();
    this.timePlayed = 0;
    this.notes = [];

    this.clearBoard(BoardTypes.BASE);
    this.clearBoard(BoardTypes.PLAYER);
    this.clearBoard(BoardTypes.SOLVED);
  }

  checkBoardType(boardType) {
    return _.find(BoardTypes, t => t === boardType) !== undefined;
  }

  clearBoard(boardType = BoardTypes.PLAYER) {
    if (this.checkBoardType(boardType)) {
      for (let row = 0; row < 9; row++) {
        this.boards[boardType][row] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
      }
    }
  }

  setBoard(boardType = BoardTypes.PLAYER, cells) {
    if (this.checkBoardType(boardType) > -1 && _.isArray(cells) && cells.length === 81) {
      let cellsToCopy = [].concat(cells);

      for (let row = 0; row < 9; row++) {
        this.boards[boardType][row] = cellsToCopy.slice(row * 9, row * 9 + 9);
      }
    }
  }

  // CELLS
  checkCell(boardType = BoardTypes.PLAYER, value = 0, row = 0, col = 0) {
    return this.checkBoardType(boardType) ? this.boards[boardType][row][col] === this.boards[BoardTypes.SOLVED][row][col] : false;
  }

  getCell(boardType = BoardTypes.PLAYER, row = 0, col = 0) {
    return this.checkBoardType(boardType) > -1 ? this.boards[boardType][row][col] : -1;
  }

  setCell(boardType = BoardTypes.PLAYER, value = 0, row = 0, col = 0) {
    if (this.checkBoardType(boardType) && _.isNumber(value)) {
      this.boards[boardType][row][col] = value;
      return this.board[row][col];
    }
  }

  // REGIONS
  getRegionBounds(boardType = BoardTypes.PLAYER, row = 0, col = 0) {
    let mgX = Math.floor(col / 3);
    let mgY = Math.floor(row / 3);

    let startCol = mgX * 3;
    let startRow = mgY * 3;

    let endCol = (mgX + 1) * 3;
    let endRow = (mgY + 1) * 3;

    return {
      start: { row: startRow, ccol: startCol },
      end: { row: endRow, ccol: endCol }
    };
  }

  getRegionArray(boardType = BoardTypes.PLAYER, row = 0, col = 0) {
    // very snazzy way to determine which 3x3 region cell belongs to
    // too bad I didn't come up with it =( (nice one Jani)
    let region = [[], [], []];
    let count = 0;

    if (this.checkBoardType(boardType)) {

      let regionBounds = this.getRegionBounds(boardType, row, col);

      for (let r = regionBounds.start.row; r < regionBounds.end.row; r++) {
        region[count].push(this.boards[boardType][r][regionBounds.start.col]);
        region[count].push(this.boards[boardType][r][regionBounds.start.col + 1]);
        region[count].push(this.boards[boardType][r][regionBounds.start.col + 2]);
        count++;
      }
    }

    return region;
  }

  hasEmpty(boardType) {
    return this.checkBoardType(boardType) ? this.boards[boardType].indexOf(0) > -1 : true;
  }

  isFilled(boardType) {
    return this.checkBoardType(boardType) ? !this.hasEmpty(boardType) : false;
  }

  isSolved() {
    return this.boards[BoardTypes.PLAYER].toString() === this.boards[BoardTypes.SOLVED].toString();
  }

  toString(boardType) {
    return this.toArray(boardType).toString();
  }

  toArray(boardType) {
    return this.checkBoardType(boardType)
      ? _.reduce(this.boards[boardType], (board, row) => board.concat(row), []) : [];
  }
}
