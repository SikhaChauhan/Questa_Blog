// import { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import PostCard from '../components/PostCard';

// export default function Search() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showMore, setShowMore] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   const location = useLocation();
//   // const navigate = useNavigate();

//   useEffect(() => {
//     const urlParams = new URLSearchParams(location.search);
//     const searchTermFromUrl = urlParams.get('searchTerm') || '';
//     setSearchTerm(searchTermFromUrl);

//     const fetchPosts = async () => {
//       if (searchTermFromUrl.trim() === '') {
//         setPosts([]);
//         return;
//       }

//       setLoading(true);
//       const res = await fetch(`/api/post/getposts?searchTerm=${searchTermFromUrl}`);
//       if (!res.ok) {
//         setLoading(false);
//         return;
//       }
//       const data = await res.json();
//       if (data.posts.length === 0) {
//         setPosts([]);
//       } else {
//         setPosts(data.posts);
//         setShowMore(data.posts.length === 9);
//       }
//       setLoading(false);
//     };

//     fetchPosts();
//   }, [location.search]);

//   const handleShowMore = async () => {
//     const numberOfPosts = posts.length;
//     const startIndex = numberOfPosts;
//     const searchQuery = new URLSearchParams(location.search);
//     searchQuery.set('startIndex', startIndex);
//     const res = await fetch(`/api/post/getposts?${searchQuery}`);
//     if (!res.ok) return;

//     const data = await res.json();
//     setPosts([...posts, ...data.posts]);
//     setShowMore(data.posts.length === 9);
//   };

//   return (
//     <div className='w-full'>
//       <h1 className='p-3 mt-5 text-3xl font-semibold text-center'>
//         {searchTerm === '' ? 'Type something to search.' : 'Posts Results:'}
//       </h1>
//       <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 p-7'>
//         {loading && <p className='text-xl text-center text-gray-500'>Loading...</p>}
//         {!loading && posts.length === 0 && searchTerm !== '' && (
//           <p className='text-xl text-center text-gray-500'>No results found.</p>
//         )}
//         {!loading &&
//           posts.map((post) => (
//             <PostCard key={post._id} post={post} />
//           ))}
//         {showMore && (
//           <button
//             onClick={handleShowMore}
//             className='text-lg text-teal-500 col-span-full hover:underline p-7'
//           >
//             Show More
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }




import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Search() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm') || '';
    setSearchTerm(searchTermFromUrl);

    const fetchPosts = async () => {
      if (searchTermFromUrl.trim() === '') {
        setPosts([]);
        return;
      }

      setLoading(true);
      const res = await fetch(`/api/post/getposts?searchTerm=${searchTermFromUrl}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.posts.length === 0) {
        setPosts([]);
      } else {
        setPosts(data.posts);
        setShowMore(data.posts.length === 9);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [location.search]);

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const searchQuery = new URLSearchParams(location.search);
    searchQuery.set('startIndex', startIndex);
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) return;

    const data = await res.json();
    setPosts([...posts, ...data.posts]);
    setShowMore(data.posts.length === 9);
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-grow'>
        <h1 className='p-3 mt-5 text-3xl font-semibold text-center'>
          {searchTerm === '' ? 'Type something to search.' : 'Posts Results:'}
        </h1>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 p-7'>
          {loading && <p className='text-xl text-center text-gray-500'>Loading...</p>}
          {!loading && posts.length === 0 && searchTerm !== '' && (
            <p className='text-xl text-center text-gray-500'>No results found.</p>
          )}
          {!loading &&
            posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          {showMore && (
            <button
              onClick={handleShowMore}
              className='text-lg text-teal-500 col-span-full hover:underline p-7'
            >
              Show More
            </button>
          )}
        </div>
      </main>
      {/* Footer can be added here or in a parent component */}
      {/* <footer className='p-4 text-center text-white bg-gray-800'>
        © 2024 Your Website. All rights reserved.
      </footer> */}
    </div>
  );
}
