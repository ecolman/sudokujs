import { createAction, createReducer } from '@reduxjs/toolkit'
import { isNumber } from 'lodash';

import { gameDefaults } from '../constants';
import { getElapsedTime } from '../../game/utilities';

export const actions = {
  START_GAME_REQUEST: createAction('START_GAME_REQUEST'),
  START_GAME: createAction('START_GAME'),
  DEACTIVATE_GAME: createAction('DEACTIVATE_GAME'),
  PAUSE_GAME: createAction('PAUSE_GAME'),
  RESUME_GAME: createAction('RESUME_GAME'),
  RESET_GAME: createAction('RESET_GAME'),
  SET_NOTES_MODE: createAction('SET_NOTES_MODE'),
  SET_TIME: createAction('SET_TIME'),
  SET_LOADING: createAction('SET_LOADING'),
  SET_ERROR: createAction('SET_ERROR'),
  SET_PENALTY: createAction('SET_PENALTY'),
  SET_ERROR_AND_PENALTY: createAction('SET_ERROR_AND_PENALTY'),
  SET_SHOW_SOLVED: createAction('SET_SHOW_SOLVED'),
  SELECT_CELL: createAction('SELECT_CELL'),
  SELECT_SELECTOR: createAction('SELECT_SELECTOR')
};

export const reducer = createReducer(
  gameDefaults,
  {
    [actions.START_GAME]: (state, action) => {
      const { time, penalties } = action.payload;

      state.active = true;
      state.time = time || 0;
      state.penalties = penalties || 0;
      state.selectedCell = -1;
      state.selectorCell = -1;
      state.startedAt = new Date().getTime();
      state.stoppedAt = undefined;
    },
    [actions.DEACTIVATE_GAME]: (state, action) => {
      state.active = false;
      state.paused = false;
      state.stoppedAt = new Date().getTime();
    },
    [actions.PAUSE_GAME]: (state, action) => {
      state.paused = true;
      state.stoppedAt = new Date().getTime();
      state.time = getElapsedTime(state.time, state.startedAt, state.stoppedAt);
    },
    [actions.RESUME_GAME]: (state, action) => {
      state.active = true;
      state.paused = false;
      state.startedAt = new Date().getTime();
      state.stoppedAt = undefined;
    },
    [actions.RESET_GAME]: (state, action) => {
      state.active = false;
      state.paused = false;
      state.time = 0;
      state.penalties = 0;
      state.startedAt = undefined;
      state.stoppedAt = undefined;
    },
    [actions.SET_NOTES_MODE]: (state, action) => {
      state.notesMode = action.payload || false;
    },
    [actions.SET_LOADING]: (state, action) => {
      state.loading = action.payload;
    },
    [actions.SET_TIME]: (state, action) => {
      state.time = action.payload;
    },
    [actions.SET_ERROR]: (state, action) => {
      const { index, penalty } = action.payload;
      state.errorCell = isNumber(index) ? index : -1;

      if (penalty) {
        state.penalties += 1;
      }
    },
    [actions.SET_SHOW_SOLVED]: (state, action) => {
      state.showSolved = action.payload;
    },
    [actions.SELECT_CELL]: (state, action) => {
      state.selectedCell = isNumber(action.payload) ? action.payload : -1;
    },
    [actions.SELECT_SELECTOR]: (state, action) => {
      state.selectorCell = isNumber(action.payload) ? action.payload : -1;
    }
  }
);

export const selectors = {
  isActive: state => state.game.active,
  isNotesMode: state => state.game.notesMode,
  isLoading: state => state.game.loading,
  isPaused: state => state.game.paused,
  getTime: state => state.game.time,
  isErrorCell: (state, cellIndex) => state.game.errorCell === cellIndex,
  isSelectedCell: (state, cellIndex) => state.game.selectedCell === cellIndex,
  isPenalty: state => state.game.penalties > 0,
  getSelectedCell: state => state.game.selectedCell,
  getSelectorCell: state => state.game.selectorCell,
  getPenalties: state => state.game.penalties,
  getShowSolved: state => state.game.showSolved,
  getStartedAt: state => state.game.startedAt,
  getStoppedAt: state => state.game.stoppedAt
}

export { sagas } from './sagas';
