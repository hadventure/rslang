import * as http from '@/common/http';
import { TAuth } from '../user/types';
import { TOptional, TParam, TUserAnswer } from './types';

export const getUserWord = (param: TUserAnswer, extra: TAuth) => {
  const url = `/users/${extra.userId}/words/${param.id}`;
  return http.get(url, {}, extra.token);
};

export const createUserWord = (param: TUserAnswer | Partial<{
  id: string,
  userWord: TOptional | undefined,
  type: string,
}>, body: TOptional, extra: TAuth) => {
  const url = `/users/${extra.userId}/words/${param.id}`;
  return http.post<TOptional>(url, body, extra.token);
};

export const updateUserWord = (param: TUserAnswer, body: TOptional, extra: TAuth) => {
  const url = `/users/${extra.userId}/words/${param.id}`;
  return http.put<TOptional>(url, body, extra.token);
};

export const addWordToDifficult = (param: Partial<{
  id: string,
  userWord: TOptional | undefined,
  type: string,
}>, body: TOptional, extra: TAuth) => {
  const url = `/users/${extra.userId}/words/${param.id}`;
  return http.put<TOptional>(url, body, extra.token);
};

export const getWordList = (param: Pick<TParam, 'group' | 'page' | 'wordsPerPage'>) => {
  const x = {
    page: '',
    wordsPerPage: '',
    group: '',
  };

  x.page = String(param.page);
  x.wordsPerPage = param.wordsPerPage;
  x.group = param.group;

  const url = `/words?${new URLSearchParams(x).toString()}`;
  return http.get(url);
};
