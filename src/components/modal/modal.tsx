// https://medium.com/tinyso/how-to-create-a-modal-component-in-react-from-basic-to-advanced-a3357a2a716a
import React from 'react';
import ReactDOM from 'react-dom';
import MsgBlock from '../msg-block/msg-block';
import cls from './modal.module.scss';

type ModalProps = {
  show: boolean,
  title: string,
  onClose: () => void,
  onPlayAgain: () => void,
  children: React.ReactNode,
  isFinish?: boolean,
};

export default function Modal({
  show, title, onClose, onPlayAgain, children, isFinish,
}: ModalProps) {
  const root = document.getElementById('root');

  if (show) {
    if (root) {
      return ReactDOM.createPortal(
        <div className={cls.modal} onClick={onClose}>
          <div className={cls.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={cls.modalHeader}>
              <h4 className={cls.modalTitle}>{title}</h4>
            </div>
            <div className={cls.modalBody}>
              {isFinish && (
              <div>
                <MsgBlock text="Слова для игры закончились" />
                <br />
                <br />
              </div>
              )}
              {children}
            </div>
            <div className={cls.modalFooter}>
              <button className={cls.btnClose} type="button" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>,
        root,
      );
    }
  }

  return null;
}
