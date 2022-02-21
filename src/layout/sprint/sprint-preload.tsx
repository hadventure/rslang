/* eslint-disable no-lonely-if */
import { TEMP_PAGINATION_LENGTH } from '@/common/constants';
import { getRandomInt } from '@/common/helper';
import MsgBlock from '@/components/msg-block/msg-block';
import SprintGame from '@/components/sprint-game/sprint-game';
import statSelector from '@/features/stat/stat-selector';
import { Difficulty, UpdateWord } from '@/features/words/types';
import {
  getUserWords, setGroup, setPageWords, toggleUpdate, WordsState,
} from '@/features/words/words-slice';
import { getWords } from '@/features/words/words-thunks';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useLocation, useSearchParams,
} from 'react-router-dom';
import cls from './sprint.module.scss';

type SprintPreloadProps = {
  onStart: () => void,
  timer: boolean,
  words: WordsState,
  isAuth: boolean | null,
  setIsFinish: () => void,
  isFinish: boolean,
};

export default function SprintPreload({
  onStart, timer, words, isAuth, setIsFinish, isFinish,
}: SprintPreloadProps) {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const stat = useSelector(statSelector);
  const location = useLocation();

  const calculateP = (page: number) => {
    let learned: number[];
    let possiblePages;

    if (location.pathname.indexOf('games') === -1) {
      learned = isAuth ? stat.stat!.optional!.pages[words.list[0]?.group || words.group] : [];
    } else {
      learned = [];
    }

    if (location.pathname.indexOf('games') === -1) {
      possiblePages = new Array(TEMP_PAGINATION_LENGTH + 1)
        .fill(1)
        .map((el, i) => i)
        .filter((el) => learned.indexOf(el) === -1);
    } else {
      possiblePages = new Array(TEMP_PAGINATION_LENGTH + 1).fill(1).map((a, i) => i);
    }

    let newPage;

    const index = possiblePages.indexOf(page);
    if (index !== possiblePages.length - 1 && location.pathname.indexOf('games') === -1) {
      possiblePages.splice(index, 1);

      newPage = possiblePages[index];
    } else {
      if (page === TEMP_PAGINATION_LENGTH) {
        newPage = 0;
      } else {
        newPage = page + 1;
      }
    }

    return newPage;
  };

  function getWords1(page?: number) {
    let param;
    let newPage;

    // for init page
    let temp;

    if (page !== undefined) {
      newPage = calculateP(page);
      dispatch(setPageWords(newPage));
    } else {
      temp = getRandomInt(0, TEMP_PAGINATION_LENGTH);
      if (location.pathname.indexOf('games') > -1) {
        dispatch(setPageWords(temp));
      } else {
        dispatch(setPageWords(Number(searchParams.get('page')!)));
      }
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
          { page: newPage !== undefined ? newPage : temp },
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
          { page: newPage !== undefined ? newPage : Number(searchParams.get('page')!) },
          { group: Number(location.pathname.split('/')[2]) },
          ],
        }),
        wordsPerPage: '20',
      };

      if (stat.stat?.optional?.pages[0].length === 30 && location.pathname.indexOf('games') === -1) {
        setIsFinish();
      }
    }

    dispatch(getUserWords(param));
  }

  function getWordsUnauth(page?: number) {
    let param;
    let newPage;

    // for init page
    let temp: number;

    if (typeof page === 'number') {
      newPage = calculateP(page);
      dispatch(setPageWords(newPage));
    } else {
      temp = getRandomInt(0, TEMP_PAGINATION_LENGTH);
      if (location.pathname.indexOf('games') > -1) {
        dispatch(setPageWords(temp));
      } else {
        dispatch(setPageWords(Number(searchParams.get('page')!)));
      }
    }

    if (location.pathname.indexOf('games') > -1) {
      dispatch(setGroup(location.pathname.split('/')[3]));
      param = {
        // @ts-ignore
        page: newPage !== undefined ? newPage : temp,
        wordsPerPage: '20',
        group: location.pathname.split('/')[3],
      };
    } else {
      dispatch(setGroup(location.pathname.split('/')[2]));
      param = {
        page: newPage !== undefined ? newPage : Number(searchParams.get('page')!),
        wordsPerPage: '20',
        group: location.pathname.split('/')[2],
      };
    }

    dispatch(getWords(param));
  }

  function setStrategyGame(page?: number) {
    if (isAuth) {
      getWords1(page);
    }

    if (isAuth === false) {
      getWordsUnauth(page);
    }
  }

  useEffect(() => {
    if (words.status === 'success') {
      onStart();
    }
  }, [words.status]);

  const onStartGame = () => {
    dispatch(toggleUpdate(UpdateWord.updated));
    setStrategyGame();
  };

  useEffect(() => {
    if (stat.stat?.optional?.pages[0].length === 30 && location.pathname.indexOf('games') === -1) {
      setIsFinish();
    }
  }, [stat.stat]);

  if (isFinish && location.pathname.indexOf('games') === -1) {
    return <MsgBlock text="Слова для игры закончились" />;
  }

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
            count={words.list.length}
            // eslint-disable-next-line react/jsx-no-bind
            setStrategyGame={setStrategyGame}
            page={words.page}
            isAuth={isAuth}
            words={words}
          />
        )
        : <button className={cls.btn} type="button" onClick={onStartGame}>Start game!</button>
      }
      <span />
    </>
  );
}
