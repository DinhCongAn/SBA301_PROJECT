import axios from "axios";

const API_URL = "http://localhost:8080/api/admin/dashboard";

export const getDashboardStats = async () => {
    return await axios.get(`${API_URL}/stats`);
};