import {createContext, useReducer, useEffect} from "react";
import {authReducer} from "../reducers/authReducer";
import {apiUrl, LOCAL_STORAGE_TOKEN_NAME, LOCAL_URL} from "./constants";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

export const AuthContext = createContext();

/**
 * Check if localStorage has token
 * -> then set token to axios
 */
function setToken() {
    if (localStorage[LOCAL_STORAGE_TOKEN_NAME]) {
        setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME]);
    }
}

const AuthContextProvider = ({children}) => {
    // trigger at first access
    setToken()

    const [authState, dispatch] = useReducer(authReducer, {
        authLoading: true,
        isAuthenticated: false,
        user: null,
    });


    const loadUser = async () => {
        setToken()

        try {
            const response = await axios.get(`${apiUrl}/auth`);
            if (response.data.success) {
                dispatch({
                    type: "SET_AUTH",
                    payload: {isAuthenticated: true, user: response.data.user},
                });
            }
        } catch (error) {
            localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
            setAuthToken(null);
            dispatch({
                type: "SET_AUTH",
                payload: {isAuthenticated: false, user: null},
            });
        }
    };

    useEffect(() => {
        void loadUser();
    }, [
        // run at the first render
    ]);

    const loginUser = async (userForm) => {
        try {
            const response = await axios.post(`${apiUrl}/auth/login`, userForm);
            if (response.data.success)
                localStorage.setItem(
                    LOCAL_STORAGE_TOKEN_NAME,
                    response.data.accessToken
                );
            await loadUser();

            return response.data;
        } catch (error) {
            if (error.response.data) return error.response.data;
            else return {success: false, message: error.message};
        }
    };

    const logoutUser = () => {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
        dispatch({
            type: "SET_AUTH",
            payload: {isAuthenticated: false, user: null},
        });
        window.location.href = LOCAL_URL + '/login';
    };

    const authContextData = {loginUser, logoutUser, authState};

    return (
        <AuthContext.Provider value={authContextData}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
