import { Outlet } from "react-router-dom";
import SideBar from "../sidebar/sidebar";
import Header from "../header/header";
import styles from "./../../app.module.css";

const MarketingLayout = () => {
  return (
    <>
      <div className={styles.container}>
        <SideBar />
        <div className={styles.content}>
          <Header />
          <Outlet />
        </div>
      </div>
      <div className={styles.footer}></div>
    </>
  );
};

export default MarketingLayout;
