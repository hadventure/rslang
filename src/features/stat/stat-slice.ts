import { createSlice } from '@reduxjs/toolkit';
import { getStat } from './stat-thunks';
import { TAuth, TUser } from './types';

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
      const local = state;
      local.status = 'loading';
    });
    builder.addCase(getStat.fulfilled, (state, action) => {
      console.log(state, action);

      const local = state;
      local.status = 'success';
    });
    builder.addCase(getStat.rejected, (state, action) => {
      const local = state;
      local.status = 'failed';
    });
  },
  reducers: {},
});

export default statSlice.reducer;
