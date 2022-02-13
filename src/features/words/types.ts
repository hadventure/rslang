export type TWord = {
  _id: string,
  id: string,
  word: string,
  wordTranslate: string,
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
  right: number
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
};

export type TResult = {
  id: string,
  word: string,
  state: string,
  right: number,
};
