import Modal from '@/components/modal/modal';
import SprintGame from '@/components/sprint-game/sprint-game';
import SprintTimer from '@/components/sprint-timer/sprint-timer';
import { Difficulty } from '@/features/words/types';
import wordsSelector from '@/features/words/words-selector';
import {
  getUserWords, setGroup,
} from '@/features/words/words-slice';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useLocation, useSearchParams,
} from 'react-router-dom';
import cls from './sprint.module.scss';

export default function Sprint() {
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(false);
  const [modal, setModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const wrap = useRef<HTMLDivElement>(null);

  const yes = useRef<HTMLButtonElement>(null);
  const no = useRef<HTMLButtonElement>(null);

  const location = useLocation();
  const words = useSelector(wordsSelector);

  useEffect(() => {
    if (wrap.current) {
      wrap.current.onclick = function () {
        yes.current?.focus();
      };
    }

    getWords();
  }, []);

  function getWords() {
    let param;
    console.log(location);

    if (location.pathname.indexOf('games') > -1) {
      dispatch(setGroup(location.pathname.split('/')[3]));
      param = {
        page: '1',
        filter: JSON.stringify({ $or: [{ 'userWord.difficulty': Difficulty.studied }, { 'userWord.difficulty': Difficulty.difficult }, { userWord: null }] }),
        group: location.pathname.split('/')[3],
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
          { page: Number(searchParams.get('page')!) },
          { group: Number(location.pathname.split('/')[2]) },
          ],
        }),
        wordsPerPage: '20',
      };
    }

    dispatch(getUserWords(param));
  }

  const onStart = () => {
    setTimer(true);
  };

  const onFinishTimer = () => {
    setTimer(false);
  };

  const onPlayAgain = () => {
    setTimer(true);
    setModal(false);
    getWords();
  };

  if (words.status === 'loading') {
    return <div>loading</div>;
  }

  return (
    <>
      <div ref={wrap} className={cls.initView}>
        {
      timer && (
      <SprintTimer
        timer={timer}
        onFinishTimer={onFinishTimer}
        showModal={() => setModal(true)}
      />
      )
      }

        {
      timer
        ? (
          <SprintGame
            list={words.list}
            yes={yes}
            no={no}
            count={words.count}
          />
        )
        : <button className={cls.btn} type="button" onClick={onStart}>Start game!</button>
      }
      </div>

      <Modal
        title="My Modal"
        onClose={() => setModal(false)}
        show={modal}
        onPlayAgain={onPlayAgain}
      >
        {
          words.result.map((el) => (
            <p key={el.id}>
              {el.word}
              {' '}
              {el.state}
            </p>
          ))
        }
      </Modal>
    </>
  );
}
