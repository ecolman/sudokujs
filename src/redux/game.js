import { createAction, createReducer } from '@reduxjs/toolkit'

import { getElapsedTime } from '../game/utilities';

export const actions = {
  START_GAME: createAction('START_GAME'),
  DEACTIVATE_GAME: createAction('DEACTIVATE_GAME'),
  PAUSE_GAME: createAction('PAUSE_GAME'),
  RESUME_GAME: createAction('RESUME_GAME'),
  RESET_GAME: createAction('RESET_GAME'),
  SET_NOTES_MODE: createAction('SET_NOTES_MODE'),
  SET_TIME: createAction('SET_TIME'),
  SELECT_CELL: createAction('SELECT_CELL'),
  SELECT_SELECTOR: createAction('SELECT_SELECTOR')
};

export const reducer = createReducer(
  {
    active: false,
    notesMode: false,
    paused: false,
    time: 0,
    selectedCell: -1,
    selectorCell: -1,
    startedAt: undefined,
    stoppedAt: undefined
  },
  {
    [actions.START_GAME]: (state, action) => {
      const { time } = action.payload;

      state.active = true;
      state.time = time;
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
      state.startedAt = undefined;
      state.stoppedAt = undefined;
    },
    [actions.SET_NOTES_MODE]: (state, action) => {
      state.notesMode = action.payload || false;
    },
    [actions.SET_TIME]: (state, action) => {
      state.time = action.payload;
    },
    [actions.SELECT_CELL]: (state, action) => {
      state.selectedCell = action.payload || 0;
    },
    [actions.SELECT_SELECTOR]: (state, action) => {
      state.selectorCell = action.payload || 0;
    }
  }
);

export const selectors = {
  isActive: state => state.game.active,
  isNotesMode: state => state.game.notesMode,
  isPaused: state => state.game.paused,
  getTime: state => state.game.time,
  getSelectedCell: state => state.game.selectedCell,
  getSelectorCell: state => state.game.selectorCell,
  getStartedAt: state => state.game.startedAt,
  getStoppedAt: state => state.game.stoppedAt
}
