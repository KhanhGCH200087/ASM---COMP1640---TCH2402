import React from "react";
import {useNavigate} from "react-router-dom";
import MManagerAccountList from "./MManagerAccountList";

const MManager = () => {
    const navigate = useNavigate();
    const addButton = () => {
        navigate("/add");
    };
    return (
        <div className="heading">
            <h1>Makerting Manager</h1>
            <button
                className="btn appButton btn-info"
                type="button"
                onClick={addButton}
            >
                Add
            </button>
            <MManagerAccountList/>
        </div>
    );
};

export default MManager;
