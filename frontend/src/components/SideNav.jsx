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
    {isAdmin
      && (
        <>
          <Link to="/events/create" className={styles.childPage}>
            Create Event
          </Link>
          <Link to="/events/groups" className={styles.childPage}>
            Groups
          </Link>
          <Link to="/events/attendance" className={styles.childPage}>
            Attendance
          </Link>
        </>
      )}
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
