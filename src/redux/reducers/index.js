import { combineReducers } from 'redux';
import boards from './boards';
import todos from './todos';
import visibilityFilter from './visibilityFilter';

export default combineReducers({
  boards,
  todos,
  visibilityFilter
});
