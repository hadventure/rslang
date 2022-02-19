import { Middleware } from '@reduxjs/toolkit';
import { setUserData, set401, setUserIsAuth } from './user/user-slice';

const authMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  console.log('----', action);

  if (action.type?.startsWith('user/setToken')) {
    window.location.replace('/home');
  }

  if (action.type?.startsWith('user/checkUserData')) {
    const user = JSON.parse(localStorage.getItem('auth') as string);

    if (user) {
      store.dispatch(setUserData(user));
      store.dispatch(setUserIsAuth(true));
    } else {
      store.dispatch(setUserIsAuth(false));
    }
  }

  if (action.type?.startsWith('user/set401')) {
    store.dispatch(set401(action.meta.requestId));
  }

  if (action.type?.startsWith('user/auth')) {
    const authState = store.getState().user.auth;

    localStorage.setItem('auth', JSON.stringify(authState));
  }

  if (action.type?.startsWith('user/logout')) {
    localStorage.removeItem('auth');
    window.location.reload();
  }

  return result;
};

export default authMiddleware;

// https://stackoverflow.com/questions/68421040/local-storage-using-redux-toolkit
