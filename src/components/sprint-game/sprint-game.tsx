import { getRandomInt, shuffle } from '@/common/helper';
import { Difficulty, TWord } from '@/features/words/types';
import React, {
  RefObject, useEffect, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { AiFillDislike, AiFillLike } from 'react-icons/ai';
import { getUserWord } from '@/features/words/words-thunks';
import { SPRINT_LEGTH, TEMP_PAGINATION_LENGTH } from '@/common/constants';
import { setResult } from '@/features/words/words-slice';
import cls from './sprint-game.module.scss';

type SprintGameProps = {
  list: TWord[],
  yes: RefObject<HTMLButtonElement>,
  no: RefObject<HTMLButtonElement> | null,
  count: number,
  setStrategyGame: (page?: number) => void,
  page: string,
  isAuth: boolean | null
};

export default function SprintGame({
  list, yes, no, count, setStrategyGame, page, isAuth,
}: SprintGameProps) {
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(0);
  const [shuffled, setShuffled] = useState<TWord[]>([]);
  const [variant, setVariant] = useState(0);
  const [isShowAnswer, setIsShowAnswer] = useState(false);

  useEffect(() => {
    const copy = list.slice(0);
    if (yes.current) {
      yes.current.focus();
    }

    const game = shuffle<TWord>(copy);
    setShuffled(game);
    setVariant(count - 1);
  }, []);

  useEffect(() => {
    console.log(variant, current, Number(page), TEMP_PAGINATION_LENGTH);

    if (variant === -1) {
      setStrategyGame(Number(page) === TEMP_PAGINATION_LENGTH ? 1 : Number(page) + 1);
    }
  }, [current]);

  const onApprove = () => {
    // console.log(variant, current, shuffled[current]?.word, shuffled[current].wordTranslate);

    if (isAuth) {
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
    }

    if (isAuth === false) {
      if (isShowAnswer) {
        dispatch(setResult({
          id: shuffled[current].id,
          word: shuffled[current].word,
          right: 1,
          game: 'sprint',
          state: Difficulty.studied,
        }));
      } else {
        dispatch(setResult({
          id: shuffled[current].id,
          word: shuffled[current].word,
          right: 0,
          game: 'sprint',
          state: Difficulty.studied,
        }));
      }
    }

    setCurrent(current + 1);
    setVariant(variant - 1);
    setIsShowAnswer(Boolean(getRandomInt(0, 1)));
  };

  const onAbort = () => {
    if (isAuth) {
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
    }

    if (isAuth === false) {
      if (isShowAnswer) {
        dispatch(setResult({
          id: shuffled[current].id,
          word: shuffled[current].word,
          right: 0,
          game: 'sprint',
          state: Difficulty.studied,
        }));
      } else {
        dispatch(setResult({
          id: shuffled[current].id,
          word: shuffled[current].word,
          right: 1,
          game: 'sprint',
          state: Difficulty.studied,
        }));
      }
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
