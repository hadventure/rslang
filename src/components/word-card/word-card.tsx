import userSelector from '@/features/user/user-selector';
import wordsSelector from '@/features/words/words-selector';
import { getUserWords, getWords } from '@/features/words/words-slice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Word from '../word/word';
import cls from './word-card.module.scss';

export default function WordCard() {
  const dispatch = useDispatch();
  // const words = useSelector(wordsSelector);
  // const user = useSelector(userSelector);

  // useEffect(() => {
  //   if (user.isAuth === true && words.group) {
  //     dispatch(getUserWords(1));
  //   }

  //   if (user.isAuth === false && words.group) {
  //     dispatch(getWords(1));
  //   }
  // }, [words.group]);

  // if (words.status === 'loading') {
  //   return <div>Loading</div>;
  // }

  // if (words.list.length === 0) {
  //   return <div>No Items</div>;
  // }

  return (
    <div>
      
    </div>
  );
}
