import { RootState } from '@/store/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TAuth } from '../user/types';
import { set401 } from '../user/user-slice';
import {
  TParam, TResult, TWord,
} from './types';
import { getWords } from './words-thunks';

export const getUserWords = createAsyncThunk<
number,
Pick<TParam, 'filter' | 'wordsPerPage'>, {
  extra: TAuth
  state: RootState
}>(
  'words/getUserWords',
  async (param, thunkAPI) => {
    const resp = await fetch(`${process.env.API_URL}/users/${thunkAPI.extra.userId}/aggregatedWords?${new URLSearchParams(param).toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${thunkAPI.extra.token}`,
      },
    });

    if (resp.status === 401) {
      thunkAPI.dispatch(set401(401));
    }

    return resp.json();
  },
);

// Define a type for the slice state
export interface WordsState {
  list: Array<TWord>,
  page: number,
  group: string,
  limit: string,
  count: number,

  status: string | null,
  currentWord: TWord | null,
  result: TResult[],

  refresh: boolean,

  sprintRightChainCount: number,
  sprintRightChain: number,
}

// Define the initial state using that type
const wordsState: WordsState = {
  list: [],
  page: 0,
  group: '',
  limit: '20',
  count: 0,
  status: null,
  currentWord: null,
  result: [],

  refresh: false,

  sprintRightChainCount: 0,
  sprintRightChain: 0,
};

const wordsSlice = createSlice({
  name: 'words',
  initialState: wordsState,
  extraReducers: (builder) => {
    // console.log('-----', builder, getWords);
    builder.addCase(getWords.pending, (state) => {
      // console.log(state, action)
      const local = state;
      local.status = 'loading';
    });
    builder.addCase(getWords.fulfilled, (state, action) => {
      const local = state;
      local.status = 'success';
      local.list = action.payload;
      local.count = 600;
    });
    builder.addCase(getWords.rejected, (state) => {
      const local = state;
      local.status = 'failed';
    });
    builder.addCase(getUserWords.pending, (state) => {
      // console.log(state, action)
      const local = state;
      local.status = 'loading';
    });
    builder.addCase(getUserWords.fulfilled, (state, action) => {
      const local = state;
      local.status = 'success';
      // @ts-ignore
      local.list = action.payload[0].paginatedResults;
      // @ts-ignore
      local.count = Number(action.payload[0].totalCount[0]) || 600;
      // @ts-ignore
      // local.page = action.payload[0].paginatedResults[0].page;
    });
    builder.addCase(getUserWords.rejected, (state) => {
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
    setResult(state, action) {
      const local = state;
      local.result.push(action.payload);
    },
    clearResult(state, action) {
      const local = state;
      local.result = action.payload;
    },
    toggleRefresh(state, action) {
      const local = state;
      local.refresh = !local.refresh;
    },
    setRightChainArr(state, action) {
      const local = state;

      local.sprintRightChain = local.sprintRightChainCount > local.sprintRightChain
        ? local.sprintRightChainCount : local.sprintRightChain;
      local.sprintRightChainCount = 0;
    },
    setRightChainCount(state, action) {
      const local = state;
      local.sprintRightChainCount += 1;
    },
    resetRightChainCount(state, action) {
      const local = state;
      local.sprintRightChainCount = 0;
      local.sprintRightChain = 0;
    },
  },
});

export const {
  setGroup,
  setPageWords,
  setCurrentWord,
  resetCurrentWord,
  setResult,
  toggleRefresh,
  clearResult,
  setRightChainArr,
  setRightChainCount,
  resetRightChainCount,
} = wordsSlice.actions;

export default wordsSlice.reducer;
