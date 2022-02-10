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
    const { group } = thunkAPI.getState().words;
    const page = '1';

    const resp = await fetch(`${process.env.API_URL}/users/${thunkAPI.extra.userId}/aggregatedWords?${new URLSearchParams({ group, page }).toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${thunkAPI.extra.token}`,
      },
    });

    return resp.json();
  },
);

// Define a type for the slice state
interface WordsState {
  list: TWord[],
  group: string,
  status: string | null
}

// Define the initial state using that type
const wordsState: WordsState = {
  list: [],
  group: '',
  status: null,
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
    });
    builder.addCase(getUserWords.rejected, (state, action) => {
      const local = state;
      local.status = 'failed';
    });
  },
  reducers: {
    setGroup(state, action) {
      console.log('set401', state, action);
      const local = state;
      local.group = action.payload;
    },
  },
});

export const {
  setGroup,
} = wordsSlice.actions;

export default wordsSlice.reducer;
