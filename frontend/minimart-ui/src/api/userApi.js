import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

export const updateProfileApi = async (userId, profileData) => {
    return await axios.put(`${API_URL}/${userId}/profile`, profileData);
};

export const changePasswordApi = async (userId, passwordData) => {
    return await axios.put(`${API_URL}/${userId}/change-password`, passwordData);
};