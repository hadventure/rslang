import WordGroup from '../word-group/word-group';
import cls from './word-group-list.module.scss';

export default function WordGroupList() {
  const groups = [
    { id: '0', name: 'Part I', clsName: 'p1' },
    { id: '1', name: 'Part II', clsName: 'p2' },
    { id: '2', name: 'Part III', clsName: 'p3' },
    { id: '3', name: 'Part IV', clsName: 'p4' },
    { id: '4', name: 'Part V', clsName: 'p5' },
    { id: '5', name: 'Part VI', clsName: 'p6' },
  ];

  return (
    <>

      {/* <div className={cls.wordGroupName}>
        Dictionary
        <hr />
      </div> */}

      <div className={cls.wordGroupList}>
        {
        groups.map((group) => <WordGroup key={group.id} group={group} />)
      }

      </div>

      {/* <div className={cls.wordGroupName}>
        Tutorial
        <hr />
      </div> */}

      <div className={cls.wordGroupList}>
        <WordGroup group={{ id: '6', name: 'Difficult', clsName: 'p7' }} />
        <WordGroup group={{ id: '7', name: 'New', clsName: 'p8' }} />
        <WordGroup group={{ id: '8', name: 'Learned', clsName: 'p9' }} />
      </div>

    </>

  );
}
