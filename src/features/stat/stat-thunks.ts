/* eslint-disable import/prefer-default-export */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/store/types';
import { getFormattedDate, getOptionalStat } from '@/common/optional-entity';
import { set401 } from '../user/user-slice';
import { TAuth, TStatGame } from './types';
import * as statAPI from './stat-API';

export const getStat = createAsyncThunk<
// Return type of the payload creator
null,
// First argument to the payload creator
number | null,
{
  // Optional fields for defining thunkAPI field types
  extra: TAuth,
  state: RootState
}
>(
  'user/stat',
  async (learnedWordsCount, thunkAPI) => {
    const response = await statAPI.getStat(thunkAPI.extra);

    if (response.status === 200 && learnedWordsCount) {
      console.log(learnedWordsCount);
    }

    if (response.status === 404 && learnedWordsCount) {
      console.log(learnedWordsCount);
    }

    if (response.status === 200 && !learnedWordsCount) {
      const { words } = thunkAPI.getState();

      const data = await response.json();
      const stat = getOptionalStat();

      stat.optional = JSON.parse(JSON.stringify(data.optional));

      stat.optional.games[`${getFormattedDate()}`][words.result[0].game as keyof TStatGame].right += words.result.filter(
        (el) => el.right === 1,
      ).length;

      stat.optional.games[`${getFormattedDate()}`][words.result[0].game as keyof TStatGame].wrong += words.result.filter(
        (el) => el.right === 0,
      ).length;

      console.log(stat.optional, data.optional);
      await statAPI.updateStat(stat, thunkAPI.extra);
    }

    if (response.status === 404 && !learnedWordsCount) {
      const { words } = thunkAPI.getState();
      const stat = getOptionalStat();

      stat.optional.games[`${getFormattedDate()}`][words.result[0].game as keyof TStatGame].right += words.result.filter(
        (el) => el.right === 1,
      ).length;

      stat.optional.games[`${getFormattedDate()}`][words.result[0].game as keyof TStatGame].wrong += words.result.filter(
        (el) => el.right === 0,
      ).length;

      await statAPI.updateStat(stat, thunkAPI.extra);
    }

    if (response.status === 401) {
      thunkAPI.dispatch(set401(401));
    }

    return response.json();
  },
);
