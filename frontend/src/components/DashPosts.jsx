import { Modal, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchPosts();
  }, []);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-6 sm:p-8 lg:p-8">
      {userPosts.length > 0 ? (
        <>
          <div className="grid justify-between grid-cols-1 gap-9 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {userPosts.map((post, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-md shadow-gray-400"
              >
                <Link to={`/post/${post.slug}`}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="object-cover w-full bg-gray-500 rounded-md h-60"
                  />
                </Link>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  <Link to={`/post/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post.updatedAt).toLocaleDateString()}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span
                    onClick={() => {
                      setShowModal(true);
                      setPostIdToDelete(post._id);
                    }}
                    className="font-medium text-red-500 cursor-pointer hover:underline"
                  >
                    Delete
                  </span>
                  <Link
                    className="text-teal-500 hover:underline"
                    to={`/update-post/${post._id}`}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="block w-full mt-6 text-sm text-teal-500"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p className="text-center text-gray-600">You have no posts yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button className='bg-gradient-to-br from-pink-500 via-red-500 to-pink-700' onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button className='bg-gradient-to-br from-black via-gray-900 to-gray-700' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
