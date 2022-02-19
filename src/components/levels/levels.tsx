import levelsSelector from '@/features/levels/levels-selector';
import { resetStatus } from '@/features/words/words-slice';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import cls from './levels.module.scss';

export default function Levels() {
  const dispatch = useDispatch();

  const levels = useSelector(levelsSelector);
  const location = useLocation();

  return (
    <div className={cls.levels}>
      {
        levels.list.map((el) => (
          <NavLink
            to={`${location.pathname}/${el.id}`}
            key={el.id}
            className={`${cls.wordGroupItem} ${cls[el.clsName]}`}
            onClick={() => dispatch(resetStatus(''))}
          >
            {el.name}
          </NavLink>
        ))
      }

    </div>
  );
}
