import { Modal, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users/getusers');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/users/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/users/delete/${userIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-5 overflow-x md:mx-auto lg:auto'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <div className='grid grid-cols-1 gap-4 pb-4 text-center text-gray-900 shadow-md xl:grid-cols-6 md:w-[500px] lg:w-[700px] xl:w-full'>
            <div className='font-semibold'>Date Created</div>
            <div className='font-semibold'>User Image</div>
            <div className='font-semibold'>Username</div>
            <div className='font-semibold'>Email</div>
            <div className='font-semibold'>Admin</div>
            <div className='font-semibold'>Delete</div>
          </div>
          <br />
          {users.map((user) => (
            <div
              key={user._id}
              className='grid items-center grid-cols-1 gap-4 p-4 py-2 mb-4 text-center border-b rounded-lg shadow-md xl:grid-cols-6 md:w-[500px] lg:w-[700px] xl:w-full'
            >
              <div>{new Date(user.createdAt).toLocaleDateString()}</div>
              <div>
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className='object-cover w-10 h-10 mx-auto bg-gray-500 rounded-full'
                />
              </div>
              <div>{user.username}</div>
              <div>{user.email}</div>
              <div>
                {user.isAdmin ? (
                  <FaCheck className='mx-auto text-green-500' />
                ) : (
                  <FaTimes className='mx-auto text-red-500' />
                )}
              </div>
              <div>
                <span
                  onClick={() => {
                    setShowModal(true);
                    setUserIdToDelete(user._id);
                  }}
                  className='font-medium text-red-500 cursor-pointer hover:underline'
                >
                  Delete
                </span>
              </div>
            </div>
          ))}

          {showMore && (
            <button
              onClick={handleShowMore}
              className='self-center w-full text-sm text-teal-500 py-7'
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p className='text-center'>You have no users yet!</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='mx-auto mb-4 text-gray-400 h-14 w-14 ' />
            <h3 className='mb-5 text-lg text-gray-500 '>
              Are you sure you want to delete this user?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button className='bg-gradient-to-br from-pink-500 via-red-500 to-pink-700' onClick={handleDeleteUser}>
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




