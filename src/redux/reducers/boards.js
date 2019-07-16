import { BoardTypes } from '../actions';

const boards = (state = {
  [BoardTypes.BASE]: undefined,
  [BoardTypes.COMPLETE]: undefined,
  [BoardTypes.DISPLAY]: undefined,
  [BoardTypes.PLAYER]: undefined
}, action) => {
  switch (action.type) {
    case 'SET_BOARD':
      return {
        ...state,
        [action.boardType]: action.board
      };

    case 'CLEAR_BOARD':
      if (action.boardType && state[action.boardType]) {
        state[action.boardType].clear();
      }

      return {
        ...state
      };

    case 'SET_CELL':
      if (state[BoardTypes.PLAYER]) {
        state[BoardTypes.PLAYER].setCell(action.row, action.col, action.value);
      }

      if (state[BoardTypes.DISPLAY] && state[BoardTypes.PLAYER]) {
        state[BoardTypes.DISPLAY] = state[BoardTypes.PLAYER].toDimensionalArray();
      }

      return {
        ...state
      };

    case 'CLEAR_CELL':
        if (state[BoardTypes.PLAYER]) {
          state[action.boardType].clearCell(action.row, action.col);
        }

        if (state[BoardTypes.DISPLAY] && state[BoardTypes.PLAYER]) {
          state[BoardTypes.DISPLAY] = state[BoardTypes.PLAYER].toDimensionalArray();
        }

      return {
        ...state
      };

    default:
      return state;
  }
}

export default boards;
