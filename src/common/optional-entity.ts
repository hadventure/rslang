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

export default getOptional;
