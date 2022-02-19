// https://stackoverflow.com/questions/39256682/how-to-define-an-interface-for-objects-with-dynamic-keys
import { TStat } from '@/features/stat/types';
import { TOptional } from '@/features/words/types';

export const getOptional = (): TOptional => ({
  difficulty: '',
  optional: {
    sprint: {
      right: 0,
      wrong: 0,
      chain: 0,
    },
    audiocall: {
      right: 0,
      wrong: 0,
      chain: 0,
    },
  },
});

export const getFormattedDate = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

export const getOptionalStat = (): TStat => ({
  learnedWords: 0,
  optional: {
    pages: {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    },
    learnedWords: {
      [getFormattedDate()]: 0,
    },
    games: {
      [getFormattedDate()]: {
        sprint: {
          wrong: 0,
          right: 0,
          rightchain: 0,
          newWordCount: 0,
          gamerightchain: 0,
        },
        audiocall: {
          wrong: 0,
          right: 0,
          rightchain: 0,
          newWordCount: 0,
          gamerightchain: 0,
        },
      },
    },
  },

});
