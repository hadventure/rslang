import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './layout/app/app';
import store from './store/store';
import './app.scss';
import './global.scss';

console.log('start');

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename="/lan3945663-JSFE2021Q3/rslang">
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
