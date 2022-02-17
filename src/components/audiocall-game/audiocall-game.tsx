import { getRandomIntArr, shuffle } from '@/common/helper';
import { TWord, TWordSprint } from '@/features/words/types';
import { getUserWord } from '@/features/words/words-thunks';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

type AudiocallGameProps = {
  list: TWord[],
  onFinishGame: () => void
};

export default function AudiocallGame({ list, onFinishGame }: AudiocallGameProps) {
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(0);
  const [shuffled, setShuffled] = useState<TWordSprint[]>([]);

  const audio = new Audio();

  useEffect(() => {
    const copy = list.slice(0);
    // as TODO
    const a = getRandomIntArr(0, 19, 10).map((el) => ({
      word: copy[el as number],
      variants: shuffle(getRandomIntArr(0, 19, 5, [el as number]).map((j) => copy[j as number])),
    }));

    setShuffled(a);

    audio.src = `${process.env.API_URL}/${a[current]?.word?.audio}`;
    audio.play();
  }, []);

  useEffect(() => {
    if (current === 10) {
      onFinishGame();
    } else if (current !== 0) {
      audio.src = `${process.env.API_URL}/${shuffled[current]?.word?.audio}`;
      audio.play();
    }
  }, [current]);

  const onAnswer = (id: string) => {
    if (id === shuffled[current].word._id) {
      dispatch(getUserWord({
        id: shuffled[current].word._id,
        word: shuffled[current].word.word,
        right: 1,
        game: 'audiocall',
        wordTranslate: shuffled[current].word.wordTranslate,
      }));
    } else {
      dispatch(getUserWord({
        id: shuffled[current].word._id,
        word: shuffled[current].word.word,
        right: 0,
        game: 'audiocall',
        wordTranslate: shuffled[current].word.wordTranslate,
      }));
    }
  };

  const play = () => {
    audio.src = `${process.env.API_URL}/${shuffled[current]?.word?.audio}`;
    audio.play();
  };

  const onNext = () => {
    setCurrent(current + 1);
  };

  return (
    <div>
      <div>{shuffled[current]?.word.audioExample}</div>
      <div>{shuffled[current]?.word.word}</div>
      <div>{shuffled[current]?.word.wordTranslate}</div>
      <button type="button" onClick={play}>Play</button>
      <div>
        {
        shuffled[current]?.variants.map((el) => (
          <button
            key={el._id}
            type="button"
            onClick={() => onAnswer(el._id)}
          >
            {el.wordTranslate}
          </button>
        ))
        }
        <div><button type="button" onClick={onNext}>Next</button></div>

      </div>
    </div>
  );
}
