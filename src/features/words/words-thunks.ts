import { createAsyncThunk } from '@reduxjs/toolkit';
import { TAuth } from '../user/types';
import { set401 } from '../user/user-slice';
import { TOptional, Difficulty } from './types';
import { toggleRefresh } from './words-slice';
import * as wordsAPI from './words-API';

export const addToDifficult = createAsyncThunk<number, {
  id: string,
  userWord: TOptional,
  type: string
}, { extra: TAuth }>(
  'words/addToDifficult',
  async (param, thunkAPI) => {
    const p: TOptional = {};
    let resp;

    if (param.userWord) {
      p.optional = param.userWord.optional;
      p.difficulty = param.type;

      resp = await wordsAPI.addWordToDifficult(param, p, thunkAPI.extra);
    } else {
      p.difficulty = param.type;
      p.optional = {};
      resp = await wordsAPI.createUserWord(param, p, thunkAPI.extra);
    }

    if (resp.status === 401) {
      thunkAPI.dispatch(set401(401));
    }

    if (resp.status === 200) {
      thunkAPI.dispatch(toggleRefresh({}));
    }

    return resp.json();
  },
);

export const addToDifficult1 = createAsyncThunk<number, {
  id: string,
  userWord: TOptional
}, { extra: TAuth }>(
  'words/addToDifficult',
  async (param, thunkAPI) => {
    console.log(param);

    const p: TOptional = {};
    let resp;

    if (param.userWord) {
      p.optional = param.userWord.optional;
      p.difficulty = Difficulty.difficult;

      resp = await wordsAPI.addWordToDifficult(param, p, thunkAPI.extra);
    } else {
      p.difficulty = Difficulty.difficult;
      p.optional = {};
      resp = await wordsAPI.createUserWord(param, p, thunkAPI.extra);
    }

    if (resp.status === 401) {
      thunkAPI.dispatch(set401(401));
    }

    if (resp.status === 200) {
      thunkAPI.dispatch(toggleRefresh({}));
    }

    return resp.json();
  },
);
