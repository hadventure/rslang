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
      const { result } = thunkAPI.getState().words;

      console.log(result);

      const data = await response.json();
      const stat = getOptionalStat();

      stat.optional = JSON.parse(JSON.stringify(data.optional));

      stat.optional.games[`${getFormattedDate()}`][result[0].game].right += result.filter(
        (el) => el.right === 1,
      ).length;

      stat.optional.games[`${getFormattedDate()}`][result[0].game].wrong += result.filter(
        (el) => el.right === 0,
      ).length;

      stat.optional.games[`${getFormattedDate()}`][result[0].game].newWordCount += result.filter(
        (el) => el.isNewWord === true,
      ).length;

      console.log(stat.optional, data.optional);
      await statAPI.updateStat(stat, thunkAPI.extra);
    }

    if (response.status === 404 && !learnedWordsCount) {
      const { result } = thunkAPI.getState().words;
      const stat = getOptionalStat();

      stat.optional.games[`${getFormattedDate()}`][result[0].game].right += result.filter(
        (el) => el.right === 1,
      ).length;

      stat.optional.games[`${getFormattedDate()}`][result[0].game].wrong += result.filter(
        (el) => el.right === 0,
      ).length;

      stat.optional.games[`${getFormattedDate()}`][result[0].game].newWordCount += result.filter(
        (el) => el.isNewWord === true,
      ).length;

      await statAPI.updateStat(stat, thunkAPI.extra);
    }

    if (response.status === 401) {
      thunkAPI.dispatch(set401(401));
    }

    return response.json();
  },
);
