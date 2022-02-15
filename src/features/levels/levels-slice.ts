import { createSlice } from '@reduxjs/toolkit';
import { TLevel } from './types';

export interface ILevelsState {
  list: TLevel[],
}

const levelsState: ILevelsState = {
  list: [
    { id: '0', name: 'Part I', clsName: 'p1' },
    { id: '1', name: 'Part II', clsName: 'p2' },
    { id: '2', name: 'Part III', clsName: 'p3' },
    { id: '3', name: 'Part IV', clsName: 'p4' },
    { id: '4', name: 'Part V', clsName: 'p5' },
    { id: '5', name: 'Part VI', clsName: 'p6' },
  ],
};

const levelsSlice = createSlice({
  name: 'levels',
  initialState: levelsState,
  reducers: {},
});

export default levelsSlice.reducer;
