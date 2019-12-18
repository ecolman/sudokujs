import { createAction, createReducer } from '@reduxjs/toolkit'

export const actions = {
  SET_OPTION: createAction('SET_OPTION')
};

export const reducer = createReducer(
  {
    feedback: false,
    highlighting: false,
    removeNotes: false,
    numberFirst: false,
    penalty: false,
    timer: true,
    visible: false
  },
  {
    [actions.SET_OPTION]: (state, action) => {
      const { option, value } = action.payload;

      if (option && option in state) {
        state[option] = value;
      }
    }
  }
);
