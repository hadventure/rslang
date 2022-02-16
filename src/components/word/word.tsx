import { Difficulty, TWord } from '@/features/words/types';
import { setCurrentWord } from '@/features/words/words-slice';
import { useDispatch } from 'react-redux';
import { AiFillFire, AiOutlinePaperClip, AiOutlineCheck } from 'react-icons/ai';
import cls from './word.module.scss';

type WordProps = {
  item: TWord;
  index: number;
  color: string;
  currentWordID: string | undefined;
};

export default function Word({
  item, index, color, currentWordID,
}: WordProps) {
  const dispatch = useDispatch();

  const onSelectWord = () => {
    dispatch(setCurrentWord(index));
  };

  // console.log(item.userWord.difficulty)

  return (
    <div
      className={`${cls.word1} ${item._id === currentWordID ? `${cls.active} ${cls[color]}` : ''}`}
      onClick={onSelectWord}
    >
      <div className={cls.word}>{item.word}</div>
      {/* <br /> */}
      {
      item.userWord && item.userWord?.difficulty === Difficulty.difficult
        ? <AiFillFire color="#ff9800" size="1.5em" /> : null
    }

      {
      item.userWord && item.userWord?.difficulty === Difficulty.learned
        ? <AiOutlineCheck color="#7cb305" size="1.5em" /> : null
    }

      {/* {' '}
      <div className={cls.translation}>{item.transcription}</div> */}
    </div>
  );
}
