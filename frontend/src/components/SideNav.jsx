import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/modules/SideNav.module.scss';

const SideNav = ({ isAdmin, isEval }) => (
  <>
    <Link to="/" className={styles.parentPage}>
      Home
    </Link>
    <a href={process.env.REACT_APP_ATTENDANCE_REDIRECT} className={styles.parentPage}>
      Events
    </a>
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
        <Link to="/stations/create" className={styles.childPage}>
          Create Station
        </Link>
      )}
    <Link to="/profile" className={styles.parentPage}>
      Profile
    </Link>
  </>
);

export default SideNav;
