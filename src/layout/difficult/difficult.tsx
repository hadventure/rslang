import MsgBlock from '@/components/msg-block/msg-block';
import WordCard from '@/components/word-card/word-card';
import Word from '@/components/word/word';
import levelsSelector from '@/features/levels/levels-selector';
import userSelector from '@/features/user/user-selector';
import { Difficulty } from '@/features/words/types';
import wordsSelector from '@/features/words/words-selector';
import { resetCurrentWord } from '@/features/words/words-slice';
import { getUserWordsDifficult } from '@/features/words/words-thunks';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cls from './difficult.module.scss';

export default function Difficult() {
  const dispatch = useDispatch();

  const words = useSelector(wordsSelector);
  const user = useSelector(userSelector);
  const levels = useSelector(levelsSelector);

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
      wordsPerPage: '50',
    };

    dispatch(getUserWordsDifficult(param));
  }

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    if (words.refresh) {
      dispatch(resetCurrentWord(null));
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
    <div className={cls.wordsContainer}>
      <div className={cls.wordCardContainer}>

        <WordCard
          words={words}
          isAuthenticated={user.isAuth}
        />
      </div>

      <div className={cls.wordListContainer}>
        <div className={cls.wordListContainer1}>
          {
        words.list.map((item, i) => (
          <Word
            key={item.id || item._id}
            index={i}
            item={item}
            color={levels.list[item.group].clsName}
            currentWordID={words.currentWord?._id || words.currentWord?.id}
            isAuthenticated={user.isAuth}
          />
        ))
      }

        </div>

      </div>

    </div>
  );
}
