import cls from './msg-block.module.scss';

type MsgBlockProps = {
  text: string | JSX.Element,
};

export default function MsgBlock({ text }: MsgBlockProps) {
  return (
    <div className={cls.msg}>
      {text}
    </div>
  );
}
