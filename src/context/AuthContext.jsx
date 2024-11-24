import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';
import Swal from 'sweetalert2';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify token and load user data
  const verifyToken = async (token) => {
    try {
      // Set the auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Verify token by making a request to /auth/me
      const response = await axios.get('/auth/me');
      return response.data.user;
    } catch (error) {
      console.error('Token verification error:', error);
      // If token is invalid, clear everything
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      return null;
    }
  };

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const userData = await verifyToken(token);
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (email, password, captchaToken) => {
    try {
      const response = await axios.post('/auth/login', { 
        email, 
        password, 
        captchaToken 
      });
      
      const { token, user } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      
      // Set auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);

      Swal.fire({
        icon: 'success',
        title: 'Welcome back!',
        text: 'You have successfully logged in.',
        timer: 1500,
        showConfirmButton: false,
        background: '#1a1a1a',
        color: '#fff'
      });

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.error || 'An error occurred during login',
        background: '#1a1a1a',
        color: '#fff'
      });
      throw error;
    }
  };

  const register = async (email, password, captchaToken) => {
    try {
      const response = await axios.post('/auth/register', { 
        email, 
        password, 
        captchaToken 
      });
      
      const { token, user } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      
      // Set auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);

      Swal.fire({
        icon: 'success',
        title: 'Welcome!',
        text: 'Your account has been created successfully.',
        timer: 1500,
        showConfirmButton: false,
        background: '#1a1a1a',
        color: '#fff'
      });

      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.error || 'An error occurred during registration',
        background: '#1a1a1a',
        color: '#fff'
      });
      throw error;
    }
  };

  const logout = () => {
    // Clear stored data
    localStorage.removeItem('token');
    
    // Clear auth header
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);

    Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      text: 'You have been successfully logged out.',
      timer: 1500,
      showConfirmButton: false,
      background: '#1a1a1a',
      color: '#fff'
    });
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
