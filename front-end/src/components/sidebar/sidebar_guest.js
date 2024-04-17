import styles from "./sidebar.module.css";
import {Link} from "react-router-dom";

const SideBarGuest = () => {
    return (
        <div className={styles.side_bar}>
            <Link to="/marketing-coordinator">
                <img
                    className={styles.img_logo}
                    src="https://w.ladicdn.com/s550x400/616a4856fd53e600396580f1/2022-greenwich-eng-20220525041319.png"
                    alt=""
                />
            </Link>
            <hr/>
        </div>
    )
}
export default SideBarGuest;