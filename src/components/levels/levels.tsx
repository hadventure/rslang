import levelsSelector from '@/features/levels/levels-selector';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Levels() {
  const navigate = useNavigate();
  const levels = useSelector(levelsSelector);
  const location = useLocation();

  const navigateToGame = (id: string) => {
    navigate(`${location.pathname}/${id}`);
  };

  return (
    <div>
      {
        levels.list.map((el) => <button key={el.id} type="button" onClick={() => navigateToGame(el.id)}>{el.name}</button>)
      }

    </div>
  );
}
