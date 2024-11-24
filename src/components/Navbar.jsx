import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="w-full bg-base-200 shadow-lg">
      <div className="navbar max-w-7xl mx-auto px-4">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost text-xl md:text-2xl">
            JAPIN<span className="text-primary">URL</span>
          </Link>
        </div>
        
        <div className="navbar-end gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="btn btn-primary btn-sm md:btn-md">
                Dashboard
              </Link>
              <button onClick={logout} className="btn btn-ghost btn-sm md:btn-md">
                Keluar
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost btn-sm md:btn-md">
                Masuk
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm md:btn-md">
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
