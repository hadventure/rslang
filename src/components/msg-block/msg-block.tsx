import cls from './msg-block.module.scss';

type MsgBlockProps = {
  text: string,
};

export default function MsgBlock({ text }: MsgBlockProps) {
  return (
    <div className={cls.msg}>
      {text}
    </div>
  );
}
