import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AnimeDetails from './pages/AnimeDetails';
import AnimeForm from './pages/AnimeForm';
import CategoryPage from './pages/CategoryPage';
import Profile from './pages/Profile';
import AdminRequests from './pages/AdminRequests';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/anime/:id" element={<AnimeDetails />} />
          <Route path="/admin/animes/new" element={<AnimeForm />} />
          <Route path="/admin/animes/:id/edit" element={<AnimeForm />} />
          <Route path="/admin/requests" element={<AdminRequests />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
