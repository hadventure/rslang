import { getRandomInt, shuffle } from '@/common/helper';
import { TWord } from '@/features/words/types';
import { getUserWord } from '@/features/words/words-slice';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

type SprintGameProps = {
  list: TWord[]
};

export default function SprintGame({ list }: SprintGameProps) {
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(0);
  const [shuffled, setShuffled] = useState<TWord[]>([]);
  const [variant, setVariant] = useState(3);
  const [isShowAnswer, setIsShowAnswer] = useState(false);

  useEffect(() => {
    const copy = list.slice(0);

    setShuffled(shuffle<TWord>(copy));
  }, []);

  const onApprove = () => {
    if (isShowAnswer) {
      dispatch(getUserWord({
        id: shuffled[current]._id, word: shuffled[current].word, right: 1, game: 'sprint',
      }));
    } else {
      dispatch(getUserWord({
        id: shuffled[current]._id, word: shuffled[current].word, right: 0, game: 'sprint',
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
        id: shuffled[current]._id, word: shuffled[current].word, right: 1, game: 'sprint',
      }));
    }

    setCurrent(current + 1);
    setVariant(variant - 1);
    setIsShowAnswer(Boolean(getRandomInt(0, 1)));
  };

  return (
    <>
      <div>
        {shuffled[current]?.word}
        {' - '}
        {
        isShowAnswer
          ? shuffled[current].wordTranslate
          : shuffled[variant]?.wordTranslate
        }
      </div>

      <button type="button" onClick={onApprove}>Yes</button>
      <button type="button" onClick={onAbort}>No</button>
    </>
  );
}
