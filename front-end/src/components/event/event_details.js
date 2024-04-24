import styles from "./event_details.module.css"
import {Link} from "react-router-dom";

const EventDetails = () => {
    return (
        <div className={styles.container_event}>
            <div className={styles.event_details}>
                <div className={styles.header_event_details}>
                    <h1>Event Details</h1>
                </div>
                <div className={styles.content_event_details}>
                    <h3>Event name:</h3>
                    <h3>Deadline 1:</h3>
                    <h3>Deadline 2:</h3>
                </div>
                <hr/>
            </div>
            <div className={styles.submission}>
                <div className={styles.header_submission}>
                    <h1> Submission</h1>
                </div>
                <div className={styles.table_submission}>
                    <table className={styles.table_submission_list}>
                        <thead>
                        <tr className={styles.table_rows}>
                            <th className={styles.title_table_1}>Student's Name</th>
                            <th className={styles.title_table_1}>Email</th>
                            <th className={styles.title_table_1}>Title</th>
                            <th className={styles.title_table_1}>Date</th>
                            <th className={styles.title_table_1}>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className={styles.table_rows}>
                            <td>Paul Pham</td>
                            <td>phamkhue98@gmail.com</td>
                            <td>IT</td>
                            <td>05/04/2024</td>
                            <td>
                                <Link to={"/marketing-coordinator/submissionDetail/1"}>
                                    <button className={styles.btn}>View</button>
                                </Link>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )

}
export default EventDetails