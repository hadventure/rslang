import { configureStore } from '@reduxjs/toolkit';
import wordsSlice from '@/features/words/words-slice';
import userSlice from '@/features/user/user-slice';

const store = configureStore({
  reducer: {
    words: wordsSlice,
    user: userSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, words: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
