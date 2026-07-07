// This file acts as the main orchestrator for client-side routing.
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./shared/components/Layout";
import { AuthProvider, useAuth } from "./lib/auth-context";
import type { JSX } from "react";
import { Toaster } from "react-hot-toast";

// Lazy-load pages to reduce the initial bundle
const Login = lazy(() => import("./features/auth/components/Login"));
const Register = lazy(() => import("./features/auth/components/Register"));
const Home = lazy(() => import("./shared/pages/Home"));
const Store = lazy(() => import("./features/store/components/Store"));
const Contact = lazy(() => import("./shared/pages/Contact"));
const About = lazy(() => import("./shared/pages/About"));
const Profile = lazy(() => import("./features/profile/components/Profile"));
const Cart = lazy(() => import("./features/cart/components/Cart"));
const NotFound = lazy(() => import("./shared/pages/NotFound"));

// Global loading spinner while chunks are being resolved
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-500 font-medium">Loading...</span>
        </div>
    </div>
);

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <PageLoader />;
    return isAuthenticated ? children : <Navigate to="/login" />;
};

// This component links the different pages and restricts access via specific roles.
function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Toaster position="bottom-right" />
                <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* Routes without Layout */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Routes with Layout */}
                    <Route element={<Layout />}>
                        {/* Public */}
                        <Route path="/" element={<Home />} />
                        <Route path="/catalog" element={<Store />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/about" element={<About />} />

                        {/* Private: Customers */}
                        <Route path="/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />
                        <Route path="/cart" element={
                            <PrivateRoute>
                                <Cart />
                            </PrivateRoute>
                        } />

                        {/* 404 — Catch-all route */}
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    </AuthProvider>
    );
}

export default App;
