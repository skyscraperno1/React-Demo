import React  from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store'
import { Provider } from 'react-redux'
import './style/index.less'

ReactDOM.render(
  // <App {...store}/>,
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root'),
  sessionStorage.setItem('token', '213123')
);

