import {Link, useNavigate} from 'react-router-dom';
import {useState} from 'react';

const SignIn = () => {
  const [formData, setFormData] =  useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      // const usernameOrEmail = formData.username_email || '';
      // const identifier = usernameOrEmail.includes('@') ? 'email' : 'username';
      setLoading(true);
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
      const responseData = await res.json();

      // Periksa apakah respons dari MongoDB berhasi menyimpan data atau tidak
      if(responseData.success === false){
        // Jika tidak berhasil maka
        setError(responseData.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/');
    } catch (error) {
      setError(error.message);
      setLoading(false);
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