import * as http from '@/common/http';
import { TUser } from './types';

export const getUser = (param: Partial<TUser>) => {
  const url = '/signin';
  return http.post(url, param);
};

export const createUser = (param: Partial<TUser>) => {
  const url = '/users';
  return http.post(url, param);
};
