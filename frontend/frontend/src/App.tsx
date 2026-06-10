/* eslint-disable @typescript-eslint/no-unused-vars */
// Este archivo actúa como el orquestador principal del enrutamiento del lado del cliente.
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import OrdersManager from "./pages/OrdersManager";
import AuditDashboard from "./pages/AuditDashboard";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Users from "./pages/Users";
import Layout from "./components/Layout";
import Store from "./pages/Store";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Profile from "./pages/Profile";
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

// Este componente enlaza las distintas páginas y restringe el acceso mediante roles específicos.
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
                    <Route path="/" element={<Home />} />`n                    <Route path="/catalogo" element={<Store />} />`n                    <Route path="/contacto" element={<Contact />} />`n                    <Route path="/nosotros" element={<About />} />
                    
                    {/* Privadas: Clientes */}
                    <Route path="/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />
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
                    <Route path="/admin/audit" element={<AdminRoute><AuditDashboard /></AdminRoute>} />
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



