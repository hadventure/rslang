/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getOptional } from '@/common/optional-entity';
import { RootState } from '@/store/types';
import { TAuth } from '../user/types';
import { set401 } from '../user/user-slice';
import {
  TOptional, Difficulty, TUserAnswer, TGames, TParam, TWord, UpdateWord,
} from './types';
import { setResult, toggleRefresh, toggleUpdate } from './words-slice';
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

      // console.log(param)
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

      const x = await wordsAPI.createUserWord(param, optional, thunkAPI.extra);

      thunkAPI.dispatch(setResult({ ...param, isNewWord: true, state: optional.difficulty }));
    }

    if (resp.status === 200) {
      thunkAPI.dispatch(toggleUpdate(UpdateWord.updating));

      const data = await resp.json();

      optional.difficulty = data.difficulty;
      if (param.game === 'audiocall') {
        optional.optional[param.game] = {
          right: param.right ? data.optional[param.game].right + 1 : data.optional[param.game].right,
          wrong: param.right ? data.optional[param.game].wrong : data.optional[param.game].wrong + 1,
          chain: param.right ? data.optional[param.game].chain + 1 : 0,
        };

        optional.optional.sprint = {
          right: data.optional.sprint.right,
          wrong: data.optional.sprint.wrong,
          chain: param.right ? data.optional.sprint.chain : 0,
        };
      }

      if (param.game === 'sprint') {
        optional.optional[param.game] = {
          right: param.right ? data.optional[param.game].right + 1 : data.optional[param.game].right,
          wrong: param.right ? data.optional[param.game].wrong : data.optional[param.game].wrong + 1,
          chain: param.right ? data.optional[param.game].chain + 1 : 0,
        };

        optional.optional.audiocall = {
          right: data.optional.audiocall.right,
          wrong: data.optional.audiocall.wrong,
          chain: param.right ? data.optional.audiocall.chain : 0,
        };
      }

      if (param.right
          && (data.optional.audiocall.chain >= 2 || data.optional.sprint.chain >= 2)
          && optional.difficulty === Difficulty.studied
      ) {
        optional.difficulty = Difficulty.learned;
      }

      if (param.right
        && (data.optional.audiocall.chain >= 4 || data.optional.sprint.chain >= 4)
        && optional.difficulty === Difficulty.difficult
      ) {
        optional.difficulty = Difficulty.learned;
      }

      if (!param.right && optional.difficulty === Difficulty.learned) {
        optional.difficulty = Difficulty.studied;
        thunkAPI.dispatch(setLearnedWords(-1));
      }

      if (optional.difficulty === Difficulty.learned && data.difficulty === Difficulty.studied) {
        thunkAPI.dispatch(setLearnedWords(1));
      }

      const x = await wordsAPI.updateUserWord(param, optional, thunkAPI.extra);
      thunkAPI.dispatch(toggleUpdate(UpdateWord.updated));
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

export const getUserWordsDifficult = createAsyncThunk<
TWord[],
Pick<TParam, 'filter' | 'wordsPerPage'>, {
  extra: TAuth
  state: RootState
}>(
  'words/getUserWordsDifficult',
  async (param, thunkAPI) => {
    const resp = await fetch(`${process.env.API_URL}/users/${thunkAPI.extra.userId}/aggregatedWords?${new URLSearchParams(param).toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${thunkAPI.extra.token}`,
      },
    });

    const data = await resp.json();

    if (resp.status === 200) {
      thunkAPI.dispatch(toggleRefresh({}));
    }

    if (resp.status === 401) {
      thunkAPI.dispatch(set401(401));
    }

    return data;
  },
);
