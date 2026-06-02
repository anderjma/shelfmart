/* eslint-disable @typescript-eslint/no-unused-vars */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import OrdersManager from "./pages/OrdersManager";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Users from "./pages/Users";
import Layout from "./components/Layout";
import Store from "./pages/Store";
import { getCurrentUser } from "./services/authService";
import type { JSX } from "react";
import { Toaster } from "react-hot-toast";

// Componente temporal para páginas en construcción
const Placeholder = ({ title }: { title: string }) => <div className="p-8 text-center text-xl text-gray-500 bg-white rounded shadow-sm">{title} (En construcción)</div>;

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
            <Toaster position="bottom-right" />
            <Routes>
                {/* Rutas sin Layout */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Rutas con Layout */}
                <Route element={<Layout />}>
                    {/* Públicas */}
                    <Route path="/" element={<Store />} />
                    
                    {/* Privadas: Clientes */}
                    <Route path="/cart" element={
                        <PrivateRoute>
                            <Cart />
                        </PrivateRoute>
                    } />

                    {/* Privadas: Administradores */}
                    <Route path="/admin/dashboard" element={
                        <AdminRoute>
                            <Dashboard />
                        </AdminRoute>
                    } />
                    <Route path="/admin/users" element={
                        <AdminRoute>
                            <Users />
                        </AdminRoute>
                    } />
                    <Route path="/admin/orders" element={
                        <AdminRoute>
                            <OrdersManager />
                        </AdminRoute>
                    } />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
