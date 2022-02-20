// TODO: через реакт есть возможность?
// https://stackoverflow.com/questions/27363891/javascript-play-audio-one-after-another-html5
import { WordsState } from '@/features/words/words-slice';
import { useDispatch } from 'react-redux';
import {
  AiOutlinePushpin, AiOutlinePlayCircle,
} from 'react-icons/ai';
import { addToDifficult } from '@/features/words/words-thunks';
import { Difficulty } from '@/features/words/types';
import { setLearnedWords } from '@/features/stat/stat-thunks';
import cls from './word-card.module.scss';

type WordCardProps = {
  words: WordsState,
  isAuthenticated: boolean | null,
};

export default function WordCard({ words, isAuthenticated }: WordCardProps) {
  const dispatch = useDispatch();
  const audio = new Audio();

  const onPlayAudio = () => {
    const audioList = [
      words.currentWord?.audio,
      words.currentWord?.audioMeaning,
      words.currentWord?.audioExample,
    ];

    let index = 1;

    audio.src = `${process.env.API_URL}/${audioList[0]}`;
    audio.play();

    audio.onended = function () {
      if (index < audioList.length) {
        audio.src = `${process.env.API_URL}/${audioList[index]}`;
        audio.play();
        index += 1;
      }
    };
  };

  const onAddToDifficult = (type1: string) => {
    if (type1 === Difficulty.learned) {
      dispatch(setLearnedWords(1));
    }

    if (type1 === Difficulty.difficult
      && words.currentWord?.userWord?.difficulty === Difficulty.learned) {
      dispatch(setLearnedWords(-1));
    }

    if (words.currentWord?.userWord) {
      dispatch(addToDifficult({
        id: words.currentWord!._id,
        userWord: words.currentWord?.userWord,
        type: type1,
      }));
    } else {
      dispatch(addToDifficult({
        id: words.currentWord!._id,
        userWord: undefined,
        type: type1,
      }));
    }
  };

  if (words.currentWord === null) {
    return (
      <div className={cls.wordCardContainer}>
        <div className={cls.noWord}>No Word selected</div>
      </div>
    );
  }

  return (
    <div className={cls.wordCardContainer}>

      <div className={cls.cardHeader}>
        <img className={cls.img} src={`${process.env.API_URL}/${words.currentWord?.image}`} alt="" />

        <div className={cls.cardWordHead}>
          {words.currentWord?.word}
          <br />
          <div>
            <AiOutlinePlayCircle
              onClick={onPlayAudio}
              style={{ verticalAlign: 'middle', fontSize: '1.3em', flexBasis: '1.3em' }}
            />

          </div>

        </div>
      </div>

      <div className={cls.audioExample}>
        <div className={cls.iconWrap}>
          <AiOutlinePushpin style={{ verticalAlign: 'middle', fontSize: '1.3em', flexBasis: '1.3em' }} />
        </div>

        <div>
          <div dangerouslySetInnerHTML={{ __html: words.currentWord?.transcription }} />
          <div className={cls.tansl}>{words.currentWord?.wordTranslate}</div>
        </div>
      </div>

      <div className={cls.audioExample}>
        <div className={cls.iconWrap}>
          <AiOutlinePushpin style={{ verticalAlign: 'middle', fontSize: '1.3em', flexBasis: '1.3em' }} />
        </div>
        <div>
          <div dangerouslySetInnerHTML={{ __html: words.currentWord?.textMeaning }} />
          <div className={cls.tansl}>{words.currentWord?.textMeaningTranslate}</div>
        </div>
      </div>

      <div className={cls.audioExample}>
        <div className={cls.iconWrap}>
          <AiOutlinePushpin style={{ verticalAlign: 'middle', fontSize: '1.3em', flexBasis: '1.3em' }} />
        </div>

        <div>
          <div dangerouslySetInnerHTML={{ __html: words.currentWord?.textExample }} />
          <div className={cls.tansl}>{words.currentWord?.textExampleTranslate}</div>
        </div>
      </div>
      {
        isAuthenticated && (
          <>
            <br />
            <div className={cls.actions}>
              <button
                type="button"
                className={cls[`p${words.currentWord?.group + 1}`]}
                onClick={() => onAddToDifficult(Difficulty.difficult)}
              >
                Add to difficult
              </button>
              <button
                type="button"
                className={cls[`p${words.currentWord?.group + 1}`]}
                onClick={() => onAddToDifficult(Difficulty.learned)}
              >
                Add to learned
              </button>
            </div>
          </>
        )
      }

      {
        isAuthenticated && (
        <div className={cls.stat}>
          <div className={cls.statItem}>
            <div>Audiocall</div>
            <div>
              {`${words.currentWord?.userWord
                ? `${words.currentWord?.userWord.optional.audiocall.right} / ${words.currentWord?.userWord.optional.audiocall.right + words.currentWord?.userWord.optional.audiocall.wrong} `
                : '0 / 0'}`}

            </div>
          </div>
          <div className={cls.statItem}>
            <div>Sprint</div>
            <div>
              {`${words.currentWord?.userWord
                ? `${words.currentWord?.userWord.optional.sprint.right} / ${words.currentWord?.userWord.optional.sprint.right + words.currentWord?.userWord.optional.sprint.wrong} `
                : '0 / 0'}`}
            </div>
          </div>
        </div>
        )
      }

    </div>
  );
}
