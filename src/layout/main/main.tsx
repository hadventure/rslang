import {
  NavLink,
} from 'react-router-dom';
import study from '@/assets/study.svg';
import play from '@/assets/play.svg';
import grow from '@/assets/grow.svg';
import { AiOutlineArrowRight } from 'react-icons/ai';
import MsgBlock from '@/components/msg-block/msg-block';
import { UserState } from '@/features/user/user-slice';
import cls from './main.module.scss';

type MainProps = {
  user: UserState,
};

export default function Main({ user }: MainProps) {
  return (
    <>
      <MsgBlock text={user.isAuth ? `Hello, ${user.auth.name}!` : 'Hello, friend!'} />
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

      <NavLink to="/about">
        <button type="button" className={cls.goToPart}>
          More
          <AiOutlineArrowRight
            style={{
              verticalAlign: 'middle', fontSize: '1.3em', marginLeft: '1.5rem',
            }}
          />
        </button>
      </NavLink>

    </>

  );
}
