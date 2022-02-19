import { useDispatch } from 'react-redux';
import {
  useNavigate,
} from 'react-router-dom';
import study from '@/assets/study.svg';
import play from '@/assets/play.svg';
import grow from '@/assets/grow.svg';

import { AiOutlineArrowRight } from 'react-icons/ai';
import cls from './main.module.scss';

export default function Main() {
  const dispatch = useDispatch();
  // const user = useSelector(userSelector);
  const navigate = useNavigate();

  // useEffect(() => {
  //   dispatch(checkUserData());
  // }, []);

  return (
    <div className={cls.images}>
      <div>

        <div className={cls.imgWrap}>
          <img className={cls.mainImg} src={study} alt="" />
          <div className={cls.imgRecord}>study</div>
        </div>
        <button type="button" className={cls.goToPart}>
          go!
          <AiOutlineArrowRight
            style={{
              verticalAlign: 'middle', fontSize: '1.3em', marginLeft: '1.5rem',
            }}
          />
        </button>
      </div>

      <div>
        <div className={cls.imgWrap}>
          <img className={cls.mainImg} src={play} alt="" />
          <div className={cls.imgRecord}>play</div>
        </div>
        <button type="button" className={cls.goToPart}>
          go!
          <AiOutlineArrowRight
            style={{
              verticalAlign: 'middle', fontSize: '1.3em', marginLeft: '1.5rem',
            }}
          />
        </button>
      </div>

      <div>
        <div className={cls.imgWrap}>
          <img className={cls.mainImg} src={grow} alt="" />
          <div className={cls.imgRecord}>grow</div>
        </div>
        <button type="button" className={cls.goToPart}>
          go!
          <AiOutlineArrowRight
            style={{
              verticalAlign: 'middle', fontSize: '1.3em', marginLeft: '1.5rem',
            }}
          />
        </button>
      </div>

    </div>
  );
}
