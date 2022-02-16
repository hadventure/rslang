import { RootState } from '@/store/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TAuth } from '../user/types';
import { set401 } from '../user/user-slice';
import {
  Difficulty, TOptional, TParam, TResult, TUserAnswer, TWord,
} from './types';
import * as wordsAPI from './words-API';

export const getWords = createAsyncThunk(
  'words/getWords',
  async (param: Partial<TParam>, thunkAPI) => fetch(`${process.env.API_URL}/words?${new URLSearchParams(param).toString()}`)
    .then(
      (res) =>
        // console.log(page, thunkAPI.getState());
        res.json()
      ,
    ),
);

export const getUserWords = createAsyncThunk<
number,
Partial<TParam>, {
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

export const getUserWord = createAsyncThunk<string, TUserAnswer, {
  extra: TAuth
  state: RootState
}>(
  'words/getUserWord',
  async (param, thunkAPI) => {
    const resp = await wordsAPI.getUserWord(param, thunkAPI.extra);

    if (resp.status === 404) {
      const params = {
        difficulty: Difficulty.studied,
        optional: {
          [param.game]: {
            right: param.right ? 1 : 0,
            wrong: param.right ? 0 : 1,
            chain: param.right ? 1 : 0,
          },
        },
      };

      await wordsAPI.createUserWord(param, params, thunkAPI.extra);
      thunkAPI.dispatch(setResult({ ...param, state: params.difficulty }));
    }

    if (resp.status === 200) {
      const data = await resp.json();

      const { right, wrong, chain } = data.optional[param.game];

      const params = {
        difficulty: param.right && chain > 2 ? Difficulty.learned : Difficulty.studied,
        optional: {
          [param.game]: {
            right: param.right ? right + 1 : right,
            wrong: param.right ? wrong : wrong + 1,
            chain: param.right ? chain + 1 : chain,
          },
        },
      };

      console.log(params);

      await wordsAPI.updateUserWord(param, params, thunkAPI.extra);

      thunkAPI.dispatch(setResult({ ...param, state: params.difficulty }));
    }

    return resp.json();
  },
);

// Define a type for the slice state
export interface WordsState {
  list: Array<TWord>,
  page: string,
  group: string,
  limit: string,
  count: number,

  status: string | null,
  currentWord: TWord | null,
  result: TResult[],

  refresh: boolean,
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
  result: [],

  refresh: false,
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
      local.count = action.payload[0].totalCount[0].count;
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
    toggleRefresh(state, action) {
      const local = state;
      local.refresh = !local.refresh;
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
} = wordsSlice.actions;

export default wordsSlice.reducer;
