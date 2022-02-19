import GameResult from '@/components/game-result/game-result';
import Modal from '@/components/modal/modal';
import SprintTimer from '@/components/sprint-timer/sprint-timer';
import { getStat } from '@/features/stat/stat-thunks';
import userSelector from '@/features/user/user-selector';
import wordsSelector from '@/features/words/words-selector';
import {
  clearResult, resetRightChainCount, setRightChainArr,
} from '@/features/words/words-slice';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SprintPreload from './sprint-preload';
import cls from './sprint.module.scss';

export default function Sprint() {
  const dispatch = useDispatch();

  const [timer, setTimer] = useState(false);
  const [modal, setModal] = useState(false);

  const words = useSelector(wordsSelector);
  const user = useSelector(userSelector);

  const onStart = () => {
    setTimer(true);
  };

  const onFinishTimer = () => {
    setTimer(false);
    setModal(true);

    dispatch(setRightChainArr({}));
    dispatch(getStat(words.sprintRightChain));
  };

  const onPlayAgain = () => {
    setModal(false);
  };

  const onCloseModal = () => {
    setModal(false);
    dispatch(clearResult([]));
    dispatch(resetRightChainCount({}));
  };

  return (
    <>
      <div className={cls.initView}>
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
          onStart={onStart}
          timer={timer}
          words={words}
          isAuth={user.isAuth}
        />
      </div>

      <Modal
        title="Result"
        onClose={onCloseModal}
        show={modal}
        onPlayAgain={onPlayAgain}
      >
        <GameResult result={words.result} />
      </Modal>
    </>
  );
}
