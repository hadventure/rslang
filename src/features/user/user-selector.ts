import { RootState } from '@/store/types';

const userSelector = (state: RootState) => state.user;
export default userSelector;
