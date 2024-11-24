import { useState } from 'react';
import axiosInstance from '../utils/axios';

export default function LinkShortener() {
  const [formData, setFormData] = useState({
    originalUrl: '',
    title: '',
    tags: '',
    category: '',
    isPublic: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateUrl(formData.originalUrl)) {
      setError('Mohon masukkan URL yang valid');
      setLoading(false);
      return;
    }

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      const response = await axiosInstance.post('/links', {
        ...formData,
        tags: tagsArray
      });

      const shortUrl = `http://localhost:5000/${response.data.shortCode}`;
      setSuccess(`Tautan berhasil dipersingkat! URL pendek Anda adalah: ${shortUrl}`);
      setFormData({
        originalUrl: '',
        title: '',
        tags: '',
        category: '',
        isPublic: false
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal mempersingkat tautan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="card-body">
          <h2 className="text-2xl font-bold mb-6">Buat Tautan Baru</h2>
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="alert alert-success mb-4">
              <span>{success}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">URL untuk Dipersingkat*</span>
              </label>
              <input
                type="url"
                name="originalUrl"
                placeholder="https://example.com"
                className="input input-bordered bg-base-200 focus:bg-base-100 transition-colors duration-200"
                value={formData.originalUrl}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Judul*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="Tautan Keren Saya"
                className="input input-bordered bg-base-200 focus:bg-base-100 transition-colors duration-200"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Tag</span>
                </label>
                <input
                  type="text"
                  name="tags"
                  placeholder="sosial, pemasaran, blog"
                  className="input input-bordered bg-base-200 focus:bg-base-100 transition-colors duration-200"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Kategori</span>
                </label>
                <input
                  type="text"
                  name="category"
                  placeholder="Pemasaran"
                  className="input input-bordered bg-base-200 focus:bg-base-100 transition-colors duration-200"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-control bg-base-200 p-4 rounded-lg">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  type="checkbox"
                  name="isPublic"
                  className="toggle toggle-primary"
                  checked={formData.isPublic}
                  onChange={handleChange}
                />
                <span className="label-text font-medium">Jadikan tautan ini publik</span>
              </label>
            </div>

            <div className="form-control mt-6">
              <button 
                type="submit" 
                className={`btn btn-primary w-full ${loading ? 'loading' : ''}`} 
                disabled={loading}
              >
                {loading ? 'Membuat...' : 'Buat Tautan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
