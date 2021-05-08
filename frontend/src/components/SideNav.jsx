import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/modules/SideNav.module.scss';

const SideNav = ({ isAdmin, isEval }) => (
  <>
    <Link to="/" className={styles.parentPage}>
      Home
    </Link>
    <Link to="/events" className={styles.parentPage}>
      Events
    </Link>
    <Link to="/stations" className={styles.parentPage}>
      Stations
    </Link>
    <Link to="/stations/progress" className={styles.childPage}>
      Station Progress
    </Link>
    {isEval
      && (
        <>
          <Link to="/evaluate" className={styles.childPage}>
            Evaluate
          </Link>
          <Link to="/overview" className={styles.childPage}>
            Overview
          </Link>
        </>
      )}
    {isAdmin
      && (
        <>
          <Link to="/stations/create" className={styles.parentPage}>
            Create Station
          </Link>
        </>
      )}
    <Link to="/profile" className={styles.parentPage}>
      Profile
    </Link>
  </>
);

export default SideNav;
