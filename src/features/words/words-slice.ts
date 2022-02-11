import { RootState } from '@/store/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TAuth } from '../user/types';
import { TWord } from './types';

export const getWords = createAsyncThunk(
  'words/getWords',
  async (page: number, thunkAPI) => fetch(`${process.env.API_URL}/words?page=2&group=0`)
    .then(
      (res) =>
        // console.log(page, thunkAPI.getState());
        res.json()
      ,
    ),
);

export const getUserWords = createAsyncThunk<number, unknown, {
  extra: TAuth
  state: RootState
}>(
  'words/getUserWords',
  async (_, thunkAPI) => {
    const { group, page } = thunkAPI.getState().words;

    const resp = await fetch(`${process.env.API_URL}/users/${thunkAPI.extra.userId}/aggregatedWords?${new URLSearchParams({ group, page, wordsPerPage: '20' }).toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${thunkAPI.extra.token}`,
      },
    });

    return resp.json();
  },
);

// Define a type for the slice state
export interface WordsState {
  list: TWord[],
  page: string,
  group: string,
  limit: string,
  count: number,
  status: string | null,
  currentWord: TWord | null,
}

// Define the initial state using that type
const wordsState: WordsState = {
  list: [],
  page: '1',
  group: '',
  limit: '20',
  count: 0,
  status: null,
  currentWord: null,
};

const wordsSlice = createSlice({
  name: 'words',
  initialState: wordsState,
  extraReducers: (builder) => {
    // console.log('-----', builder, getWords);
    builder.addCase(getWords.pending, (state, action) => {
      // console.log(state, action)
      const local = state;
      local.status = 'loading';
    });
    builder.addCase(getWords.fulfilled, (state, action) => {
      const local = state;
      local.status = 'success';
      local.list = action.payload;
    });
    builder.addCase(getWords.rejected, (state, action) => {
      const local = state;
      local.status = 'failed';
    });
    builder.addCase(getUserWords.pending, (state, action) => {
      // console.log(state, action)
      const local = state;
      local.status = 'loading';
    });
    builder.addCase(getUserWords.fulfilled, (state, action) => {
      const local = state;
      local.status = 'success';
      local.list = action.payload[0].paginatedResults;
      local.count = action.payload[0].totalCount[0].count;
    });
    builder.addCase(getUserWords.rejected, (state, action) => {
      const local = state;
      local.status = 'failed';
    });
  },
  reducers: {
    setGroup(state, action) {
      const local = state;
      local.group = action.payload;
    },
    setPageWords(state, action) {
      const local = state;
      local.page = action.payload;
    },
    setCurrentWord(state, action) {
      const local = state;
      local.currentWord = local.list[action.payload];
    },
    resetCurrentWord(state, action) {
      const local = state;
      local.currentWord = null;
    },
  },
});

export const {
  setGroup, setPageWords, setCurrentWord, resetCurrentWord,
} = wordsSlice.actions;

export default wordsSlice.reducer;
