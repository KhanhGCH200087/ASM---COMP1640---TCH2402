import axios from "axios";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {apiUrl} from "../contexts/constants";

const Faculty = () => {
    const [faculty, setFaculty] = useState([]);

    useEffect(() => {
        const fetchAllFaculty = async () => {
            try {
                const res = await axios.get(`${apiUrl}/faculty/`);
                console.log(res.data);
                setFaculty(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllFaculty();
    }, []);

    const navigate = useNavigate();
    const addButton = () => {
        navigate("/add");
    };
    return (
        <div className="heading">
            <h1>Faculty</h1>
            <button
                className="btn appButton btn-info"
                type="button"
                onClick={addButton}
            >
                Add
            </button>
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
                        <th scope="col">Description</th>
                        <th scope="col"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {faculty.map((faculty) => {
                        return (
                            <tr key={faculty._id}>
                                <td>{faculty.name}</td>
                                <td>{faculty.description}</td>
                                <td>
                                    <button type="button" className="btn btn-warning">
                                        Edit
                                    </button>
                                    <button type="button" className="btn btn-danger">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Faculty;
