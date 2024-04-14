import { Link } from "react-router-dom";
import styles from "../components/profile/profile.module.css";
import { useState } from "react";

const Profile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [userData, setUserData] = useState({
    name: "Paul",
    dob: "25/11/1998",
    email: "abc@gmail.com",
    city: "Hanoi",
    country: "Vietnam",
    description: "fhjsdf lsdlfj asdlfj lsdjfksdfkl ",
  });

  return (
    <div className={styles.content_profile}>
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
                  value={userData.name}
                  onChange={(e) => {
                    setUserData((prev) => {
                      return {
                        ...prev,
                        name: e.target.value,
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
                  type="text"
                  value={userData.dob}
                  onChange={(e) => {
                    setUserData((prev) => {
                      return {
                        ...prev,
                        dob: e.target.value,
                      };
                    });
                  }}
                  disabled={!isEdit}
                />
              </td>
            </tr>
            <tr className={styles.title_info}>
              <td>Email</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  value={userData.email}
                  onChange={(e) => {
                    setUserData((prev) => {
                      return {
                        ...prev,
                        email: e.target.value,
                      };
                    });
                  }}
                  disabled={!isEdit}
                />
              </td>
            </tr>
            <tr className={styles.title_info}>
              <td>City town</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  value={userData.city}
                  onChange={(e) => {
                    setUserData((prev) => {
                      return {
                        ...prev,
                        city: e.target.value,
                      };
                    });
                  }}
                  disabled={!isEdit}
                />
              </td>
            </tr>
            <tr className={styles.title_info}>
              <td>Country</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  value={userData.country}
                  onChange={(e) => {
                    setUserData((prev) => {
                      return {
                        ...prev,
                        country: e.target.value,
                      };
                    });
                  }}
                  disabled={!isEdit}
                />
              </td>
            </tr>
            <tr className={styles.title_info}>
              <td>Description</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  value={userData.description}
                  onChange={(e) => {
                    setUserData((prev) => {
                      return {
                        ...prev,
                        description: e.target.value,
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
          src="https://w.ladicdn.com/s550x400/616a4856fd53e600396580f1/2022-greenwich-eng-20220525041319.png"
          alt=""
        />
        <button
          className={styles.edit_profile_btn}
          onClick={() => {
            if (!isEdit) {
              // xử lý gì đó
            } else {
              // call api save userdata
              console.log(userData);
            }

            setIsEdit((s) => !s);
          }}
        >
          {isEdit ? "Save profile" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
