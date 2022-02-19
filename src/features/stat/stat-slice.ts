import { createSlice } from '@reduxjs/toolkit';
import { getStat, getStatData } from './stat-thunks';
import { TAuth, TStat, TUser } from './types';

// Define a type for the slice state
interface UserState {
  stat: Partial<TStat> | null,
  user: Partial<TUser>,
  auth: Partial<TAuth>,
  status: string | null
}

// Define the initial state using that type
const userState: UserState = {
  user: {},
  auth: {},
  status: null,
  stat: null,
};
// getStatData
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
      const local = state;
      local.status = 'success';
    });
    builder.addCase(getStat.rejected, (state, action) => {
      const local = state;
      local.status = 'failed';
    });
    builder.addCase(getStatData.pending, (state, action) => {});
    builder.addCase(getStatData.fulfilled, (state, action) => {
      const local = state;
      local.stat = action.payload;
    });
    builder.addCase(getStatData.rejected, (state, action) => {});
  },
  reducers: {},
});

export default statSlice.reducer;
