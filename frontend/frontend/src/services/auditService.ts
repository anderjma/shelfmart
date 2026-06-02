import axios from "axios";

const API_URL = "http://localhost:5000/api/Audit";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const getDashboardStats = async () => {
    const response = await axios.get(`${API_URL}/stats`, getAuthHeaders());
    return response.data;
};

export const getAuditLogs = async () => {
    const response = await axios.get(`${API_URL}/logs`, getAuthHeaders());
    return response.data;
};
