import axios from 'axios';

const API_URL = 'http://localhost:5173/api';

export const getUserDetails = async (userId) => {
    try {
        const userIdStr = String(userId);
        const response = await axios.get(`${API_URL}/users/${userIdStr}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};
