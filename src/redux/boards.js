import { createAction, createReducer } from '@reduxjs/toolkit'
import { filter, isArray } from 'lodash';

import * as BoardUtils from '../game/board';
import { BoardTypes } from '../game/constants';
import { getCellIndex } from '../game/utilities';

export const actions = {
  CLEAR_BOARD: createAction('CLEAR_BOARD'),
  CLEAR_CELL: createAction('CLEAR_CELL'),
  SELECT_CELL: createAction('SELECT_CELL'),
  SET_BOARD: createAction('SET_BOARD'),
  SET_CELL: createAction('SET_CELL'),
  ADD_NOTE: createAction('ADD_NOTE'),
  DELETE_NOTE: createAction('DELETE_NOTE')
};

export const reducer = createReducer(
  {
    [BoardTypes.BASE]: undefined,
    [BoardTypes.COMPLETE]: undefined,
    [BoardTypes.DISPLAY]: undefined,
    [BoardTypes.PLAYER]: undefined,
    [BoardTypes.NOTES]: undefined,
    selectedCell: -1
  },
  {
    [actions.CLEAR_BOARD]: (state, action) => {
      const { boardType } = action.payload;

      if (boardType && state[boardType]) {
        BoardUtils.clear(state[boardType]);
      }
    },
    [actions.CLEAR_CELL]: (state, action) => {
      const { col, row } = action.payload;

      if (state[BoardTypes.PLAYER]) {
        BoardUtils.clearCell(state[BoardTypes.PLAYER], row, col);
      }

      state[BoardTypes.DISPLAY] = state[BoardTypes.DISPLAY] && state[BoardTypes.PLAYER]
        ? BoardUtils.toDimensionalArray(state[BoardTypes.PLAYER])
        : state[BoardTypes.DISPLAY];
    },
    [actions.SELECT_CELL]: (state, action) => {
      state.selectedCell = action.payload || 0;
    },
    [actions.SET_BOARD]: (state, action) => {
      const { board, boardType } = action.payload;

      state[boardType] = board;
    },
    [actions.SET_CELL]: (state, action) => {
      const { col, row, value } = action.payload;

      if (state[BoardTypes.PLAYER]) {
        BoardUtils.setCell(state[BoardTypes.PLAYER], row, col, value);
      }

      state[BoardTypes.DISPLAY] = state[BoardTypes.DISPLAY] && state[BoardTypes.PLAYER]
        ? BoardUtils.toDimensionalArray(state[BoardTypes.PLAYER])
        : state[BoardTypes.DISPLAY]
    },
    [actions.ADD_NOTE]: (state, action) => {
      const { col, row, value } = action.payload;
      const anCellIndex = getCellIndex(row, col);

      if (state[BoardTypes.NOTES] && isArray(state[BoardTypes.NOTES][anCellIndex]) && state[BoardTypes.NOTES][anCellIndex].indexOf(value) === -1) {
        state[BoardTypes.NOTES][anCellIndex] = state[BoardTypes.NOTES][anCellIndex].concat([value]);
      }
    },
    [actions.DELETE_NOTE]: (state, action) => {
      const { col, row, value } = action.payload;
      const dnCellIndex = getCellIndex(row, col);

      if (state[BoardTypes.NOTES] && isArray(state[BoardTypes.NOTES][dnCellIndex])) {
        state[BoardTypes.NOTES][dnCellIndex] = filter(state[BoardTypes.NOTES][dnCellIndex], v => v !== value);
      }
    }
  }
);
