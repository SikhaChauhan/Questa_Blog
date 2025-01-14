import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users/getusers?limit=10'); 
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts?limit=5');
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
    }
  }, [currentUser]);

  return (
    <div className='max-w-screen-xl p-6 mx-auto'>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <div className='flex flex-col w-full p-6 border border-gray-300 rounded-lg shadow-lg shadow-black'>
          <div className='flex justify-between'>
            <div className='w-80'>
              <h3 className='text-gray-500 uppercase text-md'>Total Users</h3>
              <p className='text-2xl font-semibold'>{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className='p-3 text-5xl text-white bg-teal-600 rounded-full shadow-lg shadow-black' />
          </div>
          <div className='flex gap-2 mt-4 text-sm'>
            <span className='flex items-center text-green-500'>
              <HiArrowNarrowUp />
              {/* Display percentage or growth here */}
            </span>
            {/* Display period (like 'Last month') */}
          </div>
        </div>

        <div className='flex flex-col w-full p-6 border border-gray-300 rounded-lg shadow-lg shadow-black'>
          <div className='flex justify-between'>
            <div className='flex-grow'>
              <h3 className='text-gray-500 uppercase text-md'>Total Posts</h3>
              <p className='text-2xl font-semibold'>{totalPosts}</p>
            </div>
            <HiDocumentText className='p-3 text-5xl text-white rounded-full shadow-lg bg-lime-600' />
          </div>
          <div className='flex gap-2 mt-4 text-sm'>
            <span className='flex items-center text-green-500'>
              <HiArrowNarrowUp />
              {/* Display percentage or growth here */}
            </span>
            {/* Display period (like 'Last month') */}
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2'>
        <div className='flex flex-col w-full p-6 border border-gray-300 rounded-lg shadow-lg shadow-black'>
          <div className='flex justify-between mb-3 text-sm font-semibold'>
            <h1 className='text-lg'>Users</h1>
            <Button className='bg-gradient-to-br from-black via-gray-900 to-gray-700'>
              <Link to={'/dashboard?tab=users'}>See all</Link>
            </Button>
          </div>
          <div className='grid gap-4'>
            {users.slice(0, 10).map((user) => ( // Display up to 10 users
              <Link key={user._id} to={`/profile/${user._id}`} className='flex items-center gap-3 p-3 border-b border-gray-300 dark:border-gray-700'>
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className='w-10 h-10 bg-gray-500 rounded-full'
                />
                <p>{user.username}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className='flex flex-col w-full p-6 border border-gray-300 rounded-lg shadow-lg shadow-black'>
          <div className='flex justify-between mb-3 text-sm font-semibold'>
            <h1 className='text-lg'>Posts</h1>
            <Button className='bg-gradient-to-br from-black via-gray-900 to-gray-700'>
              <Link to={'/dashboard?tab=posts'}>See all</Link>
            </Button>
          </div>
          <div className='flex flex-col gap-4'>
            {posts.slice(0, 5).map((post) => (
              <Link to={`/post/${post.slug}`} key={post._id} className='flex flex-col p-3 border-b border-gray-300 '>
                <div className='flex items-center gap-4 p-3 border-b border-gray-300 rounded-md '>
                  <img
                    src={post.image}
                    alt={post.title}
                    className='object-cover w-24 h-24 rounded'
                  />
                  <div className='flex flex-col'>
                    <h2 className='text-lg font-semibold'>{post.title}</h2>
                    <p className='text-sm text-gray-500'>
                      By: {post.userId?.username || 'Unknown'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
