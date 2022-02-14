import Modal from '@/components/modal/modal';
import SprintGame from '@/components/sprint-game/sprint-game';
import SprintTimer from '@/components/sprint-timer/sprint-timer';
import wordsSelector from '@/features/words/words-selector';
import {
  getUserWords, setGroup,
} from '@/features/words/words-slice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useLocation, useSearchParams,
} from 'react-router-dom';

export default function Sprint() {
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(false);
  const [modal, setModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const location = useLocation();
  const words = useSelector(wordsSelector);

  useEffect(() => {
    let param;
    console.log(location);
    if (location.pathname.indexOf('games') > -1) {
      dispatch(setGroup(location.pathname.split('/')[3]));
      param = {
        page: '1',
        filter: JSON.stringify({ $or: [{ 'userWord.difficulty': 'studied' }, { userWord: null }] }),
        group: location.pathname.split('/')[3],
        wordsPerPage: '4',
      };
    } else {
      dispatch(setGroup(location.pathname.split('/')[2]));
      param = {
        page: searchParams.get('page')!,
        filter: JSON.stringify({ $or: [{ 'userWord.difficulty': 'studied' }, { userWord: null }] }),
        group: location.pathname.split('/')[2],
        wordsPerPage: '4',
      };
    }

    dispatch(getUserWords(param));
  }, []);

  const onStart = () => {
    setTimer(true);
  };

  const onFinishTimer = () => {
    setTimer(false);
  };

  if (words.status === 'loading') {
    return <div>loading</div>;
  }

  return (
    <>
      <SprintTimer
        timer={timer}
        onFinishTimer={onFinishTimer}
        showModal={() => setModal(true)}
      />
      {
      timer
        ? <SprintGame list={words.list} />
        : <button type="button" onClick={onStart}>Start</button>
      }

      <Modal title="My Modal" onClose={() => setModal(false)} show={modal}>
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
