import { createAction, createReducer } from '@reduxjs/toolkit'

import { getElapsedTime } from '../game/utilities';

export const actions = {
  START_GAME: createAction('START_GAME'),
  DEACTIVATE_GAME: createAction('DEACTIVATE_GAME'),
  SET_NOTES_MODE: createAction('SET_NOTES_MODE'),
  PAUSE_GAME: createAction('PAUSE_GAME'),
  RESUME_GAME: createAction('RESUME_GAME'),
  RESET_GAME: createAction('RESET_GAME')
};

export const reducer = createReducer(
  {
    active: false,
    notesMode: false,
    paused: false,
    time: 0,
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
      state.stoppedAt = action.payload;
    },
    [actions.SET_NOTES_MODE]: (state, action) => {
      state.notesMode = action.payload || false;
    },
    [actions.PAUSE_GAME]: (state, action) => {
      state.paused = true;
      state.stoppedAt = action.payload;
    },
    [actions.RESUME_GAME]: (state, action) => {
      state.active = true;
      state.paused = false;
      state.startedAt = new Date().getTime();
      state.time = getElapsedTime(state.time, state.startedAt, state.stoppedAt);
      state.stoppedAt = undefined;
    },
    [actions.RESET_GAME]: (state, action) => {
      const now = new Date().getTime();

      state.active = false;
      state.paused = false;
      state.time = 0;
      state.startedAt = state.startedAt ? now : undefined;
      state.stoppedAt = state.stoppedAt ? now : undefined;
    }
  }
);
