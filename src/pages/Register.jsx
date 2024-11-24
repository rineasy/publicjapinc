import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReCAPTCHA from 'react-google-recaptcha';
import { Helmet } from 'react-helmet-async';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Kata sandi tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      setError('Kata sandi harus minimal 6 karakter');
      return;
    }

    if (!captchaToken) {
      setError('Mohon selesaikan captcha');
      return;
    }

    try {
      await register({ ...formData, captchaToken });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaToken(value);
  };

  return (
    <>
      <Helmet>
        <title>Daftar | JAPIN URL</title>
        <meta name="description" content="Daftar akun JAPIN URL untuk mulai membuat dan mengelola tautan pendek Anda dengan fitur analitik yang lengkap." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center text-2xl font-bold mb-4">Buat Akun</h2>
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nama Lengkap</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="input input-bordered"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  className="input input-bordered"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Kata Sandi</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="input input-bordered"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Konfirmasi Kata Sandi</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  className="input input-bordered"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control mt-4">
                <ReCAPTCHA
                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                  onChange={handleCaptchaChange}
                />
              </div>
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary" disabled={!captchaToken}>
                  Daftar
                </button>
              </div>
              <div className="text-center mt-4">
                <p>
                  Sudah punya akun?{' '}
                  <Link to="/login" className="link link-primary">
                    Masuk
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
