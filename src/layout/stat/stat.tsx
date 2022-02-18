import { getStat } from '@/features/stat/stat-thunks';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// type WordProps = {
//   item: TWord;
// };

export default function Stat() {
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(getStat({}));
  }, [dispatch]);

  return (
    <div>
      <div className="notification">
        aksjhfksdjf
      </div>
    </div>
  );
}
