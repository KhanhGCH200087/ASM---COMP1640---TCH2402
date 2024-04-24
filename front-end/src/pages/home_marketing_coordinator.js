import {useEffect, useState} from "react";
import styles from "../shared/style.module.css";
import axios from "axios";
import {apiUrl} from "../contexts/constants";

const HomePageMarketingCoordinator = () => {
    const [data, setData] = useState();

    async function getHomePageMarketingCoordinator() {
        const response = await axios.get(`${apiUrl}/marketingcoordinator/mcpage`);
        setData(response.data);
        console.log(response.data.facultyData);
    }

    useEffect(() => {
        getHomePageMarketingCoordinator();
    }, []);
    return (
        <>
            <div className={styles.header}>
                <h1 style={{textAlign: "center"}}>Faculty name: {data && data.facultyData.name}</h1>
            </div>
            <div className={styles.list_mc}>
                <table className={styles.table_list}>
                    <colgroup>
                        <col style={{width: '60px'}}/>
                        <col style={{width: '80px'}}/>
                        <col/>
                    </colgroup>
                    <thead>
                    <tr className={styles.table_rows}>
                        <th className={styles.title_table}>Index</th>
                        <th className={styles.title_table}>Image</th>
                        <th className={styles.title_table}>Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data && data.studentData.map((item, index) => {
                            return (
                                <tr className={styles.table_rows} key={index}>
                                    <td>{index + 1}</td>
                                    <td><img src={"data:image/png;base64, " + item.image} alt=""/></td>
                                    <td>{item.name}</td>
                                </tr>
                            )
                        }
                    )}

                    </tbody>
                </table>
            </div>
        </>
    );
}

export default HomePageMarketingCoordinator;
