import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Profile from './Components/Profile';
import Login from './Components/Login';
import Pengguna from './Components/Master/Pengguna';
import Kelas from './Components/Master/Kelas';
import KelasSiswa from './Components/Master/KelasSiswa';
import Register from './Components/Register';
import Lockscreen from './Components/Lockscreen';
import VerificationAkun from './Components/VerificationAkun';
import Layout from './Layout/Layout';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/verifikasiAkun' element={<VerificationAkun />} />
        <Route path='/lockscreen' element={<Lockscreen />} />
        <Route exact path='/dashboard' element={<div className='wrapper'><Layout /><Dashboard title='Dashboard'/></div>} />
        <Route exact path='/profile' element={<div className='wrapper'><Layout /><Profile title='Profile'/></div>} />
        <Route path='/pengguna' element={<div className='wrapper'><Layout /><Pengguna /></div>} />
        <Route path='/kelas' element={<div className='wrapper'><Layout /><Kelas /></div>} />
        <Route path='/kelassiswa' element={<div className='wrapper'><Layout /><KelasSiswa /></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
