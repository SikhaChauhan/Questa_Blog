import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';

const ProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    // Function to fetch user and posts data
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`/api/users/${userId}`);
        setUser(userResponse.data);

        const postsResponse = await axios.get(`/api/post/getposts?userId=${userId}`);
        if (postsResponse.data && Array.isArray(postsResponse.data.posts)) {
          setPosts(postsResponse.data.posts);
        } else {
          setPosts([]);
        }
      } catch (err) {
        setError('Error loading posts. Please try again later.');
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Effect to manage sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      setSidebarVisible(window.innerWidth >= 768); // Adjust based on your sidebar width
    };
    
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize); // Add event listener
    return () => window.removeEventListener('resize', handleResize); // Clean up
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='flex flex-col min-h-screen mr-2 md:mr-6 md:flex-row'>
      <div className={`md:w-50 ${sidebarVisible ? 'block' : 'hidden'} md:block`}>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      <main className={`flex-1 pt-4 p-2 pl-0 mt-2 ${sidebarVisible ? 'ml-0 pl-7' : 'ml-0'} md:ml-0`}>
        {user && (
          <Link to={`/profile/${user._id}`} className="flex flex-col items-center mb-8 md:items-start profile-header">
            <img
              src={user.profilePicture || '/default-profile.png'}
              alt={`${user.username}'s profile`}
              className="w-32 h-32 mb-4 border-4 border-gray-300 rounded-full shadow-lg"
            />
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-extrabold text-gray-900">{user.username}</h1>
              <p className="text-lg text-black whitespace-pre-line">
                {user.bio || ' '}
              </p>
            </div>
          </Link>
        )}
        <hr className='mb-4'/>
        <h1 className='text-4xl font-semibold text-center'>My Posts</h1>
        <div className="grid grid-cols-2 gap-6 pl-3 mt-8 ml-0 mr-2 user-posts sm:grid-cols-2 lg:grid-cols-3">
          {posts.length ? (
            posts.map((post) => (
              <Link to={`/post/${post.slug}`} key={post._id} className="mb-3 overflow-hidden transition-transform transform border border-gray-200 rounded-lg shadow-lg hover:scale-105">
                {post.image && <img src={post.image} alt={post.title} className="object-cover w-full h-48 " />}
                <div className="p-4 bg-white">
                  <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
                  <p className="inline-block mt-2 text-pink-500 hover:underline">Read More</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-black md:text-center lg:text-center">No posts available for this user.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;


















