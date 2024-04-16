import React from "react";
import { useNavigate } from "react-router-dom";
import MCoordinatorAccountList from "./MCoordinatorAccountList";

const MCoordinator = () => {
    const navigate = useNavigate();
    const addButton = () => {
        navigate("/add");
    };
    return (
        <div className="heading">
            <h1>Marketing Coordinator</h1>
            <button
                className="btn appButton btn-info"
                type="button"
                onClick={addButton}
            >
                Add
            </button>
            <MCoordinatorAccountList />
        </div>
    );
};

export default MCoordinator;
