import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Verify from './pages/Verify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AdminLayout from './layouts/AdminLayout';
import ProductManager from './components/Product/ProductList.jsx';
import CreateProduct from './components/product/CreateProduct.jsx';
import EditProduct from './components/product/EditProduct.jsx';
import ProjectsPage from './pages/Project/ProjectsPage';
import CreateProject from'./components/project/CreateProject.jsx';
import EditProjectPage from './components/Project/EditProject';
import NewsManager from './pages/News/NewsManager';
import CreateNews from './components/news/CreateNews';
import EditNews from './components/news/EditNews';
import ConsignManager from './pages/Consign/ConsignManager.jsx';
import ContactManager from './pages/Contact/ContactManager.jsx';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/verify" element={<Verify/>}/>
                <Route
                    path="/dashboard"
                    element={
                        <AdminLayout>
                            <Dashboard />
                        </AdminLayout>
                    }
                />
                <Route path="/" element={<Navigate to="/login"/>}/>
                <Route path="/products" element={<ProductManager/>}/>
                <Route path="/products/create" element={<CreateProduct/>}/>
                <Route path="/products/edit/:id" element={<EditProduct/>}/>
                <Route path="/projects" element={<ProjectsPage/>}/>
                <Route path="/projects/create" element={<CreateProject/>}/>
                <Route path="/projects/edit/:id" element={<EditProjectPage />} />
                <Route path="/news" element={<NewsManager/>}/>
                <Route path="/news/create" element={<CreateNews/>}/>
                <Route path="/news/edit/:id" element={<EditNews/>}/>
                <Route path="/consign/*" element={<ConsignManager />} />
                <Route path="/contacts/*" element={<ContactManager />} />

            </Routes>
        </Router>
    );
}

export default App;
