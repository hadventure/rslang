/* eslint-disable import/prefer-default-export */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getOptional } from '@/common/optional-entity';
import { RootState } from '@/store/types';
import { TAuth } from '../user/types';
import { set401 } from '../user/user-slice';
import {
  TOptional, Difficulty, TUserAnswer, TGames, TParam, TWord,
} from './types';
import { setResult, toggleRefresh } from './words-slice';
import * as wordsAPI from './words-API';
import { getStat, setLearnedWords } from '../stat/stat-thunks';

export const addToDifficult = createAsyncThunk<number, {
  id: string,
  userWord: TOptional | undefined,
  type: string
}, { extra: TAuth }>(
  'words/addToDifficult',
  async (param, thunkAPI) => {
    const p = getOptional();
    let resp;

    if (param.userWord) {
      p.optional = param.userWord.optional;
      p.difficulty = param.type;
      resp = await wordsAPI.addWordToDifficult(param, p, thunkAPI.extra);
    } else {
      p.difficulty = param.type;

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
      thunkAPI.dispatch(setResult({ ...param, isNewWord: true, state: optional.difficulty }));
    }

    if (resp.status === 200) {
      const data = await resp.json();
      const { right, wrong, chain } = data.optional[param.game];

      optional.difficulty = data.difficulty;
      optional.optional[param.game as keyof TGames] = {
        right: param.right ? right + 1 : right,
        wrong: param.right ? wrong : wrong + 1,
        chain: param.right ? chain + 1 : 0,
      };

      if (param.right && chain >= 2 && optional.difficulty === Difficulty.studied) {
        optional.difficulty = Difficulty.learned;
      }

      if (param.right && chain >= 4 && optional.difficulty === Difficulty.difficult) {
        optional.difficulty = Difficulty.learned;
      }

      if (!param.right) {
        optional.difficulty = Difficulty.studied;
        thunkAPI.dispatch(setLearnedWords(-1));
      }

      if (optional.difficulty === Difficulty.learned && data.difficulty === Difficulty.studied) {
        thunkAPI.dispatch(setLearnedWords(1));
      }
      await wordsAPI.updateUserWord(param, optional, thunkAPI.extra);

      thunkAPI.dispatch(setResult({ ...param, isNewWord: false, state: optional.difficulty }));
    }

    return resp.json();
  },
);

export const getWords = createAsyncThunk<TWord[], Pick<TParam, 'group' | 'page' | 'wordsPerPage'>, {
  extra: TAuth
  state: RootState
}>(
  'words/getWords',
  async (param) => {
    const resp = await wordsAPI.getWordList(param);

    return resp.json();
  },
);
