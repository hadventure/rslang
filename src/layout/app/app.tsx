import Header from '@/components/header/header';
import Levels from '@/components/levels/levels';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import Auth from '../../components/auth/auth';
import WordGroupList from '../../components/word-group-list/word-group-list';
import WordList from '../../components/word-list/word-list';
import userSelector from '../../features/user/user-selector';
import { checkUserData, resetStatus } from '../../features/user/user-slice';
import Audiocall from '../audiocall/audiocall';
import Sprint from '../sprint/sprint';
import Stat from '../stat/stat';
import cls from './app.module.scss';
import Home from './home';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(checkUserData({}));
  }, []);

  useEffect(() => {
    if (user.responseStatus === 401) {
      dispatch(resetStatus(''));
      navigate('auth');
    }
  }, [user.responseStatus]);

  return (
    <>
      <Header />
      <div className={cls.container}>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="dictionary">
              <Route index element={<WordGroupList />} />
              <Route path=":tutorial" element={<WordList />} />
              <Route path=":tutorial/audiocall" element={<Audiocall />} />
              <Route path=":tutorial/sprint" element={<Sprint />} />

            </Route>

            <Route path="games">
              <Route index element={<div>games</div>} />
              <Route path="audiocall" element={<Levels />} />
              <Route path="audiocall/:tutorial" element={<div>audiocall</div>} />
              <Route path="sprint" element={<Levels />} />
              <Route path="sprint/:tutorial" element={<Sprint />} />
            </Route>

            <Route path="/statistics" element={<Stat />} />
          </Route>

          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
