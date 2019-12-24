import { createAction, createReducer } from '@reduxjs/toolkit'
import { filter, isArray } from 'lodash';

import * as BoardUtils from '../../game/board';
import { isBoardValid } from '../../game/solver';
import { BoardTypes } from '../../game/constants';
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
    [BoardTypes.BASE]: undefined,
    [BoardTypes.COMPLETE]: undefined,
    [BoardTypes.DISPLAY]: undefined,
    [BoardTypes.PLAYER]: undefined,
    [BoardTypes.NOTES]: undefined,
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
      let displayBoard = state[BoardTypes.DISPLAY];
      let playerBoard = state[BoardTypes.PLAYER];


      if (playerBoard) {
        BoardUtils.clearCell(playerBoard, row, col);
      }

      state[BoardTypes.DISPLAY] = displayBoard && playerBoard
        ? BoardUtils.toDimensionalArray(playerBoard)
        : displayBoard;
    },
    [actions.SET_BOARD]: (state, action) => {
      const { board, boardType } = action.payload;

      state[boardType] = board;
    },
    [actions.SET_CELL]: (state, action) => {
      const { col, row, value } = action.payload;
      let displayBoard = state[BoardTypes.DISPLAY];
      let playerBoard = state[BoardTypes.PLAYER];

      if (playerBoard) {
        BoardUtils.setCell(playerBoard, row, col, value);
        state.completed = isBoardValid(playerBoard);
      }

      state[BoardTypes.DISPLAY] = displayBoard && playerBoard
        ? BoardUtils.toDimensionalArray(playerBoard)
        : displayBoard
    },
    [actions.ADD_NOTE]: (state, action) => {
      const { col, row, value } = action.payload;
      let anCellIndex = getCellIndex(row, col);
      let notesBoard = state[BoardTypes.NOTES];

      if (notesBoard && isArray(notesBoard[anCellIndex]) && notesBoard[anCellIndex].indexOf(value) === -1) {
        notesBoard[anCellIndex] = notesBoard[anCellIndex].concat([value]);
      }
    },
    [actions.DELETE_NOTE]: (state, action) => {
      const { col, row, value } = action.payload;
      const dnCellIndex = getCellIndex(row, col);
      let notesBoard = state[BoardTypes.NOTES];

      if (notesBoard && isArray(notesBoard[dnCellIndex])) {
        notesBoard[dnCellIndex] = filter(notesBoard[dnCellIndex], v => v !== value);
      }
    },
    [actions.DELETE_NOTES]: (state, action) => {
      const { col, row } = action.payload;
      const dnCellIndex = getCellIndex(row, col);
      let notesBoard = state[BoardTypes.NOTES];

      if (notesBoard && isArray(notesBoard[dnCellIndex])) {
        notesBoard[dnCellIndex] = [];
      }
    }
  }
);

export const selectors = {
  getBoard: (state, type) => state.boards[type],
  getSelectedCellValue: state => {
    if (state.boards[BoardTypes.PLAYER] && state.game.selectedCell > -1) {
      let rowCol = getRowColumn(state.game.selectedCell);
      return BoardUtils.getCell(state.boards[BoardTypes.PLAYER], rowCol.row, rowCol.col);
    }

    return 0;
  }
}

export { sagas } from './sagas';
