import React from "react";

const PersonalProfile = () => {

    return (
        <div class="container text-center">
            <div class="row">
                <div class="col-8 profile-background">
                    <h1>Profile</h1>
                    <ul>
                        <li>Student name: .....................</li>
                        <li>Dob: ..............................</li>
                        <li>Email: ............................</li>
                        <li>City/Town: ........................</li>
                        <li>Country: ..........................</li>
                        <li>Description: ......................</li>
                    </ul>
                </div>
                <div class="col-4">
                    <img src="./images/ProfilePictuire.png" class="img-thumbnail" alt="..." />
                </div>
            </div>
        </div>
    )
}

export default PersonalProfile;