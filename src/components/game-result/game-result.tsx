import { TResult } from '@/features/words/types';
import GameItem from './game-item';
import cls from './game-result.module.scss';

type GameResultProps = {
  result: TResult[],
};

export default function GameResult({ result }: GameResultProps) {
  const right = result.filter((el) => el.right === 1);
  const wrong = result.filter((el) => el.right === 0);

  return (
    <>
      <span className={`${cls.count} ${cls.right}`} />
      {right.length}

      {
      right.map((el) => (
        <GameItem key={el.id} item={el} />
      ))
    }
      <br />
      <br />

      <span className={`${cls.count} ${cls.wrong}`} />
      {wrong.length}
      {
      wrong.map((el) => (
        <GameItem key={el.id} item={el} />
      ))
    }
    </>
  );
}
