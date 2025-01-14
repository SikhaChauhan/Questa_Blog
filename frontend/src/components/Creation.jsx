import { Alert, Button, FileInput, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

export default function Creation() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
  });
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData((prev) => ({ ...prev, image: downloadURL }));
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.image) {
      setPublishError('Please provide all required fields');
      return;
    }
    try {
      const res = await fetch('/api/post/create-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
      console.log(error);
    }
  };


  const modules = {
    toolbar: [
      [{ 'font': [] }, { 'size': [] }],  // Font and size dropdowns
      ['bold', 'italic', 'underline', 'strike'],  // Bold, italic, underline, and strikethrough
      [{ 'color': [] }, { 'background': [] }],  // Text color and background color
      [{ 'script': 'sub' }, { 'script': 'super' }],  // Subscript and superscript
      [{ 'header': '1' }, { 'header': '2' }, 'blockquote'],  // Headers and blockquote
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],  // Ordered and unordered lists
      [{ 'align': [] }],  // Alignment options
      ['link', 'image', 'video'],  // Link, image, and video embedding
      ['clean'],  // Clear formatting
    ],
  };

  const formats = [
    'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script', 'super', 'sub',
    'header', 'blockquote',
    'list', 'bullet', 'align',
    'link', 'image', 'video',
  ];
  
  
  return (
    <div className='max-w-2xl min-h-screen p-6 mx-auto mt-4 mb-4 bg-white rounded-lg shadow-lg shadow-black'>
      <h1 className='mb-6 text-4xl font-bold text-center text-teal-600'>Create a Post</h1>
      <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black'
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        <div className='flex items-center justify-between w-full max-w-md gap-4 p-3 mx-auto border-4 border-black border-dotted rounded-lg'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type='button'
            className='pt-2 pb-2 pl-2 pr-2 bg-gradient-to-br from-black via-gray-900 to-gray-700'
            size='sm'
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt='upload'
            className='object-cover w-full rounded-lg shadow-md h-72'
          />
        )}
        <ReactQuill
          theme='snow'
          modules={modules}
          formats={formats}
          className='mb-3 h-72 dark:text-white'
          placeholder='Write your content here...'
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
        />

        
        <Button type='submit' className='w-full mt-4 text-white bg-gradient-to-br from-black via-gray-900 to-gray-700'>
          Publish
        </Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
