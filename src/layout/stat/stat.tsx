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
  console.log('111', stat);
  const today = getFormattedDate();

  useEffect(() => {
    // console.log('111', stat);
    dispatch(getStatData({}));
  }, []);

  if (stat === null) {
    return <div>Loading</div>;
  }

  const { sprint, audiocall } = stat.optional!.games[today];

  return (
    <div className={cls.statPage}>
      <div className={cls.gameStatItemWrap}>
        <div className={cls.imgWrap}>
          <img src={sprinticon} alt="" className={cls.img} />
        </div>
        <div className={cls.imgWrap}>
          <img src={audiocallicon} className={cls.img} alt="" />
        </div>
        <div className={cls.imgWrap}>
          <img src={common} className={cls.img} alt="" />
        </div>
        <div className={cls.gameStatItem}>
          <div className={cls.gameChunk}>

            <div className={cls.note}>new</div>
            {' '}
            <div className={cls.count}>{sprint.newWordCount}</div>
          </div>
          <div className={cls.gameChunk}>
            <div className={cls.note}>right answers</div>
            {' '}
            <div className={cls.count}>{Math.round((sprint.right * 100) / (sprint.right + sprint.wrong)) || 0}</div>
          </div>
          <div className={cls.gameChunk}>
            <div className={cls.note}>right chain</div>
            {' '}
            <div className={cls.count}>{sprint.gamerightchain}</div>
          </div>
        </div>

        <div className={cls.gameStatItem}>
          <div>
            <div className={cls.gameChunk}>
              <div className={cls.note}>new</div>
              {' '}
              <div className={cls.count}>{audiocall.newWordCount}</div>
            </div>
            <div className={cls.gameChunk}>
              <div className={cls.note}>right answers</div>
              {' '}
              <div className={cls.count}>{Math.round((audiocall.right * 100) / (audiocall.right + audiocall.wrong)) || 0}</div>
            </div>
            <div className={cls.gameChunk}>
              <div className={cls.note}>right chain</div>
              {' '}
              <div className={cls.count}>{audiocall.gamerightchain}</div>
            </div>
          </div>
        </div>

        <div className={cls.gameStatItem}>
          <div>
            <div className={cls.gameChunk}>
              <div className={cls.note}>new</div>
              {' '}
              <div className={cls.count}>{sprint.newWordCount + audiocall.newWordCount}</div>
            </div>

            <div className={cls.gameChunk}>
              <div className={cls.note}>new</div>
              {' '}
              <div className={cls.count}>{stat.optional?.learnedWords[today]}</div>
            </div>

            <div className={cls.gameChunk}>
              <div className={cls.note}>common percent</div>
              {' '}
              <div className={cls.count}>{Math.round(((audiocall.right + sprint.right) * 100) / (audiocall.right + audiocall.wrong + sprint.right + sprint.wrong)) || 0}</div>
            </div>

          </div>
        </div>

      </div>
      {/* <div className={cls.title}>today</div>
      <div className={cls.todayStat} /> */}
    </div>
  );
}
