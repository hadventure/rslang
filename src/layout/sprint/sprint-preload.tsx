import SprintGame from '@/components/sprint-game/sprint-game';
import { Difficulty } from '@/features/words/types';
import {
  getUserWords, getWords, setGroup, setPageWords, WordsState,
} from '@/features/words/words-slice';
import { RefObject, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  useLocation, useSearchParams,
} from 'react-router-dom';
import cls from './sprint.module.scss';

type SprintPreloadProps = {
  onStart: () => void,
  timer: boolean,
  yes: RefObject<HTMLButtonElement>,
  no: RefObject<HTMLButtonElement> | null,
  words: WordsState,
  isAuth: boolean | null,
};

export default function SprintPreload({
  onStart, timer, yes, no, words, isAuth,
}: SprintPreloadProps) {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const location = useLocation();

  function getWords1(page?: number) {
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

  function setStrategyGame() {
    if (isAuth) {
      console.log('------');
      getWords1();
    }

    if (isAuth === false) {
      dispatch(getWords({
        page: '1',
      }));
    }
  }

  useEffect(() => {
    setStrategyGame();
  }, []);

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
            yes={yes}
            no={no}
            count={words.count}
            // eslint-disable-next-line react/jsx-no-bind
            getWords={setStrategyGame}
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
