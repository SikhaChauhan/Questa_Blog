import React, { useState, useEffect } from 'react';
import { Dropdown, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';
import { SlArrowDown } from "react-icons/sl";
import { HiOutlineMenu } from 'react-icons/hi';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiChartPie,
} from 'react-icons/hi';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user) || {}; // Default to empty object if null
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    setSearchTerm(searchTermFromUrl || '');
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/users/sign-out', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate('/sign-in'); 
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === '') {
      setError('Type something to search');
      navigate('/search'); 
      return;
    }
    setError('');
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className='relative z-20 text-white bg-black border-b-2'>
      <div className='flex items-center justify-between p-4 ml-2'>
        <div className='flex items-center'>
          {/* Sidebar Menu Button */}
          <button
            className='mr-2 font-bold text-white lg:hidden md:hidden'
            onClick={() => setIsSidebarOpen(true)}
          >
            <HiOutlineMenu className='w-8 h-8' />
          </button>
          
          <Link to='/'>
            <img
              src='/assets/logo4.png'
              className='h-10 ml-2 bg-white rounded w-30 md:h-16 md:w-38 sm:h-10'
              alt='Logo'
            />
          </Link>
        </div>
        <div className='relative lg:hidden md:left-12'>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='font-bold'
            style={{ fontSize: isMenuOpen ? '1.3rem' : '1.7rem ' }}
          >
            {isMenuOpen ? '✖' : <SlArrowDown />}
          </button>
          {isMenuOpen && (
            <div className="absolute z-50 w-48 text-white transform -translate-x-1/2 bg-black rounded-md mt-9 left-1/2">
              <div className="flex flex-col items-center py-2">
                <Link
                  to='/'
                  className={`py-2 px-4 ${isActive('/') ? 'text-cyan-300' : 'hover:text-pink-500'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to='/about'
                  className={`py-2 px-4 ${isActive('/about') ? 'text-cyan-300' : 'hover:text-pink-500'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to='/allPost'
                  className={`py-2 px-4 ${isActive('/allPost') ? 'text-cyan-300' : 'hover:text-pink-500'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Posts
                </Link>
                <Link
                  to='/contact'
                  className={`py-2 px-4 ${isActive('/contact') ? 'text-cyan-300' : 'hover:text-pink-500'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className='rounded lg:flex w-42'>
          <TextInput
            type='text'
            placeholder='Search...'
            className='font-bold'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <div className='hidden gap-20 lg:flex'>
          <Link
            to='/'
            className={`font-bold transition-colors duration-300 ${isActive('/') ? 'text-cyan-400' : 'text-white hover:text-pink-500'}`}
          >
            Home
          </Link>
          <Link
            to='/about'
            className={`font-bold transition-colors duration-300 ${isActive('/about') ? 'text-cyan-400' : 'text-white hover:text-pink-500'}`}
          >
            About
          </Link>
          <Link
            to='/allPost'
            className={`font-bold transition-colors duration-300 ${isActive('/allPost') ? 'text-cyan-400' : 'text-white hover:text-pink-500'}`}
          >
            All Posts
          </Link>
          <Link
            to='/contact'
            className={`font-bold transition-colors duration-300 ${isActive('/contact') ? 'text-cyan-400' : 'text-white hover:text-pink-500'}`}
          >
            Contact
          </Link>
        </div>
        <div className='mr-3'>
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <img
                  src={currentUser.profilePicture}
                  alt='user'
                  className='w-16 h-16 border-2 border-white rounded-full'
                  referrerPolicy="no-referrer"
                />
              }
              className='relative z-30'
            >
              <Link to={`/profile/${currentUser._id}`}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to='/sign-in'>
              <span className='px-2 py-1 mt-2 font-bold text-white'>
                Sign In
              </span>
            </Link>
          )}
        </div>
      </div>
      {/* Sidebar Component */}
      <div
        className={`fixed top-0 left-0 h-full w-56 bg-black border-r border-gray-500 text-white transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:relative  lg:w-64 lg:hidden md:hidden`}
      >
        <button
          className='absolute text-white top-4 right-4 lg:hidden md:hidden'
          onClick={() => setIsSidebarOpen(false)}
        >
          ✖
        </button>
        <p className="flex items-center pl-10 mt-5 ml-2 text-lg font-bold">
          Main Menu
        </p>
        <div className="flex flex-col gap-1 p-4 mt-6">
          {currentUser && currentUser.isAdmin && (
            <>
            <Link to="/dashboard?tab=dash">
              <div
                className={`cursor-pointer p-2 flex items-center rounded ${
                  isActive('dash') ? 'bg-white text-black' : 'text-white hover:bg-gray-700'
                }`}
              >
                <HiChartPie className="mr-2" />
                Dashboard
              </div>
            </Link>
             <Link to="/dashboard?tab=posts">
             <div
               className={`cursor-pointer p-2 flex items-center rounded ${
                 isActive('posts') ? 'bg-white text-black' : 'text-white hover:bg-gray-700'
               }`}
             >
               <HiDocumentText className="mr-2" />
               Manage Posts
             </div>
           </Link>
           <Link to="/dashboard?tab=users">
            <div
              className={`cursor-pointer p-2 flex items-center rounded ${
                isActive('users') ? 'bg-white text-black' : 'text-white hover:bg-gray-700'
              }`}
            >
              <HiOutlineUserGroup className="mr-2" />
              Users
            </div>
          </Link>
           </>
          )}
          <Link to="/dashboard?tab=profile">
            <div
              className={`cursor-pointer p-2 flex items-center rounded ${
                isActive('profile') ? 'bg-white text-black' : 'text-white hover:bg-gray-700'
              }`}
            >
              <HiUser className="mr-2" />
              Edit Details
            </div>
          </Link>
          <Link to="/dashboard?tab=creation">
            <div
              className={`cursor-pointer p-2 flex items-center rounded ${
                isActive('creation') ? 'bg-white text-black' : 'text-white hover:bg-gray-700'
              }`}
            >
              <HiDocumentText className="mr-2" />
              Create Post
            </div>
          </Link>
          
          <div
              className="flex items-center p-2 text-white rounded cursor-pointer hover:bg-gray-700"
              onClick={handleSignout}
            >
              <HiArrowSmRight className="mr-2" />
              Sign Out
        </div>
        </div>
      </div>
    </nav>
  );
}

