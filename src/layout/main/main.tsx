import { useDispatch } from 'react-redux';
import {
  NavLink,
  useNavigate,
} from 'react-router-dom';
import study from '@/assets/study.svg';
import play from '@/assets/play.svg';
import grow from '@/assets/grow.svg';

import { AiOutlineArrowRight } from 'react-icons/ai';
import MsgBlock from '@/components/msg-block/msg-block';
import cls from './main.module.scss';

export default function Main() {
  return (
    <>
      <div className={cls.images}>
        <div>

          <div className={cls.imgWrap}>
            <img className={cls.mainImg} src={study} alt="" />
            <div className={cls.imgRecord}>study</div>
          </div>
          <NavLink to="/dictionary">
            <button type="button" className={cls.goToPart}>
              go!
              <AiOutlineArrowRight
                style={{
                  verticalAlign: 'middle', fontSize: '1.3em', marginLeft: '1.5rem',
                }}
              />
            </button>
          </NavLink>

        </div>

        <div>
          <div className={cls.imgWrap}>
            <img className={cls.mainImg} src={play} alt="" />
            <div className={cls.imgRecord}>play</div>
          </div>
          <NavLink to="/games/audiocall">
            <button type="button" className={cls.goToPart}>
              go!
              <AiOutlineArrowRight
                style={{
                  verticalAlign: 'middle', fontSize: '1.3em', marginLeft: '1.5rem',
                }}
              />
            </button>
          </NavLink>

        </div>

        <div>
          <div className={cls.imgWrap}>
            <img className={cls.mainImg} src={grow} alt="" />
            <div className={cls.imgRecord}>grow</div>
          </div>

          <NavLink to="/statistics">
            <button type="button" className={cls.goToPart}>
              go!
              <AiOutlineArrowRight
                style={{
                  verticalAlign: 'middle', fontSize: '1.3em', marginLeft: '1.5rem',
                }}
              />
            </button>
          </NavLink>

        </div>

      </div>
      <MsgBlock text={(
        <>
          <div>sdfsdfdsf</div>
          <br />
          <div>sdfsdfdsf</div>
        </>
      )}
      />

    </>

  );
}
