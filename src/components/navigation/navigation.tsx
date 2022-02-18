// https://dev.to/gabrlcj/react-router-v6-some-of-the-new-changes-181m
// https://github.com/remix-run/react-router/pull/7326
import { resetCurrentWord, setGroup, setPageWords } from '@/features/words/words-slice';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  NavLink, useLocation,
} from 'react-router-dom';
import {
  AiFillCustomerService, AiOutlineFieldTime,
  AiOutlineBook, AiOutlineHome, AiOutlineLineChart, AiOutlineTrophy,
  AiOutlineMenu,
} from 'react-icons/ai';

import cls from './navigation.module.scss';

interface DictionaryState {
  dictionary: string;
}

export default function Navigation() {
  const [collapsed, setCollapsed] = useState(true);

  const dispatch = useDispatch();
  const location = useLocation();

  const state = location.state as DictionaryState;

  useEffect(() => {
    if (location.state) {
      dispatch(setGroup(state.dictionary));
      dispatch(setPageWords(0));
      dispatch(resetCurrentWord({}));
    }
  }, [location]);

  const isNavActive = (navData: { isActive: boolean }, extra: string) => {
    // console.log(navData)

    if (navData.isActive) {
      return `${cls.navLink} ${cls.navLinkActive} ${extra}`;
    }

    return `${cls.navLink} ${extra}`;
  };

  const toggleNav = () => {
    setCollapsed(!collapsed);
  };

  return (
    <nav
      className={`${cls.nav} ${cls.navAdaptive} ${collapsed ? cls.navCollapsed : ''}`}
    >
      <div className={cls.navBorder}>
        <button type="button" className={cls.navToggle} onClick={toggleNav}>
          <AiOutlineMenu style={{ verticalAlign: 'middle' }} color="#eee" size="1.3em" />
        </button>
      </div>

      <NavLink to="/" className={(navData) => isNavActive(navData, cls.navLinkBase)}>
        <div className={cls.navIconContainer}>
          <AiOutlineHome size="1.3em" />
        </div>
        <span className={cls.navLabel}>Home</span>
      </NavLink>
      <NavLink end to="/dictionary" className={(navData) => isNavActive(navData, cls.navLinkBase)}>
        <div className={cls.navIconContainer}>
          <AiOutlineBook size="1.3em" />
        </div>
        <span className={cls.navLabel}>Dictionary</span>
      </NavLink>
      <NavLink to="/dictionary/0" state={{ dictionary: '0' }} className={(navData) => isNavActive(navData, cls.navLinkSub)}>
        <div className={cls.navIconContainer}>
          <i className={`${cls.part} ${cls.p1}`} />
        </div>
        <span className={cls.navLabel}>Part I</span>
      </NavLink>
      <NavLink to="/dictionary/1" state={{ dictionary: '1' }} className={(navData) => isNavActive(navData, cls.navLinkSub)}>
        <div className={cls.navIconContainer}>
          <i className={`${cls.part} ${cls.p2}`} />
        </div>
        <span className={cls.navLabel}>Part II</span>
      </NavLink>
      <NavLink to="/dictionary/2" state={{ dictionary: '2' }} className={(navData) => isNavActive(navData, cls.navLinkSub)}>
        <div className={cls.navIconContainer}>
          <i className={`${cls.part} ${cls.p3}`} />
        </div>
        <span className={cls.navLabel}>Part III</span>
      </NavLink>
      <NavLink to="/dictionary/3" state={{ dictionary: '3' }} className={(navData) => isNavActive(navData, cls.navLinkSub)}>
        <div className={cls.navIconContainer}>
          <i className={`${cls.part} ${cls.p4}`} />
        </div>
        <span className={cls.navLabel}>Part VI</span>
      </NavLink>
      <NavLink to="/dictionary/4" state={{ dictionary: '4' }} className={(navData) => isNavActive(navData, cls.navLinkSub)}>
        <div className={cls.navIconContainer}>
          <i className={`${cls.part} ${cls.p5}`} />
        </div>
        <span className={cls.navLabel}>Part V</span>
      </NavLink>
      <NavLink to="/dictionary/5" state={{ dictionary: '5' }} className={(navData) => isNavActive(navData, cls.navLinkSub)}>
        <div className={cls.navIconContainer}>
          <i className={`${cls.part} ${cls.p6}`} />
        </div>
        <span className={cls.navLabel}>Part VI</span>
      </NavLink>

      <NavLink to="/games" end className={(navData) => isNavActive(navData, cls.navLinkBase)}>
        <div className={cls.navIconContainer}>
          <AiOutlineTrophy size="1.3em" />
        </div>
        <span className={cls.navLabel}>Games</span>
      </NavLink>
      <NavLink to="/games/sprint" className={(navData) => isNavActive(navData, cls.navLinkSub)}>
        <div className={cls.navIconContainer}>
          <AiOutlineFieldTime size="1.3em" />
        </div>

        <span className={cls.navLabel}>Sprint</span>
      </NavLink>
      <NavLink to="/games/audiocall" className={(navData) => isNavActive(navData, cls.navLinkSub)}>
        <div className={cls.navIconContainer}>
          <AiFillCustomerService size="1.3em" />

        </div>
        <span className={cls.navLabel}>Audiocall</span>
      </NavLink>

      <NavLink to="/statistics" className={(navData) => isNavActive(navData, cls.navLinkBase)}>
        <div className={cls.navIconContainer}>
          <AiOutlineLineChart size="1.3em" />
        </div>
        <span className={cls.navLabel}>Statictics</span>
      </NavLink>
    </nav>

  );
}
