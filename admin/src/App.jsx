import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Login from './pages/Login';
import Verify from './pages/Verify';
import Dashboard from './pages/Dashboard';
import AdminLayout from './layouts/AdminLayout';

// Product
import ProductManager from './components/Product/ProductList.jsx';
import CreateProduct from './components/product/CreateProduct.jsx';
import EditProduct from './components/product/EditProduct.jsx';

// Project
import ProjectsPage from './pages/Project/ProjectsPage';
import CreateProject from './components/project/CreateProject.jsx';
import EditProjectPage from './components/Project/EditProject.jsx';

// News
import NewsManager from './pages/News/NewsManager';
import CreateNews from './components/news/CreateNews';
import EditNews from './components/news/EditNews';

// Other pages
import ConsignManager from './pages/Consign/ConsignManager.jsx';
import ContactManager from './pages/Contact/ContactManager.jsx';

// Route bảo vệ
import ProtectedRoute from './pages/ProtectedRoute.jsx';

function App() {
    return (
        <Router>
            <Routes>
                {/* ==== PUBLIC ROUTES ==== */}
                <Route path="/login" element={<Login />} />
                <Route path="/verify" element={<Verify />} />

                {/* ==== PROTECTED ROUTES ==== */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <Dashboard />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/products"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <ProductManager />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/products/create"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <CreateProduct />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/products/edit/:id"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <EditProduct />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/projects"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <ProjectsPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/projects/create"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <CreateProject />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/projects/edit/:id"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <EditProjectPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/news"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <NewsManager />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/news/create"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <CreateNews />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/news/edit/:id"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <EditNews />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/consign/*"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <ConsignManager />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/contacts/*"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <ContactManager />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* ==== REDIRECT ==== */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
