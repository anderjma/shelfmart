import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Layout from "./components/Layout";
import { getCurrentUser } from "./services/authService";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => {
    const user = getCurrentUser();
    return user?.role === "Admin" ? children : <Navigate to="/" />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/users" element={
                        <AdminRoute>
                            <Users />
                        </AdminRoute>
                    } />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
