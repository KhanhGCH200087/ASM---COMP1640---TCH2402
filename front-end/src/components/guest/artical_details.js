import styles from "./artical_details.module.css"

const ContentArticalDetail = () => {
    return (
        <div className={styles.container_submission_detail}>
            <h1 className={styles.title}> Artical's detail</h1>
            <table className={styles.table_submission_list}>
                <tr className={`${styles.table_rows}`}>
                    <th>Student's name</th>
                    <td>Paul Pham</td>
                </tr>
                <tr className={styles.table_rows}>
                    <th className={styles.th_table_contribution}>Email</th>
                    <td>abc@gmail.com</td>
                </tr>
                <tr className={styles.table_rows}>
                    <th className={styles.th_table_contribution}>Faculty</th>
                    <td>abc@gmail.com</td>
                </tr>
                <tr className={styles.table_rows}>
                    <th className={styles.th_table_contribution}>File submission</th>
                    <td>
                        <div className={styles.td_filesubmission}>
                            <p className={styles.file_name}>File submission</p>
                            <button className={styles.btn_download}>Dowload</button>
                        </div>
                    </td>
                </tr>

            </table>
        </div>
    )
}
export default ContentArticalDetail