import {useEffect, useState} from "react";
import styles from "./content_faculty.module.css";
import {Link} from "react-router-dom";
import axios from "axios";
import {apiUrl} from "../../contexts/constants";

const ContentFaculty = () => {
    const [facultyData, setFacultyData] = useState([]);

    const getAllFaculty = async () => {
        const response = await axios.get(`${apiUrl}/marketingmanager/mmpage`);
        setFacultyData(response.data.facultyData);
        
    };
    useEffect(() => {
        getAllFaculty();
    }, []);

    return (
        <div className={styles.content}>
            {/*{JSON.stringify(facultyData)}*/}
            <h1 className={styles.title}> Faculty List </h1>
            <div className={styles.table_content}>
                <table className={styles.table_faculty_list}>
                    <thead>
                    <tr className={styles.table_rows}>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {facultyData && facultyData.map((item, index) => {
                        return (
                            <tr className={styles.table_rows} key={index}>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>
                                    <Link to={`/marketing-manager/faculty-detail/${item._id}`} className={styles.btn}>
                                        View
                                    </Link>
                                </td>

                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default ContentFaculty;
