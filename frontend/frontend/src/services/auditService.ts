// Este archivo gestiona las llamadas a la API referentes a métricas de negocio y registro de auditorías.
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_URL = `${BASE_URL}/Audit`;

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
};

// Esta función obtiene un resumen estadístico de las ventas y usuarios para los indicadores del dashboard.
export const getDashboardStats = async () => {
    const response = await axios.get(`${API_URL}/stats`, getAuthHeaders());
    return response.data;
};

// Esta función solicita al servidor el listado histórico de las acciones recientes realizadas por los usuarios.
export const getAuditLogs = async () => {
    const response = await axios.get(`${API_URL}/logs`, getAuthHeaders());
    return response.data;
};
