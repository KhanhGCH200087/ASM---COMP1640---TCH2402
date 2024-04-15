import styles from "./faculty_details.module.css"
import {useEffect, useState} from "react";

const FacultyDetail = () => {
    return (
        <>
            <div className={styles.header}>
                <h1 style={{textAlign:"center", padding: "20px"}}>Faculty Detail</h1>
                <p style={{padding:"10px"}}>Event name:</p>
                <p style={{padding:"10px"}}>Marketing Coordinator:</p>
            </div>
            <hr/>
            <h1 style={{padding:"10px"}}>Student List</h1>
            <div className={styles.list_mc}>
                <table className={styles.table_list}>
                    <colgroup>
                        <col style={{width: '60px'}}/>
                        <col style={{width: '80px'}}/>
                        <col/>
                    </colgroup>
                    <thead>
                    <tr className={styles.table_rows}>
                        <th>Index</th>
                        <th>Image</th>
                        <th>Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className={styles.table_rows}>
                        <td>1</td>
                        <td><img
                            src="https://w.ladicdn.com/s550x400/616a4856fd53e600396580f1/2022-greenwich-eng-20220525041319.png"
                            alt="" className={styles.img_mc}/></td>
                        <td>Khue Pham</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}
export default FacultyDetail