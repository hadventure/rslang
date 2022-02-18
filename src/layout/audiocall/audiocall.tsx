import AudiocallGame from '@/components/audiocall-game/audiocall-game';
import Modal from '@/components/modal/modal';
import { Difficulty } from '@/features/words/types';
import wordsSelector from '@/features/words/words-selector';
import {
  getUserWords, setGroup,
} from '@/features/words/words-slice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useLocation, useSearchParams,
} from 'react-router-dom';
import cls from './audiocall.module.scss';

export default function Audiocall() {
  const dispatch = useDispatch();
  const [isStart, setStart] = useState(false);
  const [modal, setModal] = useState(false);
  const [searchParams] = useSearchParams();

  const location = useLocation();
  const words = useSelector(wordsSelector);

  useEffect(() => {
    getWords();
  }, []);

  function getWords(page?: number) {
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

  const onStart = () => {
    setStart(true);
  };

  const onPlayAgain = () => {
    setStart(true);
    setModal(false);
    getWords();
  };

  const onFinishGame = () => {
    setModal(true);
    setStart(false);
  };

  if (words.status === 'loading') {
    return <div>loading</div>;
  }

  console.log('---', words.list);

  return (
    <div className={cls.initView}>
      {
      isStart
        ? <AudiocallGame list={words.list} onFinishGame={onFinishGame} />
        : <button className={cls.btn} type="button" onClick={onStart}>Start game!</button>
      }

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

    </div>
  );
}
