import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/post/getposts');
        setPosts(response.data.posts);
      } catch (err) {
        setError('Error loading posts. Please try again later.');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-3xl font-bold">All Posts</h1>
      <div className="flex flex-col space-y-8 ">
        {posts.length ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="flex flex-col transition-shadow duration-300 ease-in-out bg-white border border-gray-200 rounded-lg shadow-lg cursor-pointer md:flex-row hover:shadow-2xl "
            >
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="object-cover w-full h-full mt-3 mb-3 ml-2 rounded-lg md:w-1/4 md:h-auto md:rounded-l-lg"
                  style={{ maxHeight: '250px', maxWidth: '509px'}}
                />
              )}
              <div className="flex flex-col justify-between flex-1 p-4">
                <div>
                  <h2 className="mb-2 text-2xl font-semibold text-gray-800">{post.title}</h2>
                  <div
                    className="mt-2 text-gray-600"
                    dangerouslySetInnerHTML={{ __html: post.content.substring(0, 500) + '...' }}
                  ></div>
                </div>
                <div className="flex items-center mt-4 space-x-4">
                  <Link to={`/post/${post.slug}`}>
                    <button className="px-4 py-2 text-white rounded-md bg-gradient-to-br from-black via-gray-900 to-gray-700 hover:cyan">
                      View Post
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default AllPosts;
