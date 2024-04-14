import styles from "./content_contribution.module.css";
import {Link} from "react-router-dom";

const ContentContribution = () => {
    // const [data, setData] = useState([]);
    // // useEffect(() => {
    // //   fetch("http://localhost:5000/faculty", {
    // //     method: "POST",
    // //     body:
    // //   })
    // //     .then((res) => res.json())
    // //     .then((data) => setData(data.data));
    // // }, []);
    return (
        <div className={styles.content}>
            <h1 className={styles.title}> Contribution List </h1>
            <table className={styles.table_contribution_list}>
                <thead>
                <tr className={styles.table_rows}>
                    <th>Student's Name</th>
                    <th>Email</th>
                    <th>Faculty</th>
                    <th>Date</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                <tr className={styles.table_rows}>
                    <td>Paul Pham</td>
                    <td>phamkhue98@gmail.com</td>
                    <td>IT</td>
                    <td>05/04/2024</td>
                    <td>
                        <Link to={"/marketing-manager/contributionDetail/1"}>
                            <button className={styles.btn}>View</button>
                        </Link>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};
export default ContentContribution;
