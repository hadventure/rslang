import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userSlice, { set401 } from '../user/user-slice';
import { TAuth, TUser } from './types';

export const getStat = createAsyncThunk<
// Return type of the payload creator
null,
// First argument to the payload creator
unknown,
{
  // Optional fields for defining thunkApi field types
  extra: TAuth
}
>(
  'user/stat',
  async (_, thunkApi) => {
    console.log(thunkApi);

    const response = await fetch(`${process.env.API_URL}/users/${thunkApi.extra.userId}/words`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${thunkApi.extra.token}`,
      },
    });

    

    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      // thunkApi.dispatch(userSlice.actions.setToken(data));
      return data;
    }

    if (response.status === 401) {
      console.log(response);
      thunkApi.dispatch(set401(401));
      // const data = await response.json();
      // console.log(data);
      // useNavigate()(`/invoices/`)
      // return data;
    }

    return response.json();
  },
);

// /users/{id}/words

// Define a type for the slice state
interface UserState {
  user: Partial<TUser>,
  auth: Partial<TAuth>,
  status: string | null
}

// Define the initial state using that type
const userState: UserState = {
  user: {},
  auth: {},
  status: null,
};

const statSlice = createSlice({
  name: 'stat',
  initialState: userState,
  extraReducers: (builder) => {
    // console.log('-----', builder, getWords);
    builder.addCase(getStat.pending, (state, action) => {
      console.log(state, action);
      const local = state;
      local.status = 'loading';
    });
    builder.addCase(getStat.fulfilled, (state, action) => {
      console.log(state, action);

      const local = state;
      local.status = 'success';
    });
    builder.addCase(getStat.rejected, (state, action) => {
      console.log(state, action);

      const local = state;
      local.status = 'failed';
    });
  },
  reducers: {},
});

export default statSlice.reducer;
