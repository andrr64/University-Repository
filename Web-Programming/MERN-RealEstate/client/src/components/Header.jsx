import { FaSearch } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'  


export default function Header() {
    const {currentUser} = useSelector(state => state.user);
    return (
        <header className="bg-slate-200 shadow-md"> 
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
                <Link to='/'>
                    <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                        <span className="text-slate-500">Rental</span>
                        <span className="text-slate-700">Kuy</span>
                    </h1>
                </Link>
                <form className="rounded-lg bg-slate-100 p-3 flex items-center">
                    <input type="text" placeholder="Search.." 
                    className="bg-transparent focus:outline-none w-24 sm:w-64"/>
                    <FaSearch/>
                </form>
                <ol className='flex gap-4'>
                    <Link to='/home'>
                        <li className='hidden sm:inline text-color-slate-700 hover:underline'>Home</li>
                    </Link>
                    <Link to='/about'>
                        <li className='hidden sm:inline text-color-slate-700 hover:underline'>About</li>
                    </Link>
                    
                    <Link to='/profile'>
                        {currentUser? (
                            <img
                            className='rounded-full h-7 w-7 object-cover' 
                            src={currentUser.avatar} alt="profile" />
                        ) : (
                            <li className='hidden sm:inline text-color-slate-700 hover:underline'>Sign In</li>
                        )}
                    </Link>
                </ol>
            </div> 
        </header>
    )
}