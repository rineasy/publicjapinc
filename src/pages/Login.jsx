import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReCAPTCHA from 'react-google-recaptcha';
import { Helmet } from 'react-helmet-async';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const recaptchaRef = useRef(null);

  useEffect(() => {
    // Reset error when form data changes
    if (error) setError('');
  }, [formData]);

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
    setLoading(true);

    if (!captchaToken) {
      setError('Mohon selesaikan captcha');
      setLoading(false);
      return;
    }

    try {
      await login({ ...formData, captchaToken });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal masuk. Silakan coba lagi.');
      // Reset reCAPTCHA on error
      recaptchaRef.current?.reset();
      setCaptchaToken('');
    } finally {
      setLoading(false);
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaToken(value);
    setError('');
  };

  const handleCaptchaExpired = () => {
    setCaptchaToken('');
  };

  return (
    <>
      <Helmet>
        <title>Masuk | JAPIN URL</title>
        <meta name="description" content="Masuk ke akun JAPIN URL Anda untuk mengelola tautan pendek dan melihat analitik." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center text-2xl font-bold mb-4">Masuk</h2>
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="form-control mt-4">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                  onChange={handleCaptchaChange}
                  onExpired={handleCaptchaExpired}
                />
              </div>
              <div className="form-control mt-6">
                <button 
                  type="submit" 
                  className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                  disabled={loading || !captchaToken}
                >
                  {loading ? 'Sedang Masuk...' : 'Masuk'}
                </button>
              </div>
            </form>

            <div className="text-center mt-4">
              <p>
                Belum punya akun?{' '}
                <Link to="/register" className="link link-primary">
                  Daftar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
