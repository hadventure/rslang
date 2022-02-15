import { RootState } from '@/store/types';

const wordsSelector = (state: RootState) => state.words;
export default wordsSelector;
