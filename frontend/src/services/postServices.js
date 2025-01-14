// src/services/postService.js
import axios from 'axios';

// Define your API base URL
const API_URL = 'http://localhost:5000/api'; // Replace with your actual API base URL

// Function to get details of a post by its ID
export const getPostDetails = async (postId) => {
    try {
        const response = await axios.get(`${API_URL}/posts/${postId}`);
        return response.data; // Returns the post details from the API response
    } catch (error) {
        console.error('Error fetching post details:', error);
        throw error; // Rethrow the error to be handled by the calling function
    }
};

// Function to like a post by its ID and the user ID
export const likePost = async (postId, userId) => {
    try {
        const response = await axios.post(`${API_URL}/posts/${postId}/like`, { userId });
        return response.data; // Returns the updated post data from the API response
    } catch (error) {
        console.error('Error liking post:', error);
        throw error; // Rethrow the error to be handled by the calling function
    }
};
