import SprintGame from '@/components/sprint-game/sprint-game';
import { Difficulty } from '@/features/words/types';
import {
  getUserWords, setGroup, setPageWords, WordsState,
} from '@/features/words/words-slice';
import { getWords } from '@/features/words/words-thunks';
import { RefObject, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  useLocation, useSearchParams,
} from 'react-router-dom';
import cls from './sprint.module.scss';

type SprintPreloadProps = {
  onStart: () => void,
  timer: boolean,
  words: WordsState,
  isAuth: boolean | null,
};

export default function SprintPreload({
  onStart, timer, words, isAuth,
}: SprintPreloadProps) {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const location = useLocation();

  function getWords1(page?: number) {
    console.log('--------', page);

    let param;
    if (page) {
      dispatch(setPageWords(page));
    } else {
      dispatch(setPageWords(Number(searchParams.get('page')!)));
    }

    if (location.pathname.indexOf('games') > -1) {
      dispatch(setGroup(location.pathname.split('/')[3]));
      param = {
        filter: JSON.stringify({
          $and: [{
            $or: [
              { 'userWord.difficulty': Difficulty.studied },
              { 'userWord.difficulty': Difficulty.difficult },
              { 'userWord.difficulty': Difficulty.learned },
              { userWord: null }],
          },
          { page: page || Number(searchParams.get('page')!) },
          { group: Number(location.pathname.split('/')[3]) },
          ],
        }),
        wordsPerPage: '20',
      };
    } else {
      dispatch(setGroup(location.pathname.split('/')[2]));
      param = {
        filter: JSON.stringify({
          $and: [{
            $or: [
              { 'userWord.difficulty': Difficulty.studied },
              { 'userWord.difficulty': Difficulty.difficult },
              { userWord: null }],
          },
          { page: page || Number(searchParams.get('page')!) },
          { group: Number(location.pathname.split('/')[2]) },
          ],
        }),
        wordsPerPage: '20',
      };
    }

    dispatch(getUserWords(param));
  }

  function getWordsUnauth(page?: number) {
    let param;
    if (page) {
      dispatch(setPageWords(page));
    } else {
      dispatch(setPageWords(Number(searchParams.get('page')!)));
    }

    if (location.pathname.indexOf('games') > -1) {
      dispatch(setGroup(location.pathname.split('/')[3]));
      param = {
        page: page || Number(searchParams.get('page')!),
        wordsPerPage: '20',
        group: location.pathname.split('/')[3],
      };
    } else {
      dispatch(setGroup(location.pathname.split('/')[2]));
      param = {
        page: page || Number(searchParams.get('page')!),
        wordsPerPage: '20',
        group: location.pathname.split('/')[2],
      };
    }

    dispatch(getWords(param));
  }

  function setStrategyGame(page?: number) {
    console.log('+++++', isAuth);
    if (isAuth) {
      getWords1(page);
    }

    if (isAuth === false) {
      getWordsUnauth(page);
    }
  }

  useEffect(() => {
    if (timer) {
      setStrategyGame();
    }
  }, [timer]);

  if (words.status === 'loading') {
    return <div>loading</div>;
  }

  return (
    <>
      {
      timer
        ? (
          <SprintGame
            list={words.list}
            count={words.count}
            // eslint-disable-next-line react/jsx-no-bind
            setStrategyGame={setStrategyGame}
            page={words.page}
            isAuth={isAuth}
          />
        )
        : <button className={cls.btn} type="button" onClick={onStart}>Start game!</button>
      }
      <span />
    </>
  );
}
