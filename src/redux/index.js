import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

import { reducer as boardsReducer, sagas as boardsSagas } from './boards';
import { reducer as gameReducer, sagas as gameSagas } from './game';
import { reducer as optionssReducer } from './options';

const sagaMiddleware = createSagaMiddleware()
// const isDev = !(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test');

let middleware = [...getDefaultMiddleware(), sagaMiddleware];

// if (isDev) {
//   middleware.push(createLogger({
//     collapsed: true
//   }));
// }

const store = configureStore({
  reducer: {
    boards: boardsReducer,
    game: gameReducer,
    options: optionssReducer
  },
  middleware
})

sagaMiddleware.run(function*() {
  yield all([
    boardsSagas.watchSetCell(),
    gameSagas.watchStartGame()
  ])
});

export default store;
