import { TextInput, Button, Alert, Modal } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { app } from '../firebase.js';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutSuccess } from '../redux/user/userSlice.js';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(currentUser.profilePicture || null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const filePickerRef = useRef();

  useEffect(() => {
    const uploadImage = async () => {
      if (!imageFile) return;

      try {
        setImageFileUploading(true);
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const fileName = `${new Date().getTime()}_${imageFile.name}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageFileUploadProgress(progress.toFixed(0));
          },
          (error) => {
            setImageFileUploadError("Could not upload image (File must be less than 2MB!)");
            setImageFile(null);
            setImageFileUrl(currentUser.profilePicture);
            setImageFileUploading(false);
            console.log(error)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImageFileUrl(downloadURL);
              setFormData((prevData) => ({ ...prevData, profilePicture: downloadURL }));
              setImageFileUploading(false);
            });
          }
        );
      } catch (error) {
        setImageFileUploadError(`An unexpected error occurred: ${error.message}`);
      }
    };
    uploadImage();
  }, [imageFile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes were made!");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for the image to upload!');
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Profile updated successfully!");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/users/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/sign-out', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess(data.message));
      }
    } catch (error) {
      dispatch(signoutSuccess(error.message));
    }
  };

  return (
    <div className='w-full max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input 
          type='file' 
          accept='image/*' 
          onChange={handleImageChange} 
          ref={filePickerRef}
          hidden
        />

        <div className='relative self-center w-32 h-32 overflow-hidden rounded-full shadow-md cursor-pointer' onClick={() => filePickerRef.current.click()}>
          {imageFileUploadProgress && (
            <CircularProgressbar 
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img 
            src={imageFileUrl} 
            alt="user" 
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`}
          />
        </div>
        {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
        
        <TextInput 
          type='text' 
          id='username'
          placeholder='Username' 
          defaultValue={currentUser.username}
          onChange={handleChange} 
        />

        <TextInput 
          type='email' 
          id='email'
          placeholder='Email' 
          defaultValue={currentUser.email}
          onChange={handleChange} 
        />

        <TextInput 
          type='password' 
          id='password'
          placeholder='Password'
          onChange={handleChange} 
        />

        <textarea 
          id='bio'
          placeholder='Bio' 
          defaultValue={currentUser.bio || ''} // Add default value if bio is not set
          onChange={handleChange}
          rows="4" // Number of rows for the textarea
          className='p-2 border rounded-md resize-none'
        />

        <Button 
          type='submit' 
          className='bg-gradient-to-br from-black via-gray-900 to-gray-700'
          disabled={loading || imageFileUploading}
        >
          {loading ? 'Loading...' : 'Update'}
        </Button>
      </form>
      <div className='flex justify-between mt-5 text-red-600'>
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
        {/* <Link to='/auth/resetPassword/:token' className='cursor-pointer'>Reset Password</Link> */}
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-5 font-semibold text-slate-950 bg-lime-200'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5 font-semibold text-slate-950 bg-lime-400'>
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className='mt-5 font-semibold text-slate-950 bg-lime-400'>
          {error}
        </Alert>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center w-400 h-100'>
            <HiOutlineExclamationCircle className='mx-auto mb-4 text-6xl text-red-600' />
            <h3 className='text-lg font-normal text-gray-500'>
              Are you sure you want to delete your account? This action cannot be undone.
            </h3>
            <div className='flex justify-center gap-4 mt-6'>
              <Button className='bg-gradient-to-br from-pink-500 via-red-500 to-pink-700' onClick={handleDeleteUser}>
                Yes, delete my account
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
