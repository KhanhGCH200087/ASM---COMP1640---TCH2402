import {Navigate, Outlet} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../contexts/AuthContext";
import Spinner from "react-bootstrap/Spinner";
import Nav from "../layout/Nav";
import Footer from "../components/Footer";

const ProtectedRoute = () => {
    const {
        authState: {authLoading, isAuthenticated},
    } = useContext(AuthContext);

    if (authLoading)
        return (
            <div>
                <Spinner animation="border" variant="info"/>
            </div>
        );
    return (
        isAuthenticated ?
            <div className={'App'}>
                <Nav/>
                <Outlet/>
                <Footer/>
            </div> :
            <Navigate to="/login"/>
    );
};

export default ProtectedRoute;
