import { useState } from 'react';

export const useLike = (initialLiked = false, initialLikeCount = 0, postId) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/post/like/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming you store the token in localStorage
        },
      });

      if (!res.ok) {
        console.error('Failed to like post:', await res.text());
        return;
      }

      const data = await res.json();
      setLiked(!liked);
      setLikeCount(data.likes); // Assuming `data.likes` is the updated like count
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return { liked, likeCount, handleLike };
};
