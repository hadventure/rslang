import { getRandomInt, shuffle } from '@/common/helper';
import { TWord } from '@/features/words/types';
import React, {
  RefObject, useEffect, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { AiFillDislike, AiFillLike } from 'react-icons/ai';
import { getUserWord } from '@/features/words/words-thunks';
import { SPRINT_LEGTH } from '@/common/constants';
import cls from './sprint-game.module.scss';

type SprintGameProps = {
  list: TWord[],
  yes: RefObject<HTMLButtonElement>,
  no: RefObject<HTMLButtonElement> | null,
  count: number,
};

export default function SprintGame({
  list, yes, no, count,
}: SprintGameProps) {
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(0);
  const [shuffled, setShuffled] = useState<TWord[]>([]);
  const [variant, setVariant] = useState(count - 1);
  const [isShowAnswer, setIsShowAnswer] = useState(false);

  useEffect(() => {
    const copy = list.slice(0);
    if (yes.current) {
      yes.current.focus();
    }

    setShuffled(shuffle<TWord>(copy));
  }, []);

  const onApprove = () => {
    // console.log(variant, current, shuffled[current]?.word, shuffled[current].wordTranslate);

    if (isShowAnswer) {
      dispatch(getUserWord({
        id: shuffled[current]._id,
        word: shuffled[current].word,
        right: 1,
        game: 'sprint',
      }));
    } else {
      dispatch(getUserWord({
        id: shuffled[current]._id,
        word: shuffled[current].word,
        right: 0,
        game: 'sprint',
      }));
    }

    setCurrent(current + 1);
    setVariant(variant - 1);
    setIsShowAnswer(Boolean(getRandomInt(0, 1)));
  };

  const onAbort = () => {
    if (isShowAnswer) {
      dispatch(getUserWord({
        id: shuffled[current]._id,
        word: shuffled[current].word,
        right: 0,
        game: 'sprint',
      }));
    } else {
      dispatch(getUserWord({
        id: shuffled[current]._id,
        word: shuffled[current].word,
        right: 1,
        game: 'sprint',
      }));
    }

    setCurrent(current + 1);
    setVariant(variant - 1);
    setIsShowAnswer(Boolean(getRandomInt(0, 1)));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'ArrowLeft') {
      yes?.current?.focus();
    }

    if (e.code === 'ArrowRight') {
      no?.current?.focus();
    }
  };

  return (
    <>
      <div className={cls.question}>
        {shuffled[current]?.word}
        {' - '}
        {
        isShowAnswer
          ? `${shuffled[current]?.wordTranslate}?`
          : `${shuffled[variant]?.wordTranslate}?`
        }

      </div>
      <div className={cls.actions} onKeyDown={onKeyDown}>
        <button ref={yes} className={`${cls.btn} ${cls.yes}`} type="button" onClick={onApprove}>
          <AiFillLike style={{ verticalAlign: 'middle' }} color="#eee" size="1.6em" />
        </button>
        <button ref={no} className={`${cls.btn} ${cls.no}`} type="button" onClick={onAbort}>
          <AiFillDislike style={{ verticalAlign: 'middle' }} color="#eee" size="1.6em" />
        </button>
      </div>

    </>
  );
}
