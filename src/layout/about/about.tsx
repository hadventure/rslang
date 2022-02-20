import avatar from '@/assets/avatar.png';
import MsgBlock from '@/components/msg-block/msg-block';
import cls from './about.module.scss';

export default function About() {
  return (
    <div className={cls.aboutWrap}>
      <MsgBlock text={(
        <div style={{ fontWeight: 'lighter', fontSize: 'smaller' }}>
          <p>
            СПРИНТ
            <br />
            <br />
            Если пользователь не авторизован или авторизован и зашел по ссылке в меню -
            игра бесконечна (если бы не было таймера) страницы будут подгружаться друг за другом
            <br />
            <br />
            Если пользователь авторизован и зашел из словаря -
            неизученные полностью страницы будут подгружаться друг за другом,
            пока все страницы не станут изучены.
            <br />
            <br />
            Если, например, слово осталось одно и оно не изучено, то нужно будет ответить на него
            3 раза для обычного слова и пять раз для сложного. Потом появится
            модальное окно с результатами, таймер остановится.
            <br />
            <b>Чтобы
            потестировать у пользователя test11@gmail.com с паролем 87654321 первый раздел весь изучен</b>
          </p>
        </div>
      )}
      />

      <MsgBlock text={(
        <p style={{ fontWeight: 'lighter', fontSize: 'smaller' }}>
          АУДИОВЫЗОВ
        </p>
      )}
      />

      <div className={cls.self}>
        <img className={cls.avatar} src={avatar} alt="" />
        Аня. Спроектировала, сверстала и разработала приложение.
      </div>

    </div>

  );
}
