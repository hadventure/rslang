import { TResult } from '@/features/words/types';
import cls from './game-result.module.scss';

type GameItemProps = {
  item: TResult,
};

export default function GameItem({ item }: GameItemProps) {
  return (
    <div className={cls.item}>
      <div>{item.word}</div>
      <div className={cls.state}>{item.wordTranslate}</div>
      <div>{item.state}</div>
    </div>
  );
}
