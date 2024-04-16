import './App.css';
import Nav from './layout/Nav';
import { BrowserRouter, Routes, Route, Switch } from 'react-router-dom';
import Footer from './components/Footer';
import Login from './components/Login';
import Add from './components/AddStudent';
import Student from './components/Student';
import MCoordinator from './components/MCoordinator';
import MManager from './components/MManager';
import Faculty from './components/Faculty';
import PersonalProfile from './components/PersonalProfile';
import ProtectedRoute from './routing/ProtectedRoute';

function App() {
  return (

    <div className="App">
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path='/' element={<h1>Home</h1>} />
          <Route element={<ProtectedRoute />}>
            <Route path='/view' element={<Student />} />
            <Route path='/add' element={<Add />} />
            <Route path='/mmanager' element={<MManager />} />
            <Route path='/faculty' element={<Faculty />} />
            <Route path='/profile' element={<PersonalProfile />} />
            <Route path='/mcoordinator' element={<MCoordinator />} />
          </Route>
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
      <Footer />

    </div>
  );
}

export default App;
