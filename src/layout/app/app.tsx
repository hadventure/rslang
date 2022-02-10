import Header from '@/components/header/header';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import Auth from '../../components/auth/auth';
import Navigation from '../../components/navigation/navigation';
import WordGroupList from '../../components/word-group-list/word-group-list';
import WordList from '../../components/word-list/word-list';
import userSelector from '../../features/user/user-selector';
import { resetStatus } from '../../features/user/user-slice';
import Stat from '../stat/stat';
import cls from './app.module.scss';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const navigate = useNavigate();

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

        <Navigation />
        <main className={cls.main}>
          <Routes>
            <Route path="/" element={<div>Main</div>} />
            <Route path="dictionary">
              <Route index element={<WordGroupList />} />
              <Route path=":tutorial" element={<WordList />} />
            </Route>

            <Route path="/statistics" element={<Stat />} />
            <Route path="/auth" element={<Auth />} />

          </Routes>

        </main>
      </div>
    </>
  );
}

export default App;
