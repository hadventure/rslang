import {
  Outlet,
} from 'react-router-dom';
import Navigation from '../../components/navigation/navigation';
import cls from './app.module.scss';

export default function Home() {
  return (
    <>
      <Navigation />
      <main className={cls.main}>
        <Outlet />

        
      </main>
    </>
  );
}
