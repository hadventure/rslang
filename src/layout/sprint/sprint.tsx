import Modal from '@/components/modal/modal';
import SprintTimer from '@/components/sprint-timer/sprint-timer';
import userSelector from '@/features/user/user-selector';
import wordsSelector from '@/features/words/words-selector';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import SprintPreload from './sprint-preload';
import cls from './sprint.module.scss';

export default function Sprint() {
  const [timer, setTimer] = useState(false);
  const [modal, setModal] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  const yes = useRef<HTMLButtonElement>(null);
  const no = useRef<HTMLButtonElement>(null);

  const words = useSelector(wordsSelector);
  const user = useSelector(userSelector);

  const onStart = () => {
    setTimer(true);
  };

  const onFinishTimer = () => {
    setTimer(false);
    setModal(true);
  };

  const onPlayAgain = () => {
    setModal(false);
  };

  const setYesFocus = () => {
    if (yes.current) {
      yes.current.focus();
    }
  };

  return (
    <>
      <div ref={wrap} className={cls.initView} onClick={setYesFocus}>
        {
      timer && (
      <SprintTimer
        timer={timer}
        onFinishTimer={onFinishTimer}
        showModal={() => setModal(true)}
      />
      )
      }

        <SprintPreload
          yes={yes}
          no={no}
          onStart={onStart}
          timer={timer}
          words={words}
          isAuth={user.isAuth}
        />
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
              {el.right}
              {' '}
              {el.state}
            </p>
          ))
        }
      </Modal>
    </>
  );
}
