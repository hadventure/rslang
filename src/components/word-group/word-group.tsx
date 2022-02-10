import { setGroup, setPageWords } from '@/features/words/words-slice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import cls from './word-group.module.scss';

type WordGroupProps = {
  group: { id: string, name: string, clsName: string };
};

export default function WordGroup({ group }: WordGroupProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChangeGroup = () => {
    dispatch(setGroup(group.id));
    dispatch(setPageWords(1));
    navigate(`/dictionary/${group.id}`);
  };

  return (
    <div className={`${cls.wordGroupItem} ${cls[group.clsName]}`} onClick={onChangeGroup}>
    {group.name}
  </div>
  );
}
