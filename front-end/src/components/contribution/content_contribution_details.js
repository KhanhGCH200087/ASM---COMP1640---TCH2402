import styles from "./content_contribution.module.css";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {formatDate} from "../../utils/common";

const ContentContributionDetail = () => {
    const id = useParams()
    const [data, setData] = useState()

    async function getContributionDetail() {
        const response = await fetch(`http://localhost:3000/marketingmanager/contributionDetail/${id.id}`)
        const _data = await response.json()

        setData(_data.data)
        console.log(_data.data);
    }

    useEffect(() => {
        getContributionDetail();
    }, []);

    return (
        <div>
            <h1 className={styles.title}> Submission's detail</h1>
            <table className={styles.table_contribution_list}>
                <tr className={`${styles.table_rows}`}>
                    <th>Student's name</th>
                    <td>{data && data.student ? data.student.name : <></>}</td>
                </tr>
                <tr className={styles.table_rows}>
                    <th className={styles.th_table_contribution}>Email</th>
                    <td>{data && data.student ? data.student.email : <></>}</td>
                </tr>
                <tr className={styles.table_rows}>
                    <th className={styles.th_table_contribution}>Faculty</th>
                    <td></td>
                </tr>
                <tr className={styles.table_rows}>
                    <th className={styles.th_table_contribution}>Submission date</th>
                    <td>{data && formatDate(data.date)}</td>
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
                    <td></td>
                </tr>
                <tr className={styles.table_rows}>
                    <th className={styles.th_table_contribution}>Comment</th>
                    <td>{data && data.comment ? data.comment : <></>}</td>
                </tr>
            </table>
        </div>
    );
};
export default ContentContributionDetail;
