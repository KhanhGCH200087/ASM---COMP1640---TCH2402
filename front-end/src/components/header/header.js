import {LogOut, User} from "lucide-react";
import styles from "./header.module.css";
import {Link} from "react-router-dom";

const Header = () => {
    return (
        <div className={styles.header}>
            <div className={styles.header_button}>
                <button className={styles.profile_btn}>
                    <Link to="/marketing-manager/profile">
                        <User color="white"/>
                    </Link>
                </button>
                <button className={styles.logout_btn}>
                    <LogOut/>
                </button>
            </div>
        </div>
    );
};
export default Header;
