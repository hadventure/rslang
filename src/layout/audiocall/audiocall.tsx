import AudiocallGame from '@/components/audiocall-game/audiocall-game';
import GameResult from '@/components/game-result/game-result';
import Modal from '@/components/modal/modal';
import { getStat } from '@/features/stat/stat-thunks';
import { UserState } from '@/features/user/user-slice';
import { Difficulty } from '@/features/words/types';
import wordsSelector from '@/features/words/words-selector';
import {
  getUserWords, setGroup, clearResult, setPageWords, setRightChainArr, resetRightChainCount,
} from '@/features/words/words-slice';
import { getWords } from '@/features/words/words-thunks';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useLocation, useSearchParams,
} from 'react-router-dom';
import cls from './audiocall.module.scss';

type AudiocallProps = {
  user: UserState;
};

export default function Audiocall({ user }: AudiocallProps) {
  const dispatch = useDispatch();
  const [isStart, setStart] = useState(false);
  const [modal, setModal] = useState(false);
  const [searchParams] = useSearchParams();

  const location = useLocation();
  const words = useSelector(wordsSelector);

  function getWordsAuth(page?: number) {
    let param;

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

  function getWordsUnauth() {
    let param;

    if (location.pathname.indexOf('games') > -1) {
      dispatch(setGroup(location.pathname.split('/')[3]));
      dispatch(setPageWords(words.page));

      param = {
        page: words.page,
        wordsPerPage: '20',
        group: location.pathname.split('/')[3],
      };
    } else {
      dispatch(setGroup(location.pathname.split('/')[2]));
      dispatch(setPageWords(Number(searchParams.get('page')!)));

      param = {
        page: Number(searchParams.get('page')!),
        wordsPerPage: '20',
        group: location.pathname.split('/')[2],
      };
    }

    dispatch(getWords(param));
  }

  useEffect(() => {
    if (user.isAuth) {
      getWordsAuth();
    }

    if (user.isAuth === false) {
      getWordsUnauth();
    }
  }, []);

  const onStart = () => {
    setStart(true);
  };

  const onPlayAgain = () => {
    setStart(true);
    setModal(false);
    getWordsAuth();
  };

  const onFinishGame = () => {
    setModal(true);
    setStart(false);

    if (user.isAuth) {
      dispatch(setRightChainArr({}));
      dispatch(getStat(0));
    }
  };

  const onClose = () => {
    setModal(false);
    dispatch(clearResult([]));
    dispatch(resetRightChainCount(null));
  };

  if (words.status === 'loading') {
    return <div>loading</div>;
  }

  return (
    <div className={cls.initView}>
      {
      isStart
        ? (
          <AudiocallGame
            list={words.list}
            onFinishGame={onFinishGame}
            count={words.list.length}
            isAuth={user.isAuth}
          />
        )
        : (
          <button
            className={cls.btn}
            type="button"
            onClick={onStart}
          >
            Start game!
          </button>
        )
      }

      <Modal
        title="Result"
        onClose={onClose}
        show={modal}
        onPlayAgain={onPlayAgain}
      >
        <GameResult result={words.result} />
      </Modal>

    </div>
  );
}
