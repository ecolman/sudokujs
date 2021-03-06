import { createAction, createReducer } from '@reduxjs/toolkit'
import { filter, forEach, isArray, map, times, remove } from 'lodash';

import * as BoardUtils from '../../game/board';
import { BOARD_TYPES } from '../../components/constants';
import { getCellIndex, getRowColumn } from '../../game/utilities';

export const actions = {
  SET_BOARD: createAction('SET_BOARD'),
  CLEAR_BOARD: createAction('CLEAR_BOARD'),
  CHECK_BOARD: createAction('CHECK_BOARD'),

  SET_CELL_REQUEST: createAction('SET_CELL_REQUEST'),
  SET_CELL_SUCCESS: createAction('SET_CELL_SUCCESS'),
  CLEAR_CELL: createAction('CLEAR_CELL'),

  ADD_NOTE: createAction('ADD_NOTE'),
  DELETE_NOTE: createAction('DELETE_NOTE'),
  DELETE_CELLS_NOTE: createAction('DELETE_CELLS_NOTE'),
  CLEAR_CELL_NOTES: createAction('CLEAR_CELL_NOTES'),
  SET_SHOW_NOTES: createAction('SET_SHOW_NOTES'),

  SET_SOLVED: createAction('SET_SOLVED')
};

export const reducer = createReducer(
  {
    [BOARD_TYPES.BASE]: undefined,
    [BOARD_TYPES.COMPLETE]: undefined,
    [BOARD_TYPES.DISPLAY]: undefined,
    [BOARD_TYPES.PLAYER]: undefined,
    [BOARD_TYPES.NOTES]: undefined,
    showNotes: map(times(81, () => false)),
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

      let cellIndex = getCellIndex(row, col);

      if (playerBoard) {
        BoardUtils.clearCell(playerBoard, row, col);
        state.showNotes[cellIndex] = true;
      }

      state[BOARD_TYPES.DISPLAY] = displayBoard && playerBoard
        ? BoardUtils.toDimensionalArray(playerBoard)
        : displayBoard;
    },
    [actions.SET_BOARD]: (state, action) => {
      const { board, boardType } = action.payload;

      state[boardType] = board;
    },
    [actions.SET_CELL_SUCCESS]: (state, action) => {
      const { col, row, value } = action.payload;
      let displayBoard = state[BOARD_TYPES.DISPLAY];
      let playerBoard = state[BOARD_TYPES.PLAYER];

      if (playerBoard) {
        BoardUtils.setCell(playerBoard, row, col, value);
      }

      BoardUtils.setCell(state[BOARD_TYPES.DISPLAY], row, col, value);

      state[BOARD_TYPES.DISPLAY] = displayBoard && playerBoard
        ? BoardUtils.toDimensionalArray(playerBoard)
        : displayBoard;
    },
    [actions.ADD_NOTE]: (state, action) => {
      const { col, row, value } = action.payload;
      let cellIndex = getCellIndex(row, col);
      let notesBoard = state[BOARD_TYPES.NOTES];

      if (notesBoard && isArray(notesBoard[cellIndex]) && notesBoard[cellIndex].indexOf(value) === -1) {
        notesBoard[cellIndex] = notesBoard[cellIndex].concat([value]);
        state.showNotes[cellIndex] = true;
      }
    },
    [actions.DELETE_NOTE]: (state, action) => {
      const { col, row, value } = action.payload;
      const cellIndex = getCellIndex(row, col);
      let notesBoard = state[BOARD_TYPES.NOTES];

      if (notesBoard && isArray(notesBoard[cellIndex])) {
        notesBoard[cellIndex] = filter(notesBoard[cellIndex], v => v !== value);
      }
    },
    [actions.CLEAR_CELL_NOTES]: (state, action) => {
      const { col, row } = action.payload;
      const cellIndex = getCellIndex(row, col);
      let notesBoard = state[BOARD_TYPES.NOTES];

      if (notesBoard && isArray(notesBoard[cellIndex])) {
        notesBoard[cellIndex] = [];
      }
    },
    [actions.DELETE_CELLS_NOTE]: (state, action) => {
      const { cells, value } = action.payload;
      let notesBoard = state[BOARD_TYPES.NOTES];

      if (notesBoard) {
        forEach(cells, cell => {
          const cellIndex = getCellIndex(cell.row, cell.col);
          const notes = notesBoard[cellIndex];

          if (notes && isArray(notes) && notes.indexOf(value) > -1) {
            notesBoard[cellIndex] = filter(notes, v => v !== value);
          }
        });
      }
    },
    [actions.SET_SHOW_NOTES]: (state, action) => {
      const { col, row, value } = action.payload;
      const cellIndex = getCellIndex(row, col);

      state.showNotes[cellIndex] = value || false;
    },
    [actions.SET_SOLVED]: (state, action) => {
      state.solved = action.payload || false
    },
  }
);

export const selectors = {
  getBoard: (state, type) => state.boards[type],
  getBoardString: (state, type) => BoardUtils.toString(state.boards[type]),
  getCell: (state, type, row, col) => state.boards[type] ? BoardUtils.getCell(state.boards[type], row, col) : null,
  getCellIndex: (state, type, index) => state.boards[type]?.[index],
  isSolved: state => state.boards.solved,
  showCellNotes: (state, index) => state.boards.showNotes?.[index],
  getSelectedCellValue: state => {
    if (state.boards[BOARD_TYPES.PLAYER] && state.game.selectedCell > -1) {
      let rowCol = getRowColumn(state.game.selectedCell);
      return BoardUtils.getCell(state.boards[BOARD_TYPES.PLAYER], rowCol.row, rowCol.col);
    }

    return 0;
  }
}

export { sagas } from './sagas';
