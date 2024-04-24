import axios from 'axios'

/**
 * Get passed token, and set to Axios
 * @param token {string}
 */
const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
        delete axios.defaults.headers.common['Authorization']
    }
}

export default setAuthToken