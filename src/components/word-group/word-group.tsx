import { useNavigate } from 'react-router-dom';
import cls from './word-group.module.scss';

type WordGroupProps = {
  group: { id: number, name: string, clsName: string };
};

export default function WordGroup({ group }: WordGroupProps) {
  const navigate = useNavigate();

  const onChangeGroup = () => {
    navigate(`/dictionary/${group.id}`);
  };

  return (
    <div className={`${cls.wordGroupItem} ${cls[group.clsName]}`} onClick={onChangeGroup}>
    {group.name}
  </div>
  );
}
