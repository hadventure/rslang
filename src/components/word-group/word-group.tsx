import { resetCurrentWord, setGroup, setPageWords } from '@/features/words/words-slice';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import cls from './word-group.module.scss';

type WordGroupProps = {
  group: { id: string, name: string, clsName: string };
};

export default function WordGroup({ group }: WordGroupProps) {
  const dispatch = useDispatch();

  const onChangeGroup = () => {
    dispatch(setGroup(group.id));
    dispatch(setPageWords(1));
    dispatch(resetCurrentWord({}));
  };

  return (
    <NavLink
      to={`/dictionary/${group.id}`}
      className={`${cls.wordGroupItem} ${cls[group.clsName]}`}
      onClick={onChangeGroup}
      state={{ dictionary: group.id }}
    >
      {group.name}
    </NavLink>
  );
}
