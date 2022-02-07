import wordsSelector from '@/features/words/words-selector';
import { getWords } from '@/features/words/words-slice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Word from '../word/word';

export default function WordList() {
  const dispatch = useDispatch();
  const words = useSelector(wordsSelector);

  useEffect(() => {
    dispatch(getWords(1));
  }, [dispatch]);

  if (words.status === 'loading') {
    return <div>Loading</div>;
  }

  if (words.list.length === 0) {
    return <div>No Items</div>;
  }

  return (
    <div>
      {
        words.list.map((item) => <Word key={item.id} item={item} />)
      }
    </div>
  );
}
