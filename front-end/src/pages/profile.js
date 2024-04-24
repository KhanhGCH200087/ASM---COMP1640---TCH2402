import styles from "../components/profile/profile.module.css";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {apiUrl} from "../contexts/constants";
import button from "bootstrap/js/src/button";
import moment from "moment";
import {AuthContext} from "../contexts/AuthContext";
import {USER_ROLE} from "../shared/contain";

const Profile = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [userData, setUserData] = useState(null);

    const {
        authState: {authLoading, isAuthenticated, user},
    } = useContext(AuthContext);

    async function getProfile() {
        let _data
        if (user.role === USER_ROLE.MARKETING_MANAGER) {
            const response = await axios.get(apiUrl + "/marketingmanager/profile")
            _data = {
                ...response.data.MMData,
                image: 'data:image/png;base64, ' + response.data.MMData.image
            }
        }
        if (user.role === USER_ROLE.MARKETING_COORDINATOR) {
            const response = await axios.get(apiUrl + "/marketingcoordinator/profile")
            _data = {
                ...response.data.MCData,
                image: 'data:image/png;base64, ' + response.data.MCData.image
            }
        }
        // if (user.role === USER_ROLE.MARKETING_MANAGER) {
        //     const response = await axios.get(apiUrl + "/marketingmanager/profile")
        //     _data = {
        //         ...response.data.MMData,
        //         image: 'data:image/png;base64, ' + response.data.MMData.image
        //     }
        // }
        setUserData(_data)
    }

    async function editProfile(data) {
        try {
            if (user.role === USER_ROLE.MARKETING_MANAGER) {
                return await axios.post(apiUrl + `/marketingmanager/editMM/${userData._id}`, data)
            }
            if (user.role === USER_ROLE.MARKETING_COORDINATOR) {
                return await axios.put(apiUrl + `/marketingcoordinator/editMC/${userData._id}`, data)
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function editAvatar(formData) {
        try {
            if (user.role === USER_ROLE.MARKETING_MANAGER) {
                return await axios.post(apiUrl + `/marketingmanager/editMM/${userData._id}`, formData)
            }
            if (user.role === USER_ROLE.MARKETING_COORDINATOR) {
                return await axios.put(apiUrl + `/marketingcoordinator/editMC/${userData._id}`, formData)
            }
        } catch (e) {
            console.log(e);
        }

    }


    function readFile(e) {
        if (!e.target.files || !e.target.files[0]) return;

        const reader = new FileReader();
        reader.addEventListener("load", function (evt) {
            setUserData(prev => {
                return {
                    ...prev, image: evt.target.result,
                };
            });
        });
        reader.readAsDataURL(e.target.files[0]);
    }

    useEffect(() => {
        if (user) {
            getProfile()
        }
    }, [user]);

    return (<div className={styles.content_profile}>
        <div className={styles.info_profile}>
            <h1 className={styles.title_profile}>
                {!isEdit ? "Profile" : "Edit Profile"}
            </h1>
            <table className={styles.title_info_mm}>
                <tbody>
                <tr className={styles.title_info}>
                    <td>Marketing Manager Name</td>
                    <td>:</td>
                    <td>
                        <input
                            type="text"
                            value={userData ? userData.name : ""}
                            onChange={(e) => {
                                setUserData((prev) => {
                                    return {
                                        ...prev, name: e.target.value,
                                    };
                                });
                            }}
                            disabled={!isEdit}
                        />
                    </td>
                </tr>
                <tr className={styles.title_info}>
                    <td>DoB</td>
                    <td>:</td>
                    <td>
                        <input
                            type="date"
                            value={userData ? moment(userData.dob).format("YYYY-MM-DD") : ""}
                            onChange={(e) => {
                                console.log(e.target.value);
                                setUserData((prev) => {
                                    return {
                                        ...prev, dob: moment(e.target.value, "YYYY-MM-DD"),
                                    };
                                });
                            }}
                            disabled={!isEdit}
                        />
                    </td>
                </tr>
                <tr className={styles.title_info}>
                    <td>Gender</td>
                    <td>:</td>
                    <td>
                        <select value={userData ? userData.gender : ""} onChange={(e) => {
                            setUserData((prev) => {
                                return {
                                    ...prev, gender: e.target.value,
                                };
                            });
                        }} disabled={!isEdit}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </td>
                </tr>
                <tr className={styles.title_info}>
                    <td>Address</td>
                    <td>:</td>
                    <td>
                        <input
                            type="text"
                            value={userData ? userData.address : ""}
                            onChange={(e) => {
                                setUserData((prev) => {
                                    return {
                                        ...prev, address: e.target.value,
                                    };
                                });
                            }}
                            disabled={!isEdit}
                        />
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div className={styles.sidebar_profile}>
            <img
                className={styles.avatar_profile}
                src={userData ? userData.image : ""}
                alt=""
            />
            <input type="file"
                   id="myfile"
                   name="myfile"
                   accept="image/jpg,image/jpeg,image/png"
                   style={{display: "none"}}
                   onChange={(e) => {
                       readFile(e);

                       const formData = new FormData()
                       formData.append('image', e.target.files[0])
                       editAvatar(formData)
                   }}
            />
            <button className={styles.edit_profile_btn} onClick={() => {
                document.getElementById("myfile").click();
            }}>
                Upload Avatar
            </button>
            <button
                className={styles.edit_profile_btn}
                onClick={() => {
                    if (!isEdit) {
                        // xử lý gì đó
                    } else {
                        // call api save userdata
                        const _userData = {
                            ...userData,
                            image: undefined
                        }
                        editProfile(_userData)
                    }
                    setIsEdit((s) => !s);
                }}
            >
                {isEdit ? "Save profile" : "Edit Profile"}
            </button>
        </div>
    </div>);
};

export default Profile;
