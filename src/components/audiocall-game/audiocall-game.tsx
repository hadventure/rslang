import { getRandomIntArr, shuffle } from '@/common/helper';
import { TWord, TWordSprint } from '@/features/words/types';
import { getUserWord } from '@/features/words/words-thunks';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AiOutlinePlayCircle } from 'react-icons/ai';
import { setResult, setRightChainArr, setRightChainCount } from '@/features/words/words-slice';
import cls from './audiocall-game.module.scss';
import right from '../../assets/yes.mp3';
import wrong from '../../assets/now.mp3';

type AudiocallGameProps = {
  list: TWord[],
  onFinishGame: () => void,
  count: number,
  isAuth: boolean | null,
};

export default function AudiocallGame({
  list, onFinishGame, count, isAuth,
}: AudiocallGameProps) {
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
    const a = getRandomIntArr(0, count - 1, count)
      .map((el) => ({
        word: copy[el as number],
        variants: shuffle(getRandomIntArr(0, count - 1, 5, [el as number])
          .map((j) => copy[j as number])),
      }));

    setShuffled(a);

    audio.src = `${process.env.API_URL}/${a[current]?.word?.audio}`;
    audio.play();

    return () => {
      document.removeEventListener('click', setFocusOnPage);
    };
  }, []);

  useEffect(() => {
    if (current === count) {
      onFinishGame();
    }

    if (current !== 0 && current !== count) {
      audio.src = `${process.env.API_URL}/${shuffled[current]?.word?.audio}`;
      audio.play();
    }
  }, [current]);

  const toggleIsAnswered = () => setIsAnswered(!isAnswered);

  const onAnswer = (id: string) => {
    toggleIsAnswered();

    const common = {
      id: shuffled[current].word._id || shuffled[current].word.id,
      word: shuffled[current].word.word,
      game: 'audiocall',
      wordTranslate: shuffled[current].word.wordTranslate,
    };

    if (id === (shuffled[current].word._id || shuffled[current].word.id)) {
      yes.play();

      if (isAuth) {
        dispatch(getUserWord({
          right: 1, ...common,
        }));

        dispatch(setRightChainCount({}));
      } else {
        dispatch(setResult({
          right: 1, ...common,
        }));
      }
    } else {
      no.play();

      if (isAuth) {
        dispatch(getUserWord({
          right: 0, ...common,
        }));

        dispatch(setRightChainArr({}));
      } else {
        dispatch(setResult({
          right: 0, ...common,
        }));
      }
    }
  };

  const play = () => {
    audio.src = `${process.env.API_URL}/${shuffled[current]?.word?.audio}`;
    audio.play();
  };

  const onNext = () => {
    setCurrent(current + 1);
    if (isAnswered) {
      toggleIsAnswered();
    }
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
      if (isAnswered) {
        toggleIsAnswered();
      }
    }
  };

  return (
    <>
      <b>{shuffled[current]?.word.word}</b>
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
            key={el._id || el.id}
            type="button"
            onClick={() => onAnswer(el._id || el.id)}
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
