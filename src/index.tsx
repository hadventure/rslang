import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './app';
import store from './store/store';
import './global.scss';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
