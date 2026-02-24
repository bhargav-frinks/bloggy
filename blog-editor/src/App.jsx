import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import BlogEditorPage from './pages/BlogEditorPage';
import BlogViewPage from './pages/BlogViewPage';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/write"
              element={
                <ProtectedRoute>
                  <BlogEditorPage />
                </ProtectedRoute>
              }
            />
            <Route path="/blog/:id" element={<BlogViewPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
