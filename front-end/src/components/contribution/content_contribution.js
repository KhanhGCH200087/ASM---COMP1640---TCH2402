//import styles from "./content_contribution.module.css";
import {Link, useParams} from "react-router-dom";
import styles from "../event/event_details.module.css"
import {useEffect, useState} from "react";
import {formatDate} from "../../utils/common";
import axios from "axios";
import {apiUrl} from "../../contexts/constants";

const ContentContribution = () => {
    const {id} = useParams();
    const [data, setData] = useState();

    const getAllEventDetails = async () => {
        const response = await axios.get(`${apiUrl}/marketingmanager/eventDetail/${id}`)
        console.log(response.data);
        setData(response.data);
    };

    useEffect(() => {
        getAllEventDetails();
    }, []);

    return (
        <div className={styles.container_event}>
            <div className={styles.event_details}>
                <div className={styles.header_event_details}>
                    <h1>Event Details</h1>
                </div>
                <div className={styles.content_event_details}>
                    <h3>Event name: <span style={{fontWeight: "normal"}}>{data && data.eventData.requirement}</span>
                    </h3>
                    <h3>Deadline 1: <span
                        style={{fontWeight: "normal"}}>{data && formatDate(data.eventData.deadline1)}</span></h3>
                    <h3>Deadline 2: <span
                        style={{fontWeight: "normal"}}>{data && formatDate(data.eventData.deadline2)}</span></h3>
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
                            <th>Student's Name</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            data ? data.chosenYesContributions.map((item, index) => {
                                if (item.choosen === "No") {
                                    console.log(item.student)
                                    return (
                                        <tr className={styles.table_rows}>
                                            <td>{item.student ? item.student.name : <></>}</td>
                                            <td>{item.date ? formatDate(item.date) : <></>}</td>
                                            <td>
                                                {
                                                    item.student && item.student._id ?
                                                        <Link
                                                            to={`/marketing-manager/contributionDetail/${item._id}`}>
                                                            <button className={styles.btn}>View</button>
                                                        </Link>
                                                        : <></>
                                                }
                                            </td>
                                        </tr>
                                    )
                                }
                                return <></>
                            }) : <></>
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default ContentContribution;
