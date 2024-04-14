import { Link } from "react-router-dom";
import styles from "./sidebar.module.css";

const SideBarMarketingCoordinator = () => {
  return (
    <div className={styles.side_bar}>
      <Link to="/marketing-coordinator">
        <img
          className={styles.img_logo}
          src="https://w.ladicdn.com/s550x400/616a4856fd53e600396580f1/2022-greenwich-eng-20220525041319.png"
          alt=""
        />
      </Link>
      <hr />
      <div className={styles.group_btn}>
      <button className={styles.btn}>
          <Link to="/marketing-coordinator" className={styles.sidebar_btn}>
            Home
          </Link>
        </button>
        <button className={styles.btn}>
          <Link to="/marketing-coordinator/event" className={styles.sidebar_btn}>
            Event
          </Link>
        </button>
      </div>
    </div>
  );
};
export default SideBarMarketingCoordinator;
