import { NavLink, useLocation } from 'react-router-dom';
import { AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai';
import cls from './header.module.scss';

type HeaderProps = {
  isAuthenticated: boolean | null;
};

export default function Header({ isAuthenticated }: HeaderProps) {
  const location = useLocation();

  return (
    <header className={`${cls.header} ${cls.head}`}>
      <NavLink to="/" className={cls.authItem}>RS Lang</NavLink>

      <div className={location.pathname !== '/auth' ? `${cls.auth}` : `${cls.auth} ${cls.hidden}`}>
        <NavLink
          to="auth"
          className={!isAuthenticated ? `${cls.authItem}` : `${cls.authItem} ${cls.hidden}`}
        >
          <AiOutlineLogin style={{ verticalAlign: 'middle', fontSize: '1.3em' }} />
        </NavLink>
        <NavLink
          to="auth"
          className={isAuthenticated ? `${cls.authItem}` : `${cls.authItem} ${cls.hidden}`}
        >
          <AiOutlineLogout style={{ verticalAlign: 'middle', fontSize: '1.3em' }} />
        </NavLink>
      </div>
    </header>
  );
}
