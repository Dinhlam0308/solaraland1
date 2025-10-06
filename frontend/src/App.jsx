import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ConsignManager from './pages/Consign/ConsignManager.jsx';
import ContactForm from './pages/Contact/ContactForm.jsx';
import Home from './pages/Home/Home.jsx';
import SunriseRiverside from './components/Home/SunriseRiverside.jsx';
import LavidaPlus from './components/Home/LavidaPlus.jsx';
import SaigonSouth from './components/Home/SaigonSouth.jsx';
import CelestaRise from './components/Home/CelestaRise.jsx';
import VictoriaVillage from './components/Home/VictoriaVillage.jsx';
import Zeitgeist from './components/Home/Zeitgeist.jsx';
import Header from './components/Layout/Header.jsx';
import Footer from './components/Layout/Footer.jsx';
import CanHoPage from './components/Product/CanHoPage.jsx';
import NhaPhoPage from './components/Product/NhaPhoPage.jsx';
import OfficeTelPage from './components/Product/OfficeTelPage.jsx';
import NewsListPage from './components/News/NewsListPage.jsx';
import NewsDetailPage from './components/News/NewsDetailPage.jsx';
import ProductDetails from './components/Product/ProductDetails.jsx';




function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/ky-gui" element={<ConsignManager />} />
                <Route path="/lien-he" element={<ContactForm />} />
                <Route path="/trang-chu" element={<Home />} />
                <Route path="/" element={<Home />} />
                <Route path="/trang-chu/sunrise-riverside" element={<SunriseRiverside />}/>
                <Route path="/trang-chu/lavida-plus" element={<LavidaPlus />} />
                <Route path= "/trang-chu/saigon-south" element={<SaigonSouth />} />
                <Route path="/trang-chu/celesta-rise"  element={<CelestaRise/>}/>
                <Route path="/trang-chu/victoria-village" element={<VictoriaVillage />} />
                <Route path="/trang-chu/zeigeist" element={<Zeitgeist />} />
                <Route path="/can-ho" element={<CanHoPage />} />
                <Route path="/nha-pho" element={<NhaPhoPage />} />
                <Route path="/office-tel" element={<OfficeTelPage />} />
                <Route path="/san-pham/:name" element={<ProductDetails/>}/>
                <Route path="tin-tuc" element={<NewsListPage />} />
                <Route path="/tin-tuc/:slug" element={<NewsDetailPage/>} />
            </Routes>
            <Footer/>
        </Router>
    );
}

export default App;
