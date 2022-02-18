export type TUser = {
  name: string,
  email: string,
  password: string,
};

export type TAuth = {
  message: string,
  name: string,
  refreshToken: string
  token: string
  userId: string
};

export type TStatGameItem = {
  wrong: number,
  right: number,
  rightchain: number,
  newWordCount: number,
};

export type TStatGame = {
  [key: string]: {
    audiocall: TStatGameItem,
    sprint: TStatGameItem,
    [key: string]: TStatGameItem,
  }
};

export type TStat = {
  learnedWords: 0,
  optional: {
    learnedWords: {
      [key: string]: number
    },
    pages: {
      learned: number[]
    },
    games: TStatGame
  }
};
