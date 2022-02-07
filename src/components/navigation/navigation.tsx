import { NavLink } from 'react-router-dom';
import classes from './navigation.module.scss';

export default function Navigation() {
  return (
    <>
      <header className={classes.header}>
        <NavLink to="/auth" className={classes.nav}>
          Auth
        </NavLink>
      </header>
      <div className={classes.navigation}>
        <NavLink to="/" className={classes.nav}>
          Main
        </NavLink>
        <NavLink to="/tutorials" className={classes.nav}>
          Tutorial
        </NavLink>

        <NavLink to="/statistics" className={classes.nav}>
          Statistics
        </NavLink>
      </div>
    </>

  );
}
