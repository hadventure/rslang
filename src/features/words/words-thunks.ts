/* eslint-disable import/prefer-default-export */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getOptional } from '@/common/optional-entity';
import { RootState } from '@/store/types';
import { TAuth } from '../user/types';
import { set401 } from '../user/user-slice';
import {
  TOptional, Difficulty, TUserAnswer, TGames, TParam,
} from './types';
import { setResult, toggleRefresh } from './words-slice';
import * as wordsAPI from './words-API';
import { getStat } from '../stat/stat-thunks';

export const addToDifficult = createAsyncThunk<number, Partial<{
  id: string,
  userWord: TOptional | undefined,
  type: string
}>, { extra: TAuth }>(
  'words/addToDifficult',
  async (param, thunkAPI) => {
    const p = getOptional();
    // let resp;

    // if (param.userWord) {
    //   p.optional = param.userWord.optional;
    //   p.difficulty = param.type;
    const resp = await wordsAPI.createUserWord(param, p, thunkAPI.extra);

    //   // resp = await wordsAPI.addWordToDifficult(param, p, thunkAPI.extra);
    // } else {
    //   p.difficulty = param.type;
    //   resp = await wordsAPI.createUserWord(param, p, thunkAPI.extra);
    // }

    if (resp.status === 401) {
      thunkAPI.dispatch(set401(401));
    }

    if (resp.status === 200) {
      thunkAPI.dispatch(toggleRefresh({}));
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
    const optional = getOptional();

    if (resp.status === 404) {
      optional.difficulty = Difficulty.studied;
      optional.optional[param.game as keyof TGames] = {
        right: param.right ? 1 : 0,
        wrong: param.right ? 0 : 1,
        chain: param.right ? 1 : 0,
      };

      await wordsAPI.createUserWord(param, optional, thunkAPI.extra);
      thunkAPI.dispatch(setResult({ ...param, state: optional.difficulty }));
    }

    if (resp.status === 200) {
      const data = await resp.json();
      const { right, wrong, chain } = data.optional[param.game];

      optional.difficulty = param.right && chain >= 2 ? Difficulty.learned : Difficulty.studied;
      optional.optional[param.game as keyof TGames] = {
        right: param.right ? right + 1 : right,
        wrong: param.right ? wrong : wrong + 1,
        chain: param.right ? chain + 1 : 0,
      };

      if (optional.difficulty === Difficulty.learned) {
        thunkAPI.dispatch(getStat(1));
      }
      await wordsAPI.updateUserWord(param, optional, thunkAPI.extra);

      thunkAPI.dispatch(setResult({ ...param, state: optional.difficulty }));
    }

    return resp.json();
  },
);

export const getWords = createAsyncThunk<string, Partial<TParam>, {
  extra: TAuth
  state: RootState
}>(
  'words/getWords',
  async (param, thunkAPI) => {
    const resp = await wordsAPI.getWordList(param, thunkAPI.extra);

    return resp.json();
  },
);
