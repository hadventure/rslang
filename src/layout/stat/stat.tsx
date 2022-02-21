/* eslint-disable max-len */
import { getFormattedDate } from '@/common/optional-entity';
import { getStat, getStatData } from '@/features/stat/stat-thunks';
import { TStat } from '@/features/stat/types';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import sprinticon from '../../assets/ILLUSTRATION_OFFICE_13.svg';
import audiocallicon from '../../assets/ILLUSTRATION_OFFICE_08.svg';
import common from '../../assets/ILLUSTRATION_OFFICE_01.svg';

import cls from './stat.module.scss';

type StatProps = {
  stat: Partial<TStat> | null;
};

export default function Stat({ stat }: StatProps) {
  const dispatch = useDispatch();
  const today = getFormattedDate();

  useEffect(() => {
    dispatch(getStatData({}));
  }, []);

  if (stat === null) {
    return <div>Loading</div>;
  }

  let sprint;
  let audiocall;
  if (stat.optional?.games[today]?.sprint) {
    sprint = stat.optional?.games[today].sprint;
  }

  if (stat.optional?.games[today]?.audiocall) {
    audiocall = stat.optional?.games[today].audiocall;
  }

  return (
    <div className={cls.statPage}>
      <div className={cls.gameStatItemWrap}>
        <div className={cls.imgWrap}>
          <img src={sprinticon} alt="" className={cls.img} />
          <div className={cls.gameStatItem}>
            <div className={cls.gameChunk}>

              <div className={cls.note}>Количество новых слов за день</div>
              {' '}
              <div className={cls.count}>{sprint?.newWordCount || 0}</div>
            </div>
            <div className={cls.gameChunk}>
              <div className={cls.note}>Процент правильных ответов</div>
              {' '}
              <div className={cls.count}>{Math.round((sprint?.right || 0 * 100) / ((sprint?.right || 0) + (sprint?.wrong || 0))) || 0}</div>
            </div>
            <div className={cls.gameChunk}>
              <div className={cls.note}>Самая длинная серия правильных ответов</div>
              {' '}
              <div className={cls.count}>{sprint?.gamerightchain || 0}</div>
            </div>
          </div>
        </div>
        <div className={cls.imgWrap}>
          <img src={audiocallicon} className={cls.img} alt="" />

          <div className={cls.gameStatItem}>
            <div>
              <div className={cls.gameChunk}>
                <div className={cls.note}>Количество новых слов за день</div>
                {' '}
                <div className={cls.count}>{audiocall?.newWordCount || 0}</div>
              </div>
              <div className={cls.gameChunk}>
                <div className={cls.note}>Процент правильных ответов</div>
                {' '}
                <div className={cls.count}>{Math.round(((audiocall?.right || 0) * 100) / ((audiocall?.right || 0) + (audiocall?.wrong || 0))) || 0}</div>
              </div>
              <div className={cls.gameChunk}>
                <div className={cls.note}>Самая длинная серия правильных ответов</div>
                {' '}
                <div className={cls.count}>{audiocall?.gamerightchain || 0}</div>
              </div>
            </div>
          </div>
        </div>
        <div className={cls.imgWrap}>
          <img src={common} className={cls.img} alt="" />
          <div className={cls.gameStatItem}>
            <div>
              <div className={cls.gameChunk}>
                <div className={cls.note}>Количество новых слов за день</div>
                {' '}
                <div className={cls.count}>
                  {(sprint?.newWordCount || 0) + (audiocall?.newWordCount || 0)}
                </div>
              </div>

              <div className={cls.gameChunk}>
                <div className={cls.note}>Количество изученных слов за день</div>
                {' '}
                <div className={cls.count}>{stat.optional?.learnedWords[today] || 0}</div>
              </div>

              <div className={cls.gameChunk}>
                <div className={cls.note}>Процент правильных ответов за день</div>
                {' '}
                <div className={cls.count}>{Math.round((((audiocall?.right || 0) + (sprint?.right || 0)) * 100) / ((audiocall?.right || 0) + (audiocall?.wrong || 0) + (sprint?.right || 0) + (sprint?.wrong || 0))) || 0}</div>
              </div>

            </div>
          </div>

        </div>

      </div>
      {/* <div className={cls.title}>today</div>
      <div className={cls.todayStat} /> */}
    </div>
  );
}
