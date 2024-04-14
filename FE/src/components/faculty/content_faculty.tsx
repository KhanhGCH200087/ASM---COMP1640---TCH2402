import {useEffect, useState} from "react";
import styles from "./content_faculty.module.css";
import {Link} from "react-router-dom";

const ContentFaculty = () => {
    const [facultyData, setFacultyData] = useState(null);

    const getAllFaculty = async () => {
        const response = await (
            await fetch("http://localhost:3000/faculty/")
        ).json();
        setFacultyData(response.data);
        // console.log(await response);
    };

    useEffect(() => {
        getAllFaculty();
    }, []);

    return (
        <div className={styles.content}>
            {/* {JSON.stringify(facultyData)} */}
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
                    {facultyData && facultyData.map(item => {
                        return (
                            <tr className={styles.table_rows}>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td style={{}}>
                                    <Link to={`/marketing-manager/faculty-detail/1`} className={styles.btn}>
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
