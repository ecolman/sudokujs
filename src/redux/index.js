import { configureStore } from '@reduxjs/toolkit'

import { reducer as boardsReducer } from './boards';
import { reducer as gameReducer } from './game';
import { reducer as optionssReducer } from './options';

const store = configureStore({
  reducer: {
    boards: boardsReducer,
    game: gameReducer,
    options: optionssReducer
  }
});

export default store;
