import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import CreateListing from './pages/CreatingListing'
import UpdateListing from './pages/UpdateListing'
import PrivateRoute from './components/PrivateRoute'
import {useEffect} from 'react'

const App = () => {
  useEffect(() => {
    document.title = "RentalKuy"; // Mengatur judul halaman saat komponen dipasang
  }, []);

  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/sign-in' element={<SignIn/>} />
        <Route path='/sign-up' element={<SignUp/>} />
        <Route path='/about' element={<About/>} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile/>} />
          <Route path='/create-listing' element={<CreateListing/>} />
          <Route path='/update-listing/:listingid' element={<UpdateListing/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App