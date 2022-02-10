import WordGroup from '../word-group/word-group';
import cls from './word-group-list.module.scss';

export default function WordGroupList() {
  const groups = [
    { id: 1, name: 'Part I', clsName: 'p1' },
    { id: 2, name: 'Part II', clsName: 'p2' },
    { id: 3, name: 'Part III', clsName: 'p3' },
    { id: 4, name: 'Part IV', clsName: 'p4' },
    { id: 5, name: 'Part V', clsName: 'p5' },
    { id: 6, name: 'Part VI', clsName: 'p6' },
  ];

  return (
    <div className={cls.wordGroupList}>
      {
        groups.map((group) => <WordGroup key={group.id} group={group} />)
      }
    </div>
  );
}
