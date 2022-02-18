import { getRandomInt, shuffle } from '@/common/helper';
import { Difficulty, TWord } from '@/features/words/types';
import React, {
  useEffect, useRef, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { AiFillDislike, AiFillLike } from 'react-icons/ai';
import { getUserWord } from '@/features/words/words-thunks';
import { TEMP_PAGINATION_LENGTH } from '@/common/constants';
import { setResult } from '@/features/words/words-slice';
import cls from './sprint-game.module.scss';
import right from '../../assets/yes.mp3';
import wrong from '../../assets/now.mp3';

type SprintGameProps = {
  list: TWord[],
  count: number,
  setStrategyGame: (page?: number) => void,
  page: number,
  isAuth: boolean | null
};

export default function SprintGame({
  list, count, setStrategyGame, page, isAuth,
}: SprintGameProps) {
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(0);
  const [shuffled, setShuffled] = useState<TWord[]>([]);
  const [variant, setVariant] = useState(0);
  const [isShowAnswer, setIsShowAnswer] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  const yes = new Audio(right);
  const no = new Audio(wrong);

  useEffect(() => {
    const copy = list.slice(0);
    wrap.current?.focus();

    document.addEventListener('click', () => {
      wrap.current?.focus();
    });

    const game = shuffle<TWord>(copy);

    setShuffled(game);
    setVariant(count - 1);

    return document.removeEventListener('click', () => {
      wrap.current?.focus();
    });
  }, []);

  useEffect(() => {
    // console.log(shuffled, variant);

    if (variant === -1) {
      setStrategyGame(Number(page) === TEMP_PAGINATION_LENGTH ? 1 : Number(page) + 1);
    }
  }, [current]);

  const onApprove = () => {
    const common = {
      id: shuffled[current]._id || shuffled[current].id,
      word: shuffled[current].word,
      game: 'sprint',
      wordTranslate: shuffled[current].wordTranslate,
    };

    if (isAuth) {
      if (isShowAnswer) {
        yes.play();
        dispatch(getUserWord({
          right: 1, ...common,
        }));
      } else {
        no.play();
        dispatch(getUserWord({
          right: 0, ...common,
        }));
      }
    }

    if (isAuth === false) {
      if (isShowAnswer) {
        yes.play();
        dispatch(setResult({
          right: 1, ...common,
        }));
      } else {
        no.play();
        dispatch(setResult({
          right: 0, ...common,
        }));
      }
    }

    setCurrent(current + 1);
    setVariant(variant - 1);
    setIsShowAnswer(Boolean(getRandomInt(0, 1)));
  };

  const onAbort = () => {
    const common = {
      id: shuffled[current]._id || shuffled[current].id,
      word: shuffled[current].word,
      game: 'sprint',
      wordTranslate: shuffled[current].wordTranslate,
      state: Difficulty.studied,
    };

    if (isAuth) {
      if (isShowAnswer) {
        no.play();
        dispatch(getUserWord({
          right: 0, ...common,
        }));
      } else {
        yes.play();
        dispatch(getUserWord({
          right: 1, ...common,
        }));
      }
    }

    if (isAuth === false) {
      if (isShowAnswer) {
        no.play();
        dispatch(setResult({
          right: 0, ...common,
        }));
      } else {
        yes.play();
        dispatch(setResult({
          right: 1, ...common,
        }));
      }
    }

    setCurrent(current + 1);
    setVariant(variant - 1);
    setIsShowAnswer(Boolean(getRandomInt(0, 1)));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    console.log(e);
    if (e.code === 'ArrowLeft') {
      onApprove();
    }

    if (e.code === 'ArrowRight') {
      onAbort();
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
      <div className={cls.actions} ref={wrap} tabIndex={0} onKeyDown={onKeyDown}>
        <button className={`${cls.btn} ${cls.yes}`} type="button" onClick={onApprove}>
          <AiFillLike style={{ verticalAlign: 'middle' }} color="#eee" size="1.6em" />
        </button>
        <button className={`${cls.btn} ${cls.no}`} type="button" onClick={onAbort}>
          <AiFillDislike style={{ verticalAlign: 'middle' }} color="#eee" size="1.6em" />
        </button>
      </div>

    </>
  );
}
