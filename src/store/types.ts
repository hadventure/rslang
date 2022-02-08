import store from './store';

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, words: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
