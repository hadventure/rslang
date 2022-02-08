import { configureStore } from '@reduxjs/toolkit';
import wordsSlice from '@/features/words/words-slice';
import userSlice from '@/features/user/user-slice';
import authMiddleware from '@/features/auth-middleware';
import statSlice from '@/features/stat/stat-slice';

const auth = () => {
  if (localStorage.getItem('auth') !== null) {
    return JSON.parse(localStorage.getItem('auth') as string); // re-hydrate the store
  }

  return {}
};

const store = configureStore({
  reducer: {
    words: wordsSlice,
    user: userSlice,
    stat: statSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: {
      extraArgument: auth(),
    },
  }).concat(authMiddleware),
});

export default store;
