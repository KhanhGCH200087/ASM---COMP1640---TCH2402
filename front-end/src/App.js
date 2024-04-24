import Nav from './layout/Nav';
import {BrowserRouter, Routes, Route, Switch, Outlet} from 'react-router-dom';
import Footer from './components/Footer';
import Login from './components/Login';
import Add from './components/AddStudent';
import Student from './components/Student';
import MCoordinator from './components/MCoordinator';
import MManager from './components/MManager';
import Faculty from './components/Faculty';
import PersonalProfile from './components/PersonalProfile';
import ProtectedRoute from './routing/ProtectedRoute';
import Layout from "./components/_layout/layout";
import HomePageMarketingManager from "./pages/home_marketing_manager";
import ContributionPage from "./pages/contribution";
import ContributionDetailPage from "./pages/contributionDetail";
import FacultyPage from "./pages/faculty";
import FacultyDetailPage from "./pages/faculty_details";
import Profile from "./pages/profile";
import HomePageMarketingCoordinator from "./pages/home_marketing_coordinator";
import EventPage from "./pages/event";
import EventDetails from "./pages/event_details";
import SubmissionDetails from "./pages/submission_detail";
import HomePageGuest from "./pages/home_guest";
import ArticalDetail from "./pages/artical_detail";

import './App.css'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={
                    <div className={'App'}>
                        <Nav/>
                        <h1>Home</h1>
                        <Footer/>
                    </div>
                }/>

                <Route element={<Layout/>}>
                    <Route path="profile" element={<Profile/>}/>
                </Route>

                <Route element={<ProtectedRoute/>}>
                    <Route path='/view' element={<Student/>}/>
                    <Route path='/add' element={<Add/>}/>
                    <Route path='/mmanager' element={<MManager/>}/>
                    <Route path='/faculty' element={<Faculty/>}/>
                    <Route path='/profile' element={<PersonalProfile/>}/>
                    <Route path='/mcoordinator' element={<MCoordinator/>}/>
                </Route>

                <Route path="marketing-manager"
                       element={<Layout/>}>
                    <Route index element={<HomePageMarketingManager/>}/>
                    <Route path="contribution/:id" element={<ContributionPage/>}/>
                    <Route
                        path="contributionDetail/:id"
                        element={<ContributionDetailPage/>}
                    />
                    <Route path="faculty" element={<FacultyPage/>}/>
                    <Route path="faculty-detail/:id" element={<FacultyDetailPage/>}/>
                </Route>

                <Route path="marketing-coordinator"
                       element={<Layout/>}>
                    <Route index element={<HomePageMarketingCoordinator/>}/>
                    <Route path="event" element={<EventPage/>}/>
                    <Route path="eventDetail/:id" element={<EventDetails/>}/>
                    <Route path="submissionDetail/:id" element={<SubmissionDetails/>}/>
                </Route>

                <Route path="guest" element={<Layout/>}>
                    <Route index element={<HomePageGuest/>}/>
                    <Route path="articalDetail/:id" element={<ArticalDetail/>}/>
                </Route>

                <Route path='/login' element={
                    <div className={'App'}>
                        <Nav/>
                        <Login/>
                        <Footer/>
                    </div>
                }/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
