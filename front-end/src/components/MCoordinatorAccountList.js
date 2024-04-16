import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../contexts/constants";

const MCoordinatorAccountList = () => {
    const [mcoordinator, setMcoordinator] = useState([]);
    useEffect(() => {
        const fetchAllMCoordinator = async () => {
            try {
                const res = await axios.get(`${apiUrl}/marketingcoordinator/`);
                console.log(res.data);
                setMcoordinator(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllMCoordinator();
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
                    {mcoordinator.map((marketing_coordinator) => {
                        return (
                            <tr key={marketing_coordinator._id}>
                                <td scope="row">{marketing_coordinator.name}</td>
                                <td> {marketing_coordinator.user.email}</td>
                                <td>{marketing_coordinator.faculty.name}</td>
                                <td>
                                    <button type="button" className="btn btn-outline-dark">
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default MCoordinatorAccountList;
