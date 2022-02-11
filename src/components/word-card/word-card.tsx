import { WordsState } from '@/features/words/words-slice';
import cls from './word-card.module.scss';

type WordCardProps = {
  words: WordsState
};

export default function WordCard({ words }: WordCardProps) {
  // const dispatch = useDispatch();

  if (words.currentWord === null) {
    return <div className={cls.wordCardContainer}>No Word selected</div>;
  }

  return (
    <div className={cls.wordCardContainer}>
      {words.currentWord?.word}
    </div>
  );
}
