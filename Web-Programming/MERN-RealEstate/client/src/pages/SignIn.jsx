import {Link, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice.js';
import OAuth from '../components/OAuth.jsx';

const SignIn = () => {
  const [formData, setFormData] =  useState({});
  /*
    useSelector((state) => state.user)
    ini membuat nilai loading dan error = state.user.loading dan state.user.error
  */
  const {loading, error} = useSelector((state) => {
    return state.user || {};
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData(
      {
        ...formData,
        [e.target.id] : e.target.value,
      });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart()); // Inisialisasi data state.user
      const res = await fetch(
        // ini akan menjadi http://localhost:3000/api/auth/signup
        // baca vite.config.js untuk info lebih lanjut
        '/api/auth/signin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
      const data = await res.json();

      // Periksa apakah respons dari MongoDB berhasi menyimpan data atau tidak
      if(data.success === false){
        // Jika tidak berhasil maka
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4'>
        <input 
          type="email" 
          placeholder='Email' 
          onChange={handleChange}
          className='border p-3 rounded-lg' 
          id='email'/>
        <input 
          type="password" 
          placeholder='Password' 
          onChange={handleChange}
          className='border p-3 rounded-lg' 
          id='password'/> 
        <button 
          disabled={loading}
          onClick={handleSubmit}
          className="bg-slate-700  text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading? 'Loading...' : 'Sign In'}
        </button>
        <OAuth/>
      </form>
      <div className="font-semibold flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignIn