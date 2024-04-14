import { Link } from "react-router-dom";
import styles from "./sidebar.module.css";

const SideBar = () => {
  return (
    <div className={styles.side_bar}>
      <Link to="/">
        <img
          className={styles.img_logo}
          src="https://w.ladicdn.com/s550x400/616a4856fd53e600396580f1/2022-greenwich-eng-20220525041319.png"
          alt=""
        />
      </Link>
      <hr />
      <div className={styles.group_btn}>
        <button className={styles.btn}>
          <Link to="/" className={styles.sidebar_btn}>Home</Link>
        </button>
        <button className={styles.btn}>
          <Link to="/faculty" className={styles.sidebar_btn}>Faculty</Link>
        </button>
        <button className={styles.btn}>
          <Link to="/contribution" className={styles.sidebar_btn}>Contribution</Link>
        </button>
      </div>
    </div>
  );
};
export default SideBar;
