import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from 'react-icons/hi';

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
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
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const isActive = (tabName) => tab === tabName;

  return (
    <div className="z-20 hidden w-full h-full text-white bg-black border-r border-gray-500 md:w-56 md:block">
      <p className="flex items-center pt-5 pl-10 ml-2 text-lg font-bold">
        Main Menu
      </p>
      <div className="flex flex-col gap-1 p-4">
        {currentUser && currentUser.isAdmin && (
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
            <HiAnnotation className="mr-2" />
            Create Post
          </div>
        </Link>
        {currentUser.isAdmin && (
          <>
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
        <div
          className="flex items-center p-2 text-white rounded cursor-pointer hover:bg-gray-700"
          onClick={handleSignout}
        >
          <HiArrowSmRight className="mr-2" />
          Sign Out
        </div>
      </div>
    </div>
  );
}
