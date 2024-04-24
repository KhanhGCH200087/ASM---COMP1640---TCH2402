import React, {useState, useContext} from "react";
import {Navigate} from "react-router-dom";
import {AuthContext} from "../contexts/AuthContext";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import AlertMessage from "../layout/AlertMessage";
import {USER_ROLE} from "../shared/contain";

const Login = () => {
    const {
        authState: {authLoading, isAuthenticated, user}
    } = useContext(AuthContext);

    let body;


    //Context
    const {loginUser} = useContext(AuthContext);

    //Router

    //Local state
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    });

    const [alert, setAlert] = useState(null)

    const {email, password} = loginForm;

    const onChangeLoginForm = (event) =>
        setLoginForm({...loginForm, [event.target.name]: event.target.value});

    const login = async event => {
        event.preventDefault();

        try {
            const loginData = await loginUser(loginForm);
            if (loginData.success) {
                // navigate("/");
            } else {
                setAlert({type: 'danger', message: loginData.message})
                setTimeout(() => setAlert(null), 5000)
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (authLoading)
        body = (
            <div className="d-flex justify-content-center m-5">
                <Spinner animation="border" variant="info"/>
            </div>
        );
    else if (isAuthenticated) {
        if (user.role === USER_ROLE.ADMIN) {
            return <Navigate to="/"/>
        } else if (user.role === USER_ROLE.MARKETING_MANAGER) {
            return <Navigate to={"/marketing-manager"}/>
        } else if (user.role === USER_ROLE.MARKETING_COORDINATOR) {
            return <Navigate to={"/marketing-coordinator"}/>
        } else if (user.role === USER_ROLE.GUEST) {
            return <Navigate to={"/guest"}/>
        }
    } else
        body = (
            <>
                <Form className="login-form" onSubmit={login}>
                    <AlertMessage info={alert}/>
                    <Form.Group>
                        <Form.Control
                            className="inputBox"
                            type="text"
                            placeholder="Email"
                            name="email"
                            value={email}
                            onChange={onChangeLoginForm}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            className="inputBox"
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={onChangeLoginForm}
                            required
                        />
                    </Form.Group>
                    <div>
                        <Button className="appButton" variant="info" type="submit">
                            Login
                        </Button>
                    </div>
                </Form>
            </>
        );
    return (
        <section className="login-background">
            <div className="container margin-top">
                <div className="row justify-content-center">
                    <div className="col-4 bg-white">
                        <img src="./images/LoginLogo.png" className="login-logo"/>
                    </div>
                    <div className="col-4 bg-white">
                        <div className="login-form">
                            <h1>Login</h1>
                            {body}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
