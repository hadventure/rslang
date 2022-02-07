import { TWord } from '@/features/words/types';
import cls from './word.module.scss';

type WordProps = {
  item: TWord;
};

export default function Word({ item }: WordProps) {
  return (
    <div>
      <div className={cls.word}>{item.word}</div>
      {' '}
      <div className={cls.translation}>{item.wordTranslate}</div>
    </div>
  );
}
