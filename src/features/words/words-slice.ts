import { getOptionalStat } from '@/common/optional-entity';
import { RootState } from '@/store/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as statAPI from '@/features/stat/stat-API';
import { TAuth } from '../user/types';
import { set401 } from '../user/user-slice';
import {
  Difficulty,
  TParam, TResult, TWord,
} from './types';
import { getUserWord, getUserWordsDifficult, getWords } from './words-thunks';
import { getStatData } from '../stat/stat-thunks';

// Define a type for the slice state
export interface WordsState {
  list: Array<TWord>,
  page: number,
  group: string,
  limit: string,
  count: number,

  status: string | null,
  statusgetword: string,
  currentWord: TWord | null,
  result: TResult[],

  refresh: boolean,

  sprintRightChainCount: number,
  sprintRightChain: number,

  isLearned: boolean,
}

// Define the initial state using that type
const wordsState: WordsState = {
  list: [],
  page: 0,
  group: '',
  limit: '20',
  count: 0,
  status: null,
  statusgetword: '',
  currentWord: null,
  result: [],

  refresh: false,

  sprintRightChainCount: 0,
  sprintRightChain: 0,

  isLearned: false,
};

const wordsSlice = createSlice({
  name: 'words',
  initialState: wordsState,
  extraReducers: (builder) => {
    builder.addCase(getWords.pending, (state) => {
      const local = state;
      local.status = 'loading';
    });
    builder.addCase(getWords.fulfilled, (state, action) => {
      const local = state;
      local.status = 'success';
      local.list = action.payload;
      local.count = 600;
    });
    builder.addCase(getWords.rejected, (state) => {
      const local = state;
      local.status = 'failed';
    });
    builder.addCase(getUserWords.pending, (state) => {
      const local = state;
      local.status = 'loading';
    });
    builder.addCase(getUserWords.fulfilled, (state, action) => {
      const local = state;
      local.status = 'success';
      // @ts-ignore
      local.list = action.payload[0].paginatedResults;
      // @ts-ignore
      local.count = Number(action.payload[0].totalCount[0]) || 600;
      // @ts-ignore
      // local.page = action.payload[0].paginatedResults[0].page;
    });
    builder.addCase(getUserWords.rejected, (state) => {
      const local = state;
      local.status = 'failed';
    });

    builder.addCase(getUserWordsDifficult.pending, (state) => {
      const local = state;
      local.status = 'loading';
    });
    builder.addCase(getUserWordsDifficult.fulfilled, (state, action) => {
      const local = state;
      local.status = 'success';
      // @ts-ignore
      local.list = action.payload[0].paginatedResults;
      // @ts-ignore
      local.count = Number(action.payload[0].totalCount[0]) || 600;
      // @ts-ignore
      // local.page = action.payload[0].paginatedResults[0].page;
    });
    builder.addCase(getUserWordsDifficult.rejected, (state) => {
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
    setResult(state, action) {
      const local = state;
      local.result.push(action.payload);
    },
    clearResult(state, action) {
      const local = state;
      local.result = action.payload;
    },
    toggleRefresh(state, action) {
      const local = state;
      local.refresh = !local.refresh;
    },
    setRightChainArr(state, action) {
      const local = state;

      local.sprintRightChain = local.sprintRightChainCount > local.sprintRightChain
        ? local.sprintRightChainCount : local.sprintRightChain;
      local.sprintRightChainCount = 0;
    },
    setRightChainCount(state, action) {
      const local = state;
      local.sprintRightChainCount += 1;
    },
    resetRightChainCount(state, action) {
      const local = state;
      local.sprintRightChainCount = 0;
      local.sprintRightChain = 0;
    },
    resetStatus(state, action) {
      const local = state;
      local.status = action.payload;
    },
    toggleUpdate(state, action) {
      const local = state;
      local.statusgetword = action.payload;
    },
    toggleIsLearned(state, action) {
      const local = state;
      local.isLearned = action.payload;
    },
  },
});

export const {
  setGroup,
  setPageWords,
  setCurrentWord,
  resetCurrentWord,
  setResult,
  toggleRefresh,
  clearResult,
  setRightChainArr,
  setRightChainCount,
  resetRightChainCount,
  resetStatus,
  toggleUpdate,
  toggleIsLearned,
} = wordsSlice.actions;

export const getUserWords = createAsyncThunk<
number,
Pick<TParam, 'filter' | 'wordsPerPage'>, {
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

    if (resp.status === 401) {
      thunkAPI.dispatch(set401(401));
    }

    const data = await resp.json();
    const statResponse = await statAPI.getStat(thunkAPI.extra);
    const stat = await statResponse.json();

    if (resp.status === 200 && thunkAPI.extra.userId) {
      const learnedCount = data[0].paginatedResults
        .filter((el: TWord) => el.userWord && el.userWord.difficulty === Difficulty.learned);

      let page;
      let group;

      if (data[0].paginatedResults.length === 0) {
        group = JSON.parse(param.filter).$and[2].group;
        page = JSON.parse(param.filter).$and[1].page;
      } else {
        page = data[0].paginatedResults[0].page;
        group = data[0].paginatedResults[0].group;
      }

      if (data[0].paginatedResults.length === learnedCount.length) {
        const optional = getOptionalStat();
        optional.optional = JSON.parse(JSON.stringify(stat.optional));

        const indexPage = optional.optional.pages[group].indexOf(page);

        thunkAPI.dispatch(wordsSlice.actions.toggleIsLearned(true));

        if (indexPage === -1) {
          optional.optional.pages[group].push(page);

          await statAPI.updateStat(optional, thunkAPI.extra);
          thunkAPI.dispatch(getStatData({}));
        }
      }

      if (data[0].paginatedResults.length !== learnedCount.length) {
        const optional = getOptionalStat();
        optional.optional = JSON.parse(JSON.stringify(stat.optional));

        thunkAPI.dispatch(wordsSlice.actions.toggleIsLearned(false));

        const indexPage = optional.optional.pages[group].indexOf(page);
        if (indexPage !== -1) {
          optional.optional.pages[group].splice(indexPage, 1);

          await statAPI.updateStat(optional, thunkAPI.extra);
          thunkAPI.dispatch(getStatData({}));
        }
      }
    }

    return data;
  },
);

export default wordsSlice.reducer;
