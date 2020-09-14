import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from './redux';

import './css/index.less';
import Sudoku from './components/sudoku';

ReactDOM.render(
  <Provider store={store}>
    <Sudoku />
  </Provider>,
  document.getElementById('root'),
);
