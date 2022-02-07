import WordGroup from '../word-group/word-group';
import classes from './word-group-list.module.scss';

export default function WordGroupList() {
  const groups = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ];

  return (
    <>
      {
        groups.map((group) => <WordGroup key={group.id} group={group} />)
      }

      {/* <Outlet /> */}
    </>

  );
}
