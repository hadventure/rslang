import { Middleware } from '@reduxjs/toolkit';
import { set401 } from './user/user-slice';

const authMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  console.log('----', action);

  if (action.type?.startsWith('user/set401')) {
    store.dispatch(set401(action.meta.requestId));
    // const authState = store.getState().user.auth;
    // console.log(authState);

    // localStorage.setItem('auth', JSON.stringify(authState));
  }

  if (action.type?.startsWith('user/auth')) {
    const authState = store.getState().user.auth;
    console.log(authState);

    localStorage.setItem('auth', JSON.stringify(authState));
  }
  return result;
};

export default authMiddleware;

// https://stackoverflow.com/questions/68421040/local-storage-using-redux-toolkit
