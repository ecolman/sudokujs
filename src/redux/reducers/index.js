import { combineReducers } from 'redux';

import boards from './boards';
import game from './game';
import options from './options';

export default combineReducers({
  boards,
  game,
  options
});
