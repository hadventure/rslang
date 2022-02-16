import userSelector from '@/features/user/user-selector';
import wordsSelector from '@/features/words/words-selector';
import {
  getUserWords, getWords, resetCurrentWord, setPageWords,
} from '@/features/words/words-slice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import levelsSelector from '@/features/levels/levels-selector';
import { TWord } from '@/features/words/types';
import Pagination from '../pagination/pagination';
import WordCard from '../word-card/word-card';
import Word from '../word/word';
import cls from './word-list.module.scss';
import sprint from '../../assets/ILLUSTRATION_OFFICE_13.svg';
import audiocall from '../../assets/ILLUSTRATION_OFFICE_08.svg';

export default function WordList() {
  const dispatch = useDispatch();
  const words = useSelector(wordsSelector);
  const user = useSelector(userSelector);
  const levels = useSelector(levelsSelector);
  const location = useLocation();

  console.log(location);

  // let match = useMatch(location);

  useEffect(() => {
    console.log(words.refresh);

    if (user.isAuth === true && words.group) {
      dispatch(getUserWords({
        page: words.page,
        group: words.group,
        wordsPerPage: '20',
      }));
    }

    if (user.isAuth === false && words.group) {
      dispatch(getWords({
        page: words.page,
        group: words.group,
        wordsPerPage: '20',
      }));
    }
  }, [words.group, words.page, words.refresh]);

  // if (words.status === 'loading') {
  //   return <div>Loading</div>;
  // }

  if (words.list.length === 0) {
    return <div>No Items</div>;
  }

  const onChangePage = (page: number) => {
    dispatch(resetCurrentWord({}));
    dispatch(setPageWords(page));
  };

  return (
    <div className={cls.wordsContainer}>
      <div className={cls.wordCardContainer}>

        <WordCard words={words} />
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
        words.list.map((item, i) => (
          <Word
            key={item.id || item._id}
            index={i}
            item={item}
            color={levels.list[item.group].clsName}
            currentWordID={words.currentWord?._id}
          />
        ))
      }

        </div>

        <div className={cls.navGames}>
          <NavLink to={`${location.pathname}/audiocall?page=${words.page}`}>
            <img className={cls.gameImg} src={audiocall} alt="" />
          </NavLink>
          <NavLink to={`${location.pathname}/sprint?page=${words.page}`}>
            <img className={cls.gameImg} src={sprint} alt="" />
          </NavLink>
        </div>
      </div>

    </div>
  );
}
