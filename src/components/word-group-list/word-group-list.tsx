import { AiFillFire, AiFillPushpin, AiOutlineCheck, AiFillHourglass } from 'react-icons/ai';
import WordGroup from '../word-group/word-group';
import cls from './word-group-list.module.scss';

export default function WordGroupList() {
  const groups = [
    { id: '0', name: 'I', clsName: 'p1' },
    { id: '1', name: 'II', clsName: 'p2' },
    { id: '2', name: 'III', clsName: 'p3' },
    { id: '3', name: 'IV', clsName: 'p4' },
    { id: '4', name: 'V', clsName: 'p5' },
    { id: '5', name: 'VI', clsName: 'p6' },
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

      <div className={cls.wordGroupState}>
        <WordGroup group={{
          id: '6',
          name: <>
            <div><AiFillFire color="#ff9800" size="1.5em" /></div>
            {'  Difficult'}
          </>,
          clsName: 'p7',
        }}
        />
        <WordGroup group={{
          id: '7',
          name: <>
            <AiFillPushpin color="#607d8b" size="1.5em" />
            {'  '}
            New
          </>,
          clsName: 'p8',
        }}
        />
        <WordGroup group={{
          id: '8',
          name: <>
            <div>
              {' '}
              <AiOutlineCheck color="#7cb305" size="1.5em" />
            </div>
            {'  '}
            <div>Learned</div>

                </>,
          clsName: 'p9',
        }}
        />
      </div>

    </>

  );
}
