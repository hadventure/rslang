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
  useLocation,
} from 'react-router-dom';

export default function Sprint() {
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(false);
  const [modal, setModal] = useState(false);
  const location = useLocation();
  const words = useSelector(wordsSelector);

  useEffect(() => {
    dispatch(setGroup(location.pathname.split('/')[2]));
    console.log(location.pathname.split('/')[2])
    const param = {
      page: words.page,
      // filter: JSON.stringify({ $or: [{ 'userWord.difficulty': 'easy' }, { userWord: null }] }),
      filter: JSON.stringify({ $or: [{ 'userWord.difficulty': 'studied' }, { userWord: null }] }),
      group: location.pathname.split('/')[2],
      wordsPerPage: '4',
    };

    dispatch(getUserWords(param));
  }, []);

  const onStart = () => {
    setTimer(true);
  };

  const onFinishTimer = () => {
    setTimer(false);
  };

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
        <p>This is modal body</p>
      </Modal>

    </>
  );
}
