/* eslint-disable import/prefer-default-export */
import * as http from '@/common/http';
import { TAuth } from '../user/types';
import { TStat } from './types';

export const getStat = (extra: TAuth) => {
  const url = `/users/${extra.userId}/statistics`;
  return http.get(url, undefined, extra.token);
};

export const updateStat = (param: TStat, extra: TAuth) => {
  console.log('----')
  const url = `/users/${extra.userId}/statistics`;
  return http.put(url, param, extra.token);
};
