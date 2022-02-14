import { TWord } from '@/features/words/types';
import { setCurrentWord } from '@/features/words/words-slice';
import { useDispatch } from 'react-redux';
import cls from './word.module.scss';

type WordProps = {
  item: TWord;
  index: number;
};

export default function Word({ item, index }: WordProps) {
  const dispatch = useDispatch();

  const onSelectWord = () => {
    console.log(item, index);
    dispatch(setCurrentWord(index));
  }

  return (
    <div className={cls.word1} onClick={onSelectWord}>
      <div className={cls.word}>{item.word}</div>
      {' '}
      {/* <div className={cls.translation}>{item.wordTranslate}</div> */}
    </div>
  );
}
