import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Layout from "./components/Layout";
import { getCurrentUser } from "./services/authService";
import type { JSX } from "react";

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
            <Routes>
                {/* Rutas sin Layout */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Placeholder title="Registro de Cliente" />} />
                
                {/* Rutas con Layout */}
                <Route element={<Layout />}>
                    {/* Públicas */}
                    <Route path="/" element={<Placeholder title="Catálogo de Productos" />} />
                    
                    {/* Privadas: Clientes */}
                    <Route path="/cart" element={
                        <PrivateRoute>
                            <Placeholder title="Carrito de Compras" />
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
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
