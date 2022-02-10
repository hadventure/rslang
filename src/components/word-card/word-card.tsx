import { WordsState } from '@/features/words/words-slice';

type WordCardProps = {
  words: WordsState
};

export default function WordCard({ words }: WordCardProps) {
  // const dispatch = useDispatch();

  if (words.currentWord === null) {
    return <div>No Word selected</div>;
  }

  return (
    <div>
      {words.currentWord?.word}
    </div>
  );
}
