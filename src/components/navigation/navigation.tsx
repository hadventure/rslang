// https://dev.to/gabrlcj/react-router-v6-some-of-the-new-changes-181m
import { NavLink } from 'react-router-dom';
import cls from './navigation.module.scss';

export default function Navigation() {
  const isNavActive = (navData: { isActive: boolean }, extra: string) => {
    // console.log(navData)

    if (navData.isActive) {
      return `${cls.navLink} ${cls.navLinkActive} ${extra}`;
    }

    return `${cls.navLink} ${extra}`;
  };

  return (
    <nav className={cls.nav}>
      <div className={cls.navBorder} />

      <NavLink to="/" className={(navData) => isNavActive(navData, cls.navLinkBase)}>
        <div className={cls.navIconContainer}>
          <i>i</i>
        </div>
        <span className={cls.navLabel}>Home</span>
      </NavLink>
      <NavLink end to="/dictionary" className={(navData) => isNavActive(navData, cls.navLinkBase)}>
        <div className={cls.navIconContainer}>
          <i>i</i>
        </div>
        <span className={cls.navLabel}>Dictionary</span>
      </NavLink>
      <NavLink to="/dictionary/1" className={(navData) => isNavActive(navData, cls.navLinkSub)}>
        <div className={cls.navIconContainer}>
          <i>i</i>
        </div>
        <span className={cls.navLabel}>Part I</span>
      </NavLink>
      <NavLink to="/dictionary/2" className={(navData) => isNavActive(navData, cls.navLinkSub)}>
        <div className={cls.navIconContainer}>
          <i>i</i>
        </div>
        <span className={cls.navLabel}>Part II</span>
      </NavLink>
      <NavLink to="/dictionary/3" className={(navData) => isNavActive(navData, cls.navLinkSub)}>
        <div className={cls.navIconContainer}>
          <i>i</i>
        </div>
        <span className={cls.navLabel}>Part III</span>
      </NavLink>
      <NavLink to="/dictionary/4" className={(navData) => isNavActive(navData, cls.navLinkSub)}>
        <div className={cls.navIconContainer}>
          <i>i</i>
        </div>
        <span className={cls.navLabel}>Part VI</span>
      </NavLink>
      <NavLink to="/dictionary/5" className={(navData) => isNavActive(navData, cls.navLinkSub)}>
        <div className={cls.navIconContainer}>
          <i>i</i>
        </div>
        <span className={cls.navLabel}>Part V</span>
      </NavLink>
      <NavLink to="/dictionary/6" className={(navData) => isNavActive(navData, cls.navLinkSub)}>
        <div className={cls.navIconContainer}>
          <i>i</i>
        </div>
        <span className={cls.navLabel}>Part VI</span>
      </NavLink>

      <NavLink to="/games" end className={(navData) => isNavActive(navData, cls.navLinkBase)}>
        <div className={cls.navIconContainer}>
          <i>i</i>
        </div>
        <span className={cls.navLabel}>Games</span>
      </NavLink>
      <NavLink to="/dictionary/7" className={(navData) => isNavActive(navData, cls.navLinkSub)}>
        <div className={cls.navIconContainer}>
          <i>i</i>
        </div>
        <span className={cls.navLabel}>Savannah</span>
      </NavLink>
      <NavLink to="/dictionary/8" className={(navData) => isNavActive(navData, cls.navLinkSub)}>
        <div className={cls.navIconContainer}>
          <i>i</i>
        </div>
        <span className={cls.navLabel}>Audiocall</span>
      </NavLink>

      <NavLink to="/statistics" className={(navData) => isNavActive(navData, cls.navLinkBase)}>
        <div className={cls.navIconContainer}>
          <i>i</i>
        </div>
        <span className={cls.navLabel}>Statictics</span>
      </NavLink>

      <NavLink to="/settings" className={(navData) => isNavActive(navData, cls.navLinkBase)}>
        <div className={cls.navIconContainer}>
          <i>i</i>
        </div>
        <span className={cls.navLabel}>Settings</span>
      </NavLink>
    </nav>

  );
}
