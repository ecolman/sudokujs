import { BoardTypes, rows } from '../actions';
import _ from 'lodash';

const boards = (state = {
  [BoardTypes.COMPLETE]: [],
  [BoardTypes.CULLED]: [],
  [BoardTypes.PLAYER]: []
}, action) => {
  switch (action.type) {
    case 'CLEAR_BOARD':
      return {
        ...state,
        [action.boardType]: _.map(rows, () => new Array(0, 0, 0, 0, 0, 0, 0, 0, 0))
      };

    case 'SET_BOARD':
      let cellsToSet = [];

      if (_.isString(action.values)) {
        cellsToSet = _.map(action.values.split(''), Number);
      }

      if (_.isArray(action.values)) {
        cellsToSet = action.values;
      }

      return {
        ...state,
        [action.boardType]: cellsToSet.length === 81
          ? _.map(rows, (row, index) => cellsToSet.slice(index * 9, index * 9 + 9))
          : _.map(rows, () => new Array(0, 0, 0, 0, 0, 0, 0, 0, 0))
      };

    case 'CLEAR_CELL':
      let clearIndex = action.row * 9 + action.col;

      return {
        ...state,
        [action.boardType]: _.map(state[action.boardType], (row, index) => {
          let rowIndex = index * 9;

          if (clearIndex > rowIndex && clearIndex < rowIndex + 9) {
            return [
              ...row.slice(0, clearIndex - rowIndex),
              0,
              ...row.slice(clearIndex - rowIndex + 1)
            ];
          } else {
            return row;
          }
        })
      };

    case 'SET_CELL':
      let setIndex = action.row * 9 + action.col;

      return {
        ...state,
        [action.boardType]: _.map(state[action.boardType], (row, index) =>{
          let rowIndex = index * 9;

          if (setIndex >= rowIndex && setIndex < rowIndex + 9) {
            return [
              ...row.slice(0, setIndex - rowIndex),
              action.value,
              ...row.slice(setIndex - rowIndex + 1)
            ];
          } else {
            return row;
          }
        })
      };

    default:
      return state;
  }
}

export default boards;
