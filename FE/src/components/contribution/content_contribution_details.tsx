import styles from "./content_contribution.module.css";
import { useEffect } from "react";

const ContentContributionDetail = () => {
  return (
    <div>
      <h1 className={styles.title}> Submission's detail</h1>
      <table className={styles.table_contribution_list}>
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
          <th className={styles.th_table_contribution}>Submission date</th>
          <td>abc@gmail.com</td>
        </tr>
        <tr className={styles.table_rows}>
          <th className={styles.th_table_contribution}>File submission</th>
          <td>
            <div className={styles.td_filesubmission}>
              <p className={styles.file_name}>File submission</p>
              <button className={styles.btn_download}>Download</button>
            </div>
          </td>
        </tr>
        <tr className={styles.table_rows}>
          <th className={styles.th_table_contribution}>Coordinatoor</th>
          <td>abc@gmail.com</td>
        </tr>
        <tr className={styles.table_rows}>
          <th className={styles.th_table_contribution}>Comment</th>
          <td>abc</td>
        </tr>
      </table>
    </div>
  );
};
export default ContentContributionDetail;
