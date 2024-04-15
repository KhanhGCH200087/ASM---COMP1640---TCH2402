import styles from "./faculty_details.module.css"
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

const FacultyDetail = () => {
    const {id} = useParams()


    const [data, setData] = useState();

    const getAllFacultyDetail = async () => {
        const response = await (
            await fetch(`http://localhost:3000/marketingmanager/facultyDetail/${id}`)
        ).json();
        setData(response);
        console.log(response.StudentData)
    };

    useEffect(() => {
        getAllFacultyDetail();
    }, []);

    return (
        <>
            <div className={styles.header}>
                <h1 style={{textAlign: "center", padding: "20px"}}>Faculty Detail</h1>
                <p style={{padding: "10px"}}>Event name: {data && data.eventData.map((item, index) => {
                    return <a key={index} href={'/'}>{item.requirement}</a>
                })}</p>
                <p style={{padding: "10px"}}>Marketing Coordinator:  {data && data.MCData.map(item => item.name).join(', ')}</p>
            </div>
            <hr/>
            <h1 style={{padding: "10px"}}>Student List</h1>
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
                    {data && data.StudentData.map((item, index) =>{
                        return (
                            <tr className={styles.table_rows} key={index}>
                                <td>{index+1}</td>
                                <td>{item.image}</td>
                                <td>{item.name}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </>
    )
}
export default FacultyDetail