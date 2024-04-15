import styles from "./submission_details.module.css"

const SubmissionDetails = () => {
    return (
        <div className={styles.container_submission_detail}>
            <h1 className={styles.title}> Submission's detail</h1>
            <table className={styles.table_submission_list}>
                <tr className={`${styles.table_rows}`}>
                    <th>Student's name</th>
                    <td>Paul Pham</td>
                </tr>
                <tr className={styles.table_rows}>
                    <th className={styles.th_table_contribution}>Submission Date</th>
                    <td>abc@gmail.com</td>
                </tr>
                <tr className={styles.table_rows}>
                    <th className={styles.th_table_contribution}>File Submission</th>
                    <td>
                        <div className={styles.td_filesubmission}>
                            <p className={styles.file_name}>File submission</p>
                            <button className={styles.btn_download}>View</button>
                        </div>
                    </td>
                </tr>
                <tr className={styles.table_rows}>
                    <th className={styles.th_table_contribution}>Comment</th>
                    <td>
                        <div className={styles.td_filesubmission}>
                            <button className={styles.btn_download}>Add Comment</button>
                        </div>
                    </td>
                </tr>
                <tr className={styles.table_rows}>
                    <th className={styles.th_table_contribution}>Desicion</th>
                    <td>
                        <select name="" id=""></select>
                    </td>
                </tr>
            </table>
            <div className={styles.save_sub}>
                <button className={styles.btn_save}>Save</button>
            </div>
        </div>
    )
}
export default SubmissionDetails;