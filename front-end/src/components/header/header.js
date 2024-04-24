import {LogOut, User} from "lucide-react";
import styles from "./header.module.css";
import {Link} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../../contexts/AuthContext";

const Header = () => {
    const {logoutUser} = useContext(AuthContext);
    const logOut = () => logoutUser()
    return (
        <div className={styles.header}>
            <div className={styles.header_button}>
                <button className={styles.profile_btn}>
                    <Link to="/profile">
                        <User color="white"/>
                    </Link>
                </button>
                <button className={styles.logout_btn} onClick={logOut}>
                    <LogOut/>
                </button>
            </div>
        </div>
    );
};
export default Header;
