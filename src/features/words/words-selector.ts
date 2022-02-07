import { RootState } from '@/store/store';

const wordsSelector = (state: RootState) => state.words;
export default wordsSelector;
