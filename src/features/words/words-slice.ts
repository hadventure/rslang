import { RootState } from '@/store/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TAuth } from '../user/types';
import {
  Difficulty, TOptional, TParam, TUserAnswer, TWord,
} from './types';

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

export const getUserWords = createAsyncThunk<number, Partial<TParam>, {
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

    return resp.json();
  },
);

export const getUserWord = createAsyncThunk<string, TUserAnswer, {
  extra: TAuth
  state: RootState
}>(
  'words/getUserWord',
  async (param, thunkAPI) => {
    const resp = await fetch(`${process.env.API_URL}/users/${thunkAPI.extra.userId}/words/${param.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${thunkAPI.extra.token}`,
      },
    });

    console.log(resp);

    if (resp.status === 404) {
      const params = {
        difficulty: Difficulty.studied,
        optional: {
          sprint: {
            right: param.right ? 1 : 0,
            wrong: param.right ? 0 : 1,
          },
        },
      };

      const resp1 = await fetch(`${process.env.API_URL}/users/${thunkAPI.extra.userId}/words/${param.id}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${thunkAPI.extra.token}`,
        },
        body: JSON.stringify(params),
      });

      console.log(resp1);
    }

    if (resp.status === 200) {
      const data = await resp.json();

      console.log(data);

      const params = {
        difficulty: Difficulty.studied,
        optional: {
          sprint: {
            right: param.right ? data.optional.sprint.right + 1 : data.optional.sprint.right,
            wrong: param.right ? data.optional.sprint.wrong : data.optional.sprint.wrong + 1,
          },
        },
      };

      console.log('put');

      const resp1 = await fetch(`${process.env.API_URL}/users/${thunkAPI.extra.userId}/words/${param.id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${thunkAPI.extra.token}`,
        },
        body: JSON.stringify(params),
      });

      console.log(resp1);
    }

    console.log('------', thunkAPI, resp);
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
  optional: TOptional,
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
  optional: {},
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
      // @ts-ignore
      local.list = action.payload[0].paginatedResults;
      // @ts-ignore
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
  setGroup,
  setPageWords,
  setCurrentWord,
  resetCurrentWord,
} = wordsSlice.actions;

export default wordsSlice.reducer;
