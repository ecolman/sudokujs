import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import Store from '../redux';

import './css/index.less';
import App from './components/App';

import RaphaelUI from './raphael';

ReactDOM.render(
  <Provider store={Store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
