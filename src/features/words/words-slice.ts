import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TWord } from './types';

export const getWords = createAsyncThunk(
  'words/getWords',
  async (page: number, thunkApi) => fetch(`${process.env.API_URL}/words?page=2&group=0`)
    .then(
      (res) =>
        // console.log(page, thunkApi.getState());
        res.json()
      ,
    ),
);

// Define a type for the slice state
interface WordsState {
  list: TWord[],
  status: string | null
}

// Define the initial state using that type
const wordsState: WordsState = {
  list: [],
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
  },
  reducers: {},
});

export default wordsSlice.reducer;
