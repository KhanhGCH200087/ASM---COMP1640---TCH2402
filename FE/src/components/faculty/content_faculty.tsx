import { useEffect, useState } from "react";
import styles from "./content_faculty.module.css";

const ContentFaculty = () => {
  const [facultyData, setFacultyData] = useState(null);

  const getAllFaculty = async () => {
    const response = await (
      await fetch("http://localhost:5000/faculty/")
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
      <table className={styles.table_faculty_list}>
        <thead>
          <tr className={styles.table_rows}>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {facultyData && facultyData.map(item => {
            return (
              <tr className={styles.table_rows}>
            <th>{item.name}</th>
            <th>{item.description}</th>
          </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
};
export default ContentFaculty;
