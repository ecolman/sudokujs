import { filter, isArray } from 'lodash';

import { BoardTypes } from '../actions';
import { getCellIndex } from '../../game/utilities';

const boards = (state = {
  [BoardTypes.BASE]: undefined,
  [BoardTypes.COMPLETE]: undefined,
  [BoardTypes.DISPLAY]: undefined,
  [BoardTypes.PLAYER]: undefined,
  [BoardTypes.NOTES]: undefined,
  selectedCell: -1
}, action) => {
  switch (action.type) {
    case 'CLEAR_BOARD':
      if (action.boardType && state[action.boardType]) {
        state[action.boardType].clear();
      }

      return {
        ...state
      };

    case 'CLEAR_CELL':
      if (state[BoardTypes.PLAYER]) {
        state[BoardTypes.PLAYER].clearCell(action.row, action.col);
      }

      return {
        ...state,
        [BoardTypes.DISPLAY]: state[BoardTypes.DISPLAY] && state[BoardTypes.PLAYER]
          ? state[BoardTypes.PLAYER].toDimensionalArray()
          : state[BoardTypes.DISPLAY]
      };

    case 'SELECT_CELL':
      return {
        ...state,
        selectedCell: action.cellIndex || 0
      };

    case 'SET_BOARD':
      return {
        ...state,
        [action.boardType]: action.board
      };

    case 'SET_CELL':
      if (state[BoardTypes.PLAYER]) {
        state[BoardTypes.PLAYER].setCell(action.row, action.col, action.value);
      }

      return {
        ...state,
        [BoardTypes.DISPLAY]: state[BoardTypes.DISPLAY] && state[BoardTypes.PLAYER]
          ? state[BoardTypes.PLAYER].toDimensionalArray()
          : state[BoardTypes.DISPLAY]
      };

    case 'ADD_NOTE':
      const anCellIndex = getCellIndex(action.row, action.col);

      if (state[BoardTypes.NOTES] && isArray(state[BoardTypes.NOTES][anCellIndex]) && state[BoardTypes.NOTES][anCellIndex].indexOf(action.value) === -1) {
        state[BoardTypes.NOTES][anCellIndex] = state[BoardTypes.NOTES][anCellIndex].concat([action.value]);
      }

      return {
        ...state
      };

    case 'DELETE_NOTE':
      const dnCellIndex = getCellIndex(action.row, action.col);

      if (state[BoardTypes.NOTES] && isArray(state[BoardTypes.NOTES][dnCellIndex])) {
        state[BoardTypes.NOTES][dnCellIndex] = filter(state[BoardTypes.NOTES][dnCellIndex], v => v !== action.value);
      }

      return {
        ...state
      };

    default:
      return state;
  }
}

export default boards;
