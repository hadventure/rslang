import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TAuth, TUser } from './types';
import * as userAPI from './user-API';

export const createUser = createAsyncThunk(
  'user/create',
  async (user: TUser, thunkAPI) => {
    const response = await userAPI.createUser(user);

    if (response.status === 200) {
      // Return the known error for future handling
      // return thunkAPI.rejectWithValue((await response.json()) as MyKnownError)
      const data = await response.json();
      return data;
    }

    return thunkAPI.rejectWithValue((await response.text() as string));
  },
);

export const getUser = createAsyncThunk<unknown, Partial<TUser>, { extra: TAuth }>(
  'user/auth',
  async (user: Partial<TUser>, thunkAPI) => {
    const response = await userAPI.getUser(user);

    if (response.status === 200) {
      const data = await response.json();
      thunkAPI.dispatch(userSlice.actions.setToken(data));
    }

    return response.json();
  },
);

// Define a type for the slice state
export interface UserState {
  isAuth: boolean | null,
  user: Partial<TUser>,
  auth: Partial<TAuth>,
  status: string | null,
  responseStatus: number | null,

  msg: string,
}

// Define the initial state using that type
const userState: UserState = {
  isAuth: null,
  user: {},
  auth: {},
  status: null,
  responseStatus: null,
  msg: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState: userState,
  extraReducers: (builder) => {
    builder.addCase(createUser.pending, (state, action) => {
      const local = state;
      local.status = 'loading';
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      const local = state;
      local.status = 'success';

      local.msg = 'Please sign in';
    });
    builder.addCase(createUser.rejected, (state, action) => {
      const local = state;
      local.status = 'failed';

      // TODO: how to type response.text()?
      local.msg = String(action.payload);
    });
  },
  reducers: {
    setToken(state, action) {
      const local = state;
      local.auth = action.payload;
    },
    resetStatus(state, action) {
      const local = state;
      local.responseStatus = action.payload;
    },
    set401(state, action) {
      const local = state;
      local.responseStatus = action.payload;
    },
    checkUserData() {},
    logout() {},
    setUserData(state, action) {
      const local = state;
      local.auth = action.payload;
    },
    setUserIsAuth(state, action) {
      const local = state;
      local.isAuth = action.payload;
    },
  },
});

export const {
  set401, resetStatus, checkUserData, setUserData, setUserIsAuth, logout,
} = userSlice.actions;

export default userSlice.reducer;
