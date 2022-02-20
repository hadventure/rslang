import { resetCurrentWord, setGroup, setPageWords } from '@/features/words/words-slice';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import cls from './word-group.module.scss';

type WordGroupProps = {
  group: { id: string, name: string | JSX.Element, clsName: string };
};

export default function WordGroup({ group }: WordGroupProps) {
  const dispatch = useDispatch();

  const onChangeGroup = () => {
    if (group.id !== 'difficult') {
      dispatch(setGroup(group.id));
      dispatch(setPageWords(0));
      dispatch(resetCurrentWord({}));
    }
  };

  return (
    <NavLink
      to={group.id === 'difficult' ? `/${group.id}` : `/dictionary/${group.id}`}
      className={`${cls.wordGroupItem} ${cls[group.clsName]}`}
      onClick={onChangeGroup}
      state={{ dictionary: group.id }}
    >
      {group.name}
    </NavLink>
  );
}
