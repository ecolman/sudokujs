import { createAction, createReducer } from '@reduxjs/toolkit'

export const actions = {
  SET_OPTION: createAction('SET_OPTION')
};

export const reducer = createReducer(
  {
    feedback: false,
    highlighting: true,
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

export const selectors = {
  isFeedback: state => state.options.feedback,
  isHighlighting: state => state.options.highlighting,
  isRemoveNotes: state => state.options.removeNotes,
  isNumberFirst: state => state.options.numberFirst,
  isPenalty: state => state.options.penalty,
  isTimer: state => state.options.timer,
  isVisible: state => state.options.visible
}
