/* eslint-disable import/prefer-default-export */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/store/types';
import { getFormattedDate, getOptionalStat } from '@/common/optional-entity';
import { set401 } from '../user/user-slice';
import { TAuth, TStat, TStatGame } from './types';
import * as statAPI from './stat-API';
import { clearResult } from '../words/words-slice';

export const getStatData = createAsyncThunk<
// Return type of the payload creator
TStat,
// First argument to the payload creator
unknown,
{
  // Optional fields for defining thunkAPI field types
  extra: TAuth,
  state: RootState
}
>(
  'stat/getStat',
  async (param, thunkAPI) => {
    const response = await statAPI.getStat(thunkAPI.extra);
    if (response.status === 404) {
      const stat = getOptionalStat();
      const r = await statAPI.updateStat(stat, thunkAPI.extra);
      return r.json();
    }

    if (response.status === 401) {
      thunkAPI.dispatch(set401(401));
    }

    return response.json();
  },
);

export const getStat = createAsyncThunk<
// Return type of the payload creator
null,
// First argument to the payload creator
number,
{
  // Optional fields for defining thunkAPI field types
  extra: TAuth,
  state: RootState
}
>(
  'user/stat',
  async (rightChain, thunkAPI) => {
    const response = await statAPI.getStat(thunkAPI.extra);

    const { result, sprintRightChain } = thunkAPI.getState().words;
    const today = `${getFormattedDate()}`;
    const { game } = result[0];

    const stat = getOptionalStat();

    if (response.status === 200) {
      const data = await response.json();

      stat.optional.games = {
        ...stat.optional.games,
        ...JSON.parse(JSON.stringify(data.optional)).games,
      };

      stat.optional.learnedWords = {
        ...stat.optional.learnedWords,
        ...JSON.parse(JSON.stringify(data.optional)).learnedWords,
      };

      stat.optional.pages = {
        ...stat.optional.pages,
        ...JSON.parse(JSON.stringify(data.optional)).pages,
      };

      stat.learnedWords = data.learnedWords || stat.learnedWords;

      stat.optional.games[today][game].right += result.filter(
        (el) => el.right === 1,
      ).length;

      stat.optional.games[today][game].wrong += result.filter(
        (el) => el.right === 0,
      ).length;

      stat.optional.games[today][game].newWordCount += result.filter(
        (el) => el.isNewWord === true,
      ).length;

      if (stat.optional.games[today][game].gamerightchain < sprintRightChain) {
        stat.optional.games[today][game].gamerightchain = sprintRightChain;
      }

      await statAPI.updateStat(stat, thunkAPI.extra);
    }

    if (response.status === 404) {
      stat.optional.games[today][game].right += result.filter(
        (el) => el.right === 1,
      ).length;

      stat.optional.games[today][game].wrong += result.filter(
        (el) => el.right === 0,
      ).length;

      stat.optional.games[today][game].newWordCount += result.filter(
        (el) => el.isNewWord === true,
      ).length;

      if (stat.optional.games[today][game].gamerightchain < sprintRightChain) {
        stat.optional.games[today][game].gamerightchain = sprintRightChain;
      }

      await statAPI.updateStat(stat, thunkAPI.extra);
      thunkAPI.dispatch(clearResult([]));
    }

    if (response.status === 401) {
      thunkAPI.dispatch(set401(401));
    }

    return response.json();
  },
);

export const setLearnedWords = createAsyncThunk<
// Return type of the payload creator
null,
// First argument to the payload creator
number,
{
  // Optional fields for defining thunkAPI field types
  extra: TAuth,
  state: RootState
}
>(
  'stat/setLearnedWords',
  async (learnedWordsCount, thunkAPI) => {
    const response = await statAPI.getStat(thunkAPI.extra);
    const today = getFormattedDate();

    if (response.status === 200) {
      const data = await response.json();
      const stat = getOptionalStat();

      stat.optional = JSON.parse(JSON.stringify(data.optional));

      if (stat.optional.learnedWords[today]) {
        stat.optional.learnedWords[today] += learnedWordsCount;
      } else {
        stat.optional.learnedWords[today] = 1;
      }

      await statAPI.updateStat(stat, thunkAPI.extra);
    }

    if (response.status === 404) {
      const stat = getOptionalStat();
      stat.optional.learnedWords[today] += 1;
      await statAPI.updateStat(stat, thunkAPI.extra);
    }

    if (response.status === 401) {
      thunkAPI.dispatch(set401(401));
    }

    return response.json();
  },
);

