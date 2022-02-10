import { NavLink } from 'react-router-dom';
import cls from './header.module.scss';

export default function Header() {
  return (
    <header className={`${cls.header} ${cls.head}`}>
      <div className="logo">RS Lang</div>

      <div className={cls.auth}>
        <NavLink to="auth" className={cls.authItem}>Sign in</NavLink>
        {/* <div className={cls.authLine}> | </div>
        <div className={cls.authItem}>Sign up</div> */}
      </div>

    </header>
  );
}
