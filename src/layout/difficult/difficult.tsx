import MsgBlock from '@/components/msg-block/msg-block';
import { Difficulty } from '@/features/words/types';
import wordsSelector from '@/features/words/words-selector';
import { getUserWordsDifficult } from '@/features/words/words-thunks';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DifficultItem from './difficult-item';
import cls from './difficult.module.scss';

export default function Difficult() {
  const dispatch = useDispatch();
  const words = useSelector(wordsSelector);

  function getList() {
    const param = {
      filter: JSON.stringify({
        $and: [{
          $or: [
            { 'userWord.difficulty': Difficulty.difficult },
          ],
        },
        { page: 0 },
        ],
      }),
      wordsPerPage: '20',
    };

    dispatch(getUserWordsDifficult(param));
  }

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    if (words.refresh) {
      getList();
    }
  }, [words.refresh]);

  if (words.list.length === 0 && words.status === 'success') {
    return <MsgBlock text="Данных нет" />;
  }

  if (words.status === 'loading') {
    return <MsgBlock text="Loading" />;
  }

  return (
    <div className={cls.difficultWrap}>
      {
        words.list.map((el) => (
          <DifficultItem
            key={el._id}
            item={el}
          />
        ))
      }
    </div>
  );
}
