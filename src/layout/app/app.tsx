import Header from '@/components/header/header';
import Levels from '@/components/levels/levels';
import statSelector from '@/features/stat/stat-selector';
import { getStatData } from '@/features/stat/stat-thunks';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  NavLink,
} from 'react-router-dom';
import rslogo from '@/assets/rs_school_js.svg';
import githublogo from '@/assets/github-logo.svg';
import Auth from '../../components/auth/auth';
import WordGroupList from '../../components/word-group-list/word-group-list';
import WordList from '../../components/word-list/word-list';
import userSelector from '../../features/user/user-selector';
import { checkUserData, resetStatus } from '../../features/user/user-slice';
import Audiocall from '../audiocall/audiocall';
import Difficult from '../difficult/difficult';
import Main from '../main/main';
import Sprint from '../sprint/sprint';
import Stat from '../stat/stat';
import cls from './app.module.scss';
import Home from './home';
import About from '../about/about';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const stat = useSelector(statSelector);
  const navigate = useNavigate();
  const location = useLocation();
  const isGame = location.pathname.indexOf('sprint') > -1 || location.pathname.indexOf('audiocall') > -1;

  useEffect(() => {
    dispatch(checkUserData());
  }, []);

  useEffect(() => {
    if (user.responseStatus === 401) {
      dispatch(resetStatus(''));
      navigate('auth');
    }
  }, [user.responseStatus]);

  useEffect(() => {
    if (user.isAuth) {
      dispatch(getStatData({}));
    }
  }, [user.isAuth]);

  if (user.isAuth !== null) {
    return (
      <>
        <Header isAuthenticated={user.isAuth} />
        <div className={isGame ? cls.containerNoFooter : cls.container}>
          <Routes>
            <Route path="/" element={<Home isAuthenticated={user.isAuth} />}>
              <Route path="/" element={<Main user={user} />} />
              <Route path="/home" element={<Main user={user} />} />
              <Route path="/about" element={<About />} />

              <Route path="dictionary">
                <Route index element={<WordGroupList isAuth={user.isAuth} />} />

                {
                  user.isAuth && stat.stat
                    ? (
                      <>
                        {/* <Route path="difficult" element={<Difficult />} /> */}
                        <Route path=":tutorial" element={<WordList pages={stat.stat.optional!.pages!} />} />
                        <Route path=":tutorial/audiocall" element={<Audiocall user={user} pages={stat.stat.optional!.pages!} />} />

                      </>
                    )
                    : (
                      <>
                        <Route path=":tutorial" element={<WordList pages={undefined} />} />
                        <Route path=":tutorial/audiocall" element={<Audiocall user={user} pages={undefined} />} />
                      </>
                    )
                }

                <Route path=":tutorial/sprint" element={<Sprint />} />

              </Route>

              <Route path="difficult">
                <Route index element={<Difficult />} />
              </Route>

              <Route path="games">
                {/* <Route index element={<div>games</div>} /> */}
                <Route path="audiocall" element={<Levels />} />
                <Route path="audiocall/:tutorial" element={<Audiocall user={user} />} />
                <Route path="sprint" element={<Levels />} />
                <Route path="sprint/:tutorial" element={<Sprint />} />
              </Route>

              <Route path="/statistics" element={<Stat stat={stat.stat} />} />
            </Route>

            <Route path="/auth" element={<Auth user={user} />} />
          </Routes>

        </div>
        {
          isGame
            ? null
            : (
              <footer className={cls.footer}>
                <div>2022</div>
                <div className={cls.logoWrap}>
                  <NavLink target="_blank" to="https://rs.school/js/">
                    <img className={cls.rslogo} src={rslogo} alt="" />
                  </NavLink>
                  <NavLink target="_blank" to="https://github.com/lan3945663">
                    <img className={cls.githublogo} src={githublogo} alt="" />
                  </NavLink>
                </div>
              </footer>
            )
          }
      </>
    );
  }
  return null;
}

export default App;
