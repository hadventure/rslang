import userSelector from '@/features/user/user-selector';
import wordsSelector from '@/features/words/words-selector';
import {
  getUserWords, resetCurrentWord, resetStatus, setPageWords,
} from '@/features/words/words-slice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import levelsSelector from '@/features/levels/levels-selector';
import { Difficulty } from '@/features/words/types';
import { getWords } from '@/features/words/words-thunks';
import Pagination from '../pagination/pagination';
import WordCard from '../word-card/word-card';
import Word from '../word/word';
import cls from './word-list.module.scss';
import sprint from '../../assets/ILLUSTRATION_OFFICE_13.svg';
import audiocall from '../../assets/ILLUSTRATION_OFFICE_08.svg';
import MsgBlock from '../msg-block/msg-block';

type WordListProps = {
  pages: { [key: string]: number[] } | undefined,
};

export default function WordList({ pages }: WordListProps) {
  const dispatch = useDispatch();
  const words = useSelector(wordsSelector);
  const user = useSelector(userSelector);
  const levels = useSelector(levelsSelector);
  const location = useLocation();
  let isLearned;

  if (words.status === 'success' && pages) {
    isLearned = pages[words.list[0].group].includes(words.list[0].page)
  }

  useEffect(() => {
    if (user.isAuth === true && words.group) {
      dispatch(getUserWords({
        filter: JSON.stringify({
          $and: [{
            $or: [
              { 'userWord.difficulty': Difficulty.studied },
              { 'userWord.difficulty': Difficulty.difficult },
              { 'userWord.difficulty': Difficulty.learned },
              { userWord: null }],
          },
          { page: words.page },
          { group: Number(words.group) },
          ],
        }),
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

  useEffect(() => {
    if (user.isAuth === true && words.group) {
      dispatch(getUserWords({
        filter: JSON.stringify({
          $and: [{
            $or: [
              { 'userWord.difficulty': Difficulty.studied },
              { 'userWord.difficulty': Difficulty.difficult },
              { 'userWord.difficulty': Difficulty.learned },
              { userWord: null }],
          },
          { page: 0 },
          { group: Number(words.group) },
          ],
        }),
        wordsPerPage: '20',
      }));
    }

    if (user.isAuth === false && words.group) {
      dispatch(getWords({
        page: 0,
        group: words.group,
        wordsPerPage: '20',
      }));
    }
  }, []);

  if (words.list.length === 0 && words.status === 'loading') {
    return <div>Loading</div>;
  }

  if (words.list.length === 0 && words.status === '') {
    return <div>No Items</div>;
  }

  const onChangePage = (page: number) => {
    dispatch(resetCurrentWord({}));
    dispatch(setPageWords(page));
  };

  return (
    <>
      {
      isLearned
      && <MsgBlock text="Learned" />
      }

      <div className={cls.wordsContainer}>
        <div className={cls.wordCardContainer}>

          <WordCard
            words={words}
            isAuthenticated={user.isAuth}
          />
        </div>

        <div className={cls.wordListContainer}>
          <Pagination
            page={+words.page}
            pageCount={Math.floor(words.count / +words.limit)}
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
            currentWordID={words.currentWord?._id || words.currentWord?.id}
            isAuthenticated={user.isAuth}
          />
        ))
      }

          </div>

          <div className={cls.navGames}>
            {
              isLearned
                ? <img className={isLearned ? `${cls.gameImg} ${cls.gameImgLearned}` : cls.gameImg} src={audiocall} alt="" />
                : (
                  <NavLink
                    to={`${location.pathname}/audiocall?page=${Number(words.page)}`}
                    onClick={() => dispatch(resetStatus(''))}
                  >
                    <img className={isLearned ? `${cls.gameImg} ${cls.gameImgLearned}` : cls.gameImg} src={audiocall} alt="" />
                  </NavLink>
                )
            }

            {
              isLearned
                ? <img className={isLearned ? `${cls.gameImg} ${cls.gameImgLearned}` : cls.gameImg} src={sprint} alt="" />

                : (
                  <NavLink
                    to={`${location.pathname}/sprint?page=${Number(words.page)}`}
                    onClick={() => dispatch(resetStatus(''))}
                  >
                    <img className={isLearned ? `${cls.gameImg} ${cls.gameImgLearned}` : cls.gameImg} src={sprint} alt="" />
                  </NavLink>
                )
            }
          </div>
        </div>

      </div>
    </>

  );
}
