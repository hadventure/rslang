import levelsSelector from '@/features/levels/levels-selector';
import { useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import cls from './levels.module.scss';

export default function Levels() {
  const navigate = useNavigate();
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
          >
            {el.name}
          </NavLink>
        ))
      }

    </div>
  );
}
