import {Route, Routes, useLocation,} from "react-router-dom";
import ContributionPage from "./pages/contribution";
import FacultyPage from "./pages/faculty";
import FacultyDetailPage from "./pages/faculty_details";
import styles from "./app.module.css";
import HomePageMarketingManager from "./pages/home_marketing_manager";
import HomePageMarketingCoordinator from "./pages/home_marketing_coordinator";
import ContributionDetailPage from "./pages/contributionDetail";
import Profile from "./pages/profile";
import EventPage from "./pages/event";
import EventDetails from "./pages/event_details";
import SubmissionDetails from "./pages/submission_detail"
import {useEffect} from "react";
import {capitalizeFirstLetter} from "./utils/common";
import {USER_ROLE} from "./shared/contain";
import Layout from "./components/_layout/layout";
import RoleBasedLayout from "./components/_layout/role-based.layout";

function App() {
    const location = useLocation();

    useEffect(() => {
        console.log(location.pathname);
        document.title = capitalizeFirstLetter(location.pathname.replace("/", ""));
    }, [location.pathname]);

    return (
        <div className={styles.abc}>
            <Routes>
                <Route path="marketing-manager"
                       element={<RoleBasedLayout
                           roles={[USER_ROLE.MARKETING_MANAGER]}
                           whenNotAllow={<div>You are not allowed to visit this page</div>}>
                           <Layout/>
                       </RoleBasedLayout>}>
                    <Route index element={<HomePageMarketingManager/>}/>
                    <Route path="Contribution" element={<ContributionPage/>}/>
                    <Route
                        path="contributionDetail/:id"
                        element={<ContributionDetailPage/>}
                    />
                    <Route path="faculty" element={<FacultyPage/>}/>
                    <Route path="faculty-detail/:id" element={<FacultyDetailPage/>}/>
                    <Route path="profile" element={<Profile/>}/>
                </Route>

                <Route path="marketing-coordinator"
                       element={<RoleBasedLayout
                           roles={[USER_ROLE.MARKETING_COORDINATOR]}
                           whenNotAllow={<div>You are not allowed to visit this page</div>}>
                           <Layout/>
                       </RoleBasedLayout>}>
                    <Route index element={<HomePageMarketingCoordinator/>}/>
                    <Route path="event" element={<EventPage/>}/>
                    <Route path="eventDetail/:id" element={<EventDetails/>}/>
                    <Route path="submissionDetail/:id" element={<SubmissionDetails/>}/>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
