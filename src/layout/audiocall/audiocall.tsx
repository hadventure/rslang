import AudiocallGame from '@/components/audiocall-game/audiocall-game';
import Modal from '@/components/modal/modal';
import wordsSelector from '@/features/words/words-selector';
import {
  getUserWords, setGroup,
} from '@/features/words/words-slice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useLocation, useSearchParams,
} from 'react-router-dom';

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

  function getWords() {
    let param;

    if (location.pathname.indexOf('games') > -1) {
      dispatch(setGroup(location.pathname.split('/')[3]));
      param = {
        page: '1',
        filter: JSON.stringify({ $or: [{ 'userWord.difficulty': 'studied' }, { userWord: null }] }),
        group: location.pathname.split('/')[3],
        wordsPerPage: '20',
      };
    } else {
      dispatch(setGroup(location.pathname.split('/')[2]));
      param = {
        page: searchParams.get('page')!,
        filter: JSON.stringify({ $or: [{ 'userWord.difficulty': 'studied' }, { userWord: null }] }),
        group: location.pathname.split('/')[2],
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
    <>
      {
      isStart
        ? <AudiocallGame list={words.list} onFinishGame={onFinishGame} />
        : <button type="button" onClick={onStart}>Start</button>
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

    </>
  );
}
