import userSelector from '@/features/user/user-selector';
import wordsSelector from '@/features/words/words-selector';
import { getUserWords, getWords, setPageWords } from '@/features/words/words-slice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../pagination/pagination';
import WordCard from '../word-card/word-card';
import Word from '../word/word';
import cls from './word-list.module.scss';

export default function WordList() {
  const dispatch = useDispatch();
  const words = useSelector(wordsSelector);
  const user = useSelector(userSelector);

  useEffect(() => {
    if (user.isAuth === true && words.group) {
      dispatch(getUserWords(1));
    }

    if (user.isAuth === false && words.group) {
      dispatch(getWords(1));
    }
  }, [words.group, words.page]);

  // if (words.status === 'loading') {
  //   return <div>Loading</div>;
  // }

  if (words.list.length === 0) {
    return <div>No Items</div>;
  }

  const onChangePage = (page: number) => {
    dispatch(setPageWords(page));
  };

  return (
    <div className={cls.wordsContainer}>
      <div className={cls.wordCardContainer}>
        <WordCard />
      </div>
      <div className={cls.wordListContainer}>
        <Pagination
          page={+words.page}
          pageCount={Math.floor(words.count / +words.limit) - 1}
          size={5}
          onChangePage={onChangePage}
        />

        <div className={cls.wordListContainer1}>
          {
        words.list.map((item) => <Word key={item.id || item._id} item={item} />)
      }

        </div>

      </div>

    </div>
  );
}
