import { useNavigate } from 'react-router-dom';
import classes from './word-group.module.scss';

type WordGroupProps = {
  group: { id: number };
};

export default function WordGroup({ group }: WordGroupProps) {
  const navigate = useNavigate();

  const onChangeGroup = () => {
    navigate(`/tutorials/${group.id}`);
  };

  return (
    <button
      key={group.id}
      type="button"
      data-tutorial={group.id}
      onClick={onChangeGroup}
    >
      {group.id}
    </button>
  );
}
