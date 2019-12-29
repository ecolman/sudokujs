import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { throttle } from 'lodash';
import * as localStorageStore from 'store';

import { reducer as boardsReducer, sagas as boardsSagas } from './boards';
import { reducer as gameReducer, actions as gameActions, sagas as gameSagas } from './game';
import { reducer as optionssReducer } from './options';

const sagaMiddleware = createSagaMiddleware()
const isDev = !(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test');

let middleware = [...getDefaultMiddleware(), sagaMiddleware];

// check local storage for redux state
let localStorageState = localStorageStore.get('state');

if (localStorageState) {
  localStorageState.game = {
    active: false,
    notesMode: false,
    paused: false,
    time: localStorageState.game.time || 0,
    penalties: localStorageState.game.penalties || 0,
    errorCell: -1,
    selectedCell: -1,
    selectorCell: -1,
    startedAt: localStorageState.game.startedAt || undefined,
    stoppedAt: localStorageState.game.stoppedAt || undefined
  }
}

const store = configureStore({
  reducer: {
    boards: boardsReducer,
    game: gameReducer,
    options: optionssReducer
  },
  middleware,
  devTools: isDev,
  preloadedState: localStorageState
});

sagaMiddleware.run(function*() {
  yield all([
    boardsSagas.watchSetCell(),
    gameSagas.watchStartGame()
  ])
});

// write redux state to local storage at most every 1 second
store.subscribe(throttle(() => {
  localStorageStore.set('state', store.getState());
}, 1000));

// before browser window closes, if game is active, set pause state and then save state local storage
window.addEventListener('unload', event => {
  const state = store.getState();

  if (state.game.active) {
    store.dispatch(gameActions.PAUSE_GAME());
  }

  localStorageStore.set('state', store.getState());
});

export default store;
