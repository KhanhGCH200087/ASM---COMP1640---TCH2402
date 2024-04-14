import { Outlet, useRoutes } from "react-router-dom";
import SideBarMarketingManager from "../sidebar/sidebar_marketing-manager";
import Header from "../header/header";
import styles from "./../../app.module.css";
import SideBarMarketingCoordinator from "../sidebar/sidebar_marketing-coordinator";
import { USER_ROLE } from "../../shared/contain";

const Layout = () => {
  const checkRole = () => {
    const role = localStorage.getItem("role");

    if (!role) {
      // redirect ra man login
      window.location.href = "http://localhost:4000/login";
    } else {
      if (role === USER_ROLE.MARKETING_MANAGER) {
        return <SideBarMarketingManager />;
      } else if (role === USER_ROLE.MARKETING_COORDINATOR) {
        return <SideBarMarketingCoordinator />;
      }
    }
  };

  return (
    <>
      <div className={styles.container}>
        {checkRole()}
        <div className={styles.content}>
          <Header />
          <Outlet />
        </div>
      </div>
      <div className={styles.footer}></div>
    </>
  );
};

export default Layout;
