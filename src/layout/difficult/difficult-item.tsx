import { Difficulty, TWord } from '@/features/words/types';
import { addToDifficult } from '@/features/words/words-thunks';
import { useDispatch } from 'react-redux';
import cls from './difficult.module.scss';

type DifficultItemProps = {
  item: TWord,
};

export default function DifficultItem({ item }: DifficultItemProps) {
  const dispatch = useDispatch();

  const removeFromDifficult = () => {
    dispatch(addToDifficult({
      id: item._id,
      userWord: item.userWord || undefined,
      type: Difficulty.studied,
    }));
  };

  return (
    <div className={cls.difficultItem}>
      <div>{item.word}</div>
      <div>
        <button
          type="button"
          onClick={removeFromDifficult}
          className={cls.btn}
        >
          Remove
        </button>
      </div>

    </div>
  );
}
