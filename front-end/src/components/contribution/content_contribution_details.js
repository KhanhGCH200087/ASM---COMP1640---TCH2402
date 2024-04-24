import styles from "./content_contribution.module.css";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {formatDate} from "../../utils/common";
import axios from "axios";
import {apiUrl} from "../../contexts/constants";

const ContentContributionDetail = () => {
    const id = useParams()
    const [data, setData] = useState()

    async function getContributionDetail() {
        const response = await axios.get(`${apiUrl}/marketingmanager/contributionDetail/${id.id}`)

        setData(response.data)
        console.log(response.data);
    }

    async function DownloadFile() {
        const _data = await axios.get(`${apiUrl}/marketingmanager/download/${id}`)
        setData(_data.data)
        console.log(_data.data)
    }

    useEffect(() => {
        getContributionDetail();
        DownloadFile();
    }, []);

    return (
        <div>
            <h1 className={styles.title}> Submission's detail</h1>
            <div className={styles.table_submissionDetail}>
                <table className={styles.table_contribution_list}>
                    <tr className={`${styles.table_rows}`}>
                        <th className={styles.th_table_contribution}>Student's name</th>
                        <td>{data && data.data.student ? data.data.student.name : <></>}</td>
                    </tr>
                    <tr className={styles.table_rows}>
                        <th className={styles.th_table_contribution}>Faculty</th>
                        <td>{data && data.faculty.faculty.name ? data.faculty.faculty.name : <></>}</td>
                    </tr>
                    <tr className={styles.table_rows}>
                        <th className={styles.th_table_contribution}>Submission date</th>
                        <td>{data && formatDate(data.data.date)}</td>
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
                        <th className={styles.th_table_contribution}>Comment</th>
                        <td>{data && data.data.comment ? data.data.comment : <></>}</td>
                    </tr>
                </table>
            </div>
        </div>
    );
};
export default ContentContributionDetail;
