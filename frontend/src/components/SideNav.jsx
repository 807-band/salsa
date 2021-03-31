import styles from "../styles/modules/SideNav.module.scss"
import React from 'react';
import { Link } from 'react-router-dom';

class SideNav extends React.Component {
   render() {
      return (
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
            <Link to="/stations/create" className={styles.parentPage}>
               Create Station
            </Link>
            <Link to="/stations" className={styles.childPage}>
               View Stations
            </Link>
            <Link to="/stations/progress" className={styles.childPage}>
               Station Progress
            </Link>
            <Link to="/evaluate" className={styles.childPage}>
               Evaluate
            </Link>
            <Link to="/overview" className={styles.childPage}>
               Overview
            </Link>
            <Link to="/profile" className={styles.parentPage}>
               Profile
            </Link>
         </>

      )
   }
}

export default SideNav;
