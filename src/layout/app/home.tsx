import {
  Outlet,
} from 'react-router-dom';
import Navigation from '../../components/navigation/navigation';
import cls from './app.module.scss';

type HomeProps = {
  isAuthenticated: boolean
};

export default function Home({ isAuthenticated }: HomeProps) {
  return (
    <>
      <Navigation isAuthenticated={isAuthenticated} />
      <main className={cls.main}>
        <Outlet />

      </main>
    </>
  );
}
