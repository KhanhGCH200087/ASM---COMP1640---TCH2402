import React from "react";
import { useNavigate } from "react-router-dom";
import StudentAccountList from "./StudentAccountList";

const Student = () => {
    const navigate = useNavigate()
    const addButton = () => {
        navigate('/add')
    }
    return (
        <div className="heading">
            <h1>Student</h1>
            <button className="btn appButton btn-info" type="button" onClick={addButton}>Add</button>
            <StudentAccountList />
        </div>
    )
}

export default Student;