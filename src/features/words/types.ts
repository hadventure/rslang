export type TWord = {
  audio: string,
  audioExample: string,
  audioMeaning: string,
  group: number,
  image: string,
  page: number,
  textExample: string,
  textExampleTranslate: string,
  textMeaning: string,
  textMeaningTranslate: string,
  transcription: string,
  _id: string,
  id: string,
  word: string,
  wordTranslate: string,
  // userWord: null | TOptional
};

export type TWordSprint = {
  word: TWord,
  variants: TWord[],
};

export enum Difficulty {
  studied = 'studied',
  learned = 'learned',
  difficult = 'difficult',
}

export type TParam = {
  page: string,
  group: string,
  wordsPerPage: string,
  filter: string,
};

export type TGamesAnswer = {
  wrong: number,
  right: number,
  chain: number
};

export type TGames = {
  sprint: TGamesAnswer,
  audiocall: TGamesAnswer,
};

export type TOptional = Partial<{
  difficulty: string,
  optional: Partial<TGames>
}>;

export type TUserAnswer = {
  right: number,
  id: string,
  word?: string,
  game: string,
};

export type TResult = {
  id: string,
  word: string,
  state: string,
  right: number,
};
