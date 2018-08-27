import { createStore } from 'redux';
import rootReducer from './reducers'

const Store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

Object.freeze(Store);
export default Store;
