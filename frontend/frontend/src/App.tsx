/* eslint-disable @typescript-eslint/no-unused-vars */
// Este archivo actúa como el orquestador principal del enrutamiento del lado del cliente.
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout";
import { getCurrentUser } from "./services/authService";
import type { JSX } from "react";
import { Toaster } from "react-hot-toast";

// Carga diferida de páginas para reducir el bundle inicial
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const Store = lazy(() => import("./pages/Store"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Profile = lazy(() => import("./pages/Profile"));
const Cart = lazy(() => import("./pages/Cart"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Users = lazy(() => import("./pages/Users"));
const AuditDashboard = lazy(() => import("./pages/AuditDashboard"));
const OrdersManager = lazy(() => import("./pages/OrdersManager"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Spinner de carga global mientras se resuelven los chunks
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-500 font-medium">Cargando...</span>
        </div>
    </div>
);

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
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* Rutas sin Layout */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Rutas con Layout */}
                    <Route element={<Layout />}>
                        {/* Públicas */}
                        <Route path="/" element={<Home />} />
                        <Route path="/catalogo" element={<Store />} />
                        <Route path="/contacto" element={<Contact />} />
                        <Route path="/nosotros" element={<About />} />
                        
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

                        {/* 404 — Ruta catch-all */}
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
