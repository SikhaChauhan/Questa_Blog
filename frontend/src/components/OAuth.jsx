import React from 'react';
import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch} from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                dispatch(signInSuccess(data));
                navigate('/');
            } else {
                console.error('Server error:', data.message);
                alert('An error occurred during the sign-in process. Please try again.');
            }
        } catch (error) {
            if (error.code === 'auth/popup-closed-by-user') {
                console.warn('The popup was closed by the user before completing sign-in.');
                alert('You closed the popup before signing in. Please try again.');
            } else {
                console.error('An unexpected error occurred:', error.message);
                alert('An unexpected error occurred. Please try again later.');
            }
        }
    };

    return (
        <Button
            type='button'
            gradientDuoTone='pinkToOrange'
            onClick={handleGoogleClick}
            className={'flex items-center bg-gradient-to-br from-black via-gray-900 to-gray-700 '}
        >
            <AiFillGoogleCircle className='w-6 h-6 mr-2' />
            Continue with Google
        </Button>
    );
}


