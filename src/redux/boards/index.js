import { createAction, createReducer } from '@reduxjs/toolkit'
import { filter, isArray } from 'lodash';

import * as BoardUtils from '../../game/board';
import { isBoardValid } from '../../game/solver';
import { BOARD_TYPES } from '../../react/constants';
import { getCellIndex, getRowColumn } from '../../game/utilities';

export const actions = {
  SET_BOARD: createAction('SET_BOARD'),
  CLEAR_BOARD: createAction('CLEAR_BOARD'),
  CHECK_BOARD: createAction('CHECK_BOARD'),

  SET_CELL: createAction('SET_CELL'),
  SET_CELL_REQUEST: createAction('SET_CELL_REQUEST'),
  CLEAR_CELL: createAction('CLEAR_CELL'),

  ADD_NOTE: createAction('ADD_NOTE'),
  DELETE_NOTE: createAction('DELETE_NOTE'),
  DELETE_NOTES: createAction('DELETE_NOTES')
};

export const reducer = createReducer(
  {
    [BOARD_TYPES.BASE]: undefined,
    [BOARD_TYPES.COMPLETE]: undefined,
    [BOARD_TYPES.DISPLAY]: undefined,
    [BOARD_TYPES.PLAYER]: undefined,
    [BOARD_TYPES.NOTES]: undefined,
    solved: false
  },
  {
    [actions.CLEAR_BOARD]: (state, action) => {
      const { boardType } = action.payload;

      if (boardType && state[boardType]) {
        BoardUtils.clearBoard(state[boardType]);
      }
    },
    [actions.CLEAR_CELL]: (state, action) => {
      const { col, row } = action.payload;
      let displayBoard = state[BOARD_TYPES.DISPLAY];
      let playerBoard = state[BOARD_TYPES.PLAYER];


      if (playerBoard) {
        BoardUtils.clearCell(playerBoard, row, col);
      }

      state[BOARD_TYPES.DISPLAY] = displayBoard && playerBoard
        ? BoardUtils.toDimensionalArray(playerBoard)
        : displayBoard;
    },
    [actions.SET_BOARD]: (state, action) => {
      const { board, boardType } = action.payload;

      state[boardType] = board;
    },
    [actions.SET_CELL]: (state, action) => {
      const { col, row, value } = action.payload;
      let displayBoard = state[BOARD_TYPES.DISPLAY];
      let playerBoard = state[BOARD_TYPES.PLAYER];

      if (playerBoard) {
        BoardUtils.setCell(playerBoard, row, col, value);
        state.completed = isBoardValid(playerBoard);
      }

      state[BOARD_TYPES.DISPLAY] = displayBoard && playerBoard
        ? BoardUtils.toDimensionalArray(playerBoard)
        : displayBoard
    },
    [actions.ADD_NOTE]: (state, action) => {
      const { col, row, value } = action.payload;
      let anCellIndex = getCellIndex(row, col);
      let notesBoard = state[BOARD_TYPES.NOTES];

      if (notesBoard && isArray(notesBoard[anCellIndex]) && notesBoard[anCellIndex].indexOf(value) === -1) {
        notesBoard[anCellIndex] = notesBoard[anCellIndex].concat([value]);
      }
    },
    [actions.DELETE_NOTE]: (state, action) => {
      const { col, row, value } = action.payload;
      const dnCellIndex = getCellIndex(row, col);
      let notesBoard = state[BOARD_TYPES.NOTES];

      if (notesBoard && isArray(notesBoard[dnCellIndex])) {
        notesBoard[dnCellIndex] = filter(notesBoard[dnCellIndex], v => v !== value);
      }
    },
    [actions.DELETE_NOTES]: (state, action) => {
      const { col, row } = action.payload;
      const dnCellIndex = getCellIndex(row, col);
      let notesBoard = state[BOARD_TYPES.NOTES];

      if (notesBoard && isArray(notesBoard[dnCellIndex])) {
        notesBoard[dnCellIndex] = [];
      }
    }
  }
);

export const selectors = {
  getBoard: (state, type) => state.boards[type],
  getSelectedCellValue: state => {
    if (state.boards[BOARD_TYPES.PLAYER] && state.game.selectedCell > -1) {
      let rowCol = getRowColumn(state.game.selectedCell);
      return BoardUtils.getCell(state.boards[BOARD_TYPES.PLAYER], rowCol.row, rowCol.col);
    }

    return 0;
  }
}

export { sagas } from './sagas';
