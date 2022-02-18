import { getRandomIntArr, shuffle } from '@/common/helper';
import { TWord, TWordSprint } from '@/features/words/types';
import { getUserWord } from '@/features/words/words-thunks';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  AiOutlinePushpin, AiOutlinePlayCircle,
} from 'react-icons/ai';
import cls from './audiocall-game.module.scss';
import right from '../../assets/yes.mp3';
import wrong from '../../assets/now.mp3';

type AudiocallGameProps = {
  list: TWord[],
  onFinishGame: () => void
};

export default function AudiocallGame({ list, onFinishGame }: AudiocallGameProps) {
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(0);
  const [shuffled, setShuffled] = useState<TWordSprint[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  const audio = new Audio();

  const yes = new Audio(right);
  const no = new Audio(wrong);

  const setFocusOnPage = () => wrap.current?.focus();

  useEffect(() => {
    setFocusOnPage();

    document.addEventListener('click', setFocusOnPage);

    const copy = list.slice(0);
    // as TODO
    const a = getRandomIntArr(0, 19, 20)
      .map((el) => ({
        word: copy[el as number],
        variants: shuffle(getRandomIntArr(0, 19, 5, [el as number]).map((j) => copy[j as number])),
      }));

    setShuffled(a);

    audio.src = `${process.env.API_URL}/${a[current]?.word?.audio}`;
    audio.play();

    return () => {
      document.addEventListener('click', setFocusOnPage);
    };
  }, []);

  useEffect(() => {
    if (current === 10) {
      onFinishGame();
    } else if (current !== 0) {
      audio.src = `${process.env.API_URL}/${shuffled[current]?.word?.audio}`;
      audio.play();
    }
  }, [current]);

  const toggleIsAnswered = () => setIsAnswered(!isAnswered);

  const onAnswer = (id: string) => {
    toggleIsAnswered();

    if (id === shuffled[current].word._id) {
      yes.play();

      dispatch(getUserWord({
        id: shuffled[current].word._id,
        word: shuffled[current].word.word,
        right: 1,
        game: 'audiocall',
        wordTranslate: shuffled[current].word.wordTranslate,
      }));
    } else {
      no.play();

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
    toggleIsAnswered();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!isAnswered) {
      if (['Numpad5', 'Numpad4', 'Numpad3', 'Numpad2', 'Numpad1'].includes(e.code)) {
        const i = Number(e.code.replace('Numpad', '')) - 1;
        onAnswer(shuffled[current].variants[i].id || shuffled[current].variants[i]._id);
      }

      if (['Digit5', 'Digit4', 'Digit3', 'Digit2', 'Digit1'].includes(e.code)) {
        const i = Number(e.code.replace('Digit', '')) - 1;
        onAnswer(shuffled[current].variants[i].id || shuffled[current].variants[i]._id);
      }
    }

    if (e.code === 'Space') {
      setCurrent(current + 1);
      toggleIsAnswered();
    }
  };

  return (
    <>
      <div className={cls.answer} ref={wrap} tabIndex={0} onKeyDown={onKeyDown}>
        {
        isAnswered && (
        <>
          <img className={cls.img} src={`${process.env.API_URL}/${shuffled[current]?.word.image}`} alt="" />
          <div className={cls.answerWord}>
            <b>{shuffled[current]?.word.word}</b>
            {' '}
            {shuffled[current]?.word.transcription}
          </div>
        </>
        )
      }

      </div>

      <div className={cls.play}>
        <AiOutlinePlayCircle
          onClick={play}
          className={cls.svg}
          style={{
            verticalAlign: 'middle', fontSize: '4.5em', flexBasis: '1.3em', cursor: 'pointer',
          }}
        />
      </div>

      <div className={cls.varints}>
        {
        shuffled[current]?.variants.map((el, i) => (
          <button
            className={cls.variant}
            key={el._id}
            type="button"
            onClick={() => onAnswer(el._id)}
            disabled={isAnswered}
          >
            {`${i + 1}. ${el.wordTranslate}`}
          </button>
        ))
        }
      </div>
      <div className={cls.nextWrap}>
        <button className={cls.next} type="button" onClick={onNext}>Next</button>
      </div>

    </>
  );
}
