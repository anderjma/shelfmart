import axiosClient from "../api/axiosClient";

export const login = async (username: string, password: string) => {
    const response = await axiosClient.post("/Auth/login", { username, password });
    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem("token");
};
