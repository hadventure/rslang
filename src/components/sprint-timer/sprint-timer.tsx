import { useEffect, useState } from 'react';

type SprintTimerProps = {
  timer: boolean,
  onFinishTimer: () => void,
  showModal: () => void,
};

export default function SprintTimer({
  timer,
  onFinishTimer,
  showModal,
}: SprintTimerProps) {
  const [time, setTime] = useState(120);

  useEffect(() => {
    let timerID: NodeJS.Timeout;

    if (time > 0 && timer) {
      timerID = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    }

    return () => clearTimeout(timerID);
  }, [time, timer]);

  useEffect(() => {
    if (time === 0) {
      onFinishTimer();
      setTime(120);
      showModal();
    }
  }, [time]);

  // console.log('render');
  return (
    <div>{time}</div>
  );
}
