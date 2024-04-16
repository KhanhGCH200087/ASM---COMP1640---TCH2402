import React from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import Button from 'react-bootstrap/Button'

const Nav = () => {
    const auth = localStorage.getItem('test');
    const { logoutUser } = useContext(AuthContext)
    const logout = () => logoutUser()
    return (
        <div>
            <Link to="/"><img alt='logo' className="logo" src="./images/UoG.png" /></Link>

            {
                auth ?
                    <ul className="nav-ul">
                        <li><Link to="/view">Student</Link></li>
                        <li><Link to="/mcoordinator">Marketing Coordinator</Link></li>
                        <li><Link to="/mmanager">Makerting Manager</Link></li>
                        <li><Link to="/faculty">Faculty</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><i className="bi bi-chat-fill"></i></li>
                        <li style={{ float: "right" }}>
                            <Button variant="danger" onClick={logout}>Logout</Button>
                        </li>
                    </ul>
                    :
                    <ul className="nav-ul nav-right">
                        <li><Link to="/login">Login</Link></li>
                    </ul>
            }



        </div>
    )
}

export default Nav;