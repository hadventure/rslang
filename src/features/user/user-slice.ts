import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TAuth, TUser } from './types';

export const createUser = createAsyncThunk(
  'user/create',
  async (user: TUser, thunkApi) => {
    const response = await fetch(`${process.env.API_URL}/users`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (response.status === 200) {
      // Return the known error for future handling
      // return thunkApi.rejectWithValue((await response.json()) as MyKnownError)
      console.log(thunkApi);
      const data = await response.json();

      thunkApi.dispatch(userSlice.actions.booksReceived(data));
      return data;
    }

    return response.json();
  },
);

export const authUser = createAsyncThunk(
  'user/auth',
  async (user: Partial<TUser>, thunkApi) => {
    // console.log(thunkApi.extra.token);

    const response = await fetch(`${process.env.API_URL}/signin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (response.status === 200) {
      const data = await response.json();
      console.log(thunkApi);
      // thunkApi.extra = data
      window.location.reload();
      thunkApi.dispatch(userSlice.actions.setToken(data));
      return data;
    }

    return response.json();
  },
);

// Define a type for the slice state
interface UserState {
  user: Partial<TUser>,
  auth: Partial<TAuth>,
  status: string | null,
  responseStatus: number | null,
}

// Define the initial state using that type
const userState: UserState = {
  user: {},
  auth: {},
  status: null,
  responseStatus: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState: userState,
  extraReducers: (builder) => {
    // console.log('-----', builder, getWords);
    builder.addCase(createUser.pending, (state, action) => {
      console.log(state, action);
      const local = state;
      local.status = 'loading';
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      console.log(state, action);

      const local = state;
      local.status = 'success';
    });
    builder.addCase(createUser.rejected, (state, action) => {
      console.log(state, action);

      const local = state;
      local.status = 'failed';
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
      console.log('set401', state, action);
      const local = state;
      local.responseStatus = action.payload;
    },
    booksReceived(state, action) {
      // booksAdapter.setAll(state, action.payload.books)

      console.log(state, action);
    },

  },
});

export const { set401, resetStatus } = userSlice.actions;

export default userSlice.reducer;
