import { sprintTime } from '@/common/constants';
import { useEffect, useState } from 'react';
import cls from './sprint-timer.module.scss';

type SprintTimerProps = {
  timer: boolean,
  onFinishTimer: () => void,
  showModal: () => void,
  isFinish: boolean,
};

export default function SprintTimer({
  timer,
  onFinishTimer,
  showModal,
  isFinish,
}: SprintTimerProps) {
  const [time, setTime] = useState(sprintTime);

  useEffect(() => {
    let timerID: NodeJS.Timeout;

    if (time > 0 && timer) {
      timerID = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    }

    if (isFinish) {
      //@ts-ignore
      clearTimeout(timerID);
    }

    return () => clearTimeout(timerID);
  }, [time, isFinish]);

  useEffect(() => {
    if (time === 0) {
      onFinishTimer();
      setTime(sprintTime);
      showModal();
    }
  }, [time]);

  return (
    <div className={cls.time}>{time}</div>
  );
}
