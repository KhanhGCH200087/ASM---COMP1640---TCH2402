import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../contexts/constants";

const StudentAccountList = () => {
    const [student, setStudent] = useState([]);
    useEffect(() => {
        const fetchAllStudent = async () => {
            try {
                const res = await axios.get(`${apiUrl}/student/`);
                console.log(res.data)
                setStudent(res.data.data)
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllStudent();
    }, []);
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-4">
                    <form className="d-flex" role="search">
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                        />
                        <button className="btn btn-outline-success" type="submit">
                            Search
                        </button>
                    </form>
                </div>
            </div>
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Faculty</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {student.map((student) => {
                        return <tr key={student._id}>
                            <td scope="row">{student.name}</td>
                            <td>
                                {student.user.email}
                            </td>
                            <td>{student.faculty.name}</td>
                            <td>
                                <button type="button" className="btn btn-outline-dark">
                                    Detail
                                </button>
                            </td>
                        </tr>
                    })}

                </tbody>
            </table>
        </div >
    );
};

export default StudentAccountList;
