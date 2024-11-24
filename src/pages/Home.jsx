import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPublicLinks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/links/public', {
        params: { search, category, tag, sort, page }
      });
      setLinks(response.data.links);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch links');
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicLinks();
  }, [search, category, tag, sort, page]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "JAPIN URL",
    "applicationCategory": "UtilityApplication",
    "description": "Layanan pemendek URL dengan analitik yang kuat dan kontrol privasi untuk mengelola dan melacak tautan secara efektif.",
    "operatingSystem": "Web browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "IDR"
    },
    "url": window.location.origin
  };

  if (loading) return (
    <>
      <Helmet>
        <title>Memuat... | JAPIN URL</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-200"></div>
      </div>
    </>
  );

  return (
    <>
      <Helmet>
        <title>JAPIN URL - Persingkat, Bagikan, dan Lacak Tautan Anda</title>
        <meta name="description" content="JAPIN URL adalah layanan pemendek URL gratis dengan fitur analitik yang kuat dan kontrol privasi. Persingkat, bagikan, dan lacak tautan Anda dengan mudah." />
        <meta name="keywords" content="pemendek url, url shortener, analitik url, tracking url, manajemen tautan, japin url" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content="JAPIN URL - Persingkat, Bagikan, dan Lacak Tautan Anda" />
        <meta property="og:description" content="Layanan pemendek URL gratis dengan fitur analitik yang kuat dan kontrol privasi. Persingkat, bagikan, dan lacak tautan Anda dengan mudah." />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={window.location.href} />
        <meta name="twitter:title" content="JAPIN URL - Persingkat, Bagikan, dan Lacak Tautan Anda" />
        <meta name="twitter:description" content="Layanan pemendek URL gratis dengan fitur analitik yang kuat dan kontrol privasi. Persingkat, bagikan, dan lacak tautan Anda dengan mudah." />
        
        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Indonesian" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="JAPIN URL" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        
        {/* Canonical URL */}
        <link rel="canonical" href={window.location.origin} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Navbar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="navbar h-16">
              <div className="navbar-start">
                <Link to="/" className="btn btn-ghost text-xl md:text-2xl font-bold text-white">
                  JAPIN<span className="text-emerald-400">URL</span>
                </Link>
              </div>
              <div className="navbar-end">
                {user ? (
                  <Link to="/dashboard" className="btn btn-primary btn-sm md:btn-md">Dashboard</Link>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" className="btn btn-ghost btn-sm md:btn-md text-white">Masuk</Link>
                    <Link to="/register" className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none btn-sm md:btn-md">
                      Daftar
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with padding for fixed navbar */}
        <div className="pt-16">
          {/* Hero Section */}
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold mb-6 text-white">
                Persingkat, Bagikan, <span className="text-emerald-400">Lacak</span>
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Buat URL pendek dengan analitik yang kuat dan kontrol privasi. Bergabung dengan JAPIN URL untuk mengelola dan melacak tautan Anda secara efektif.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 mb-12 border border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Cari tautan..."
                  className="input bg-slate-900/50 border-slate-700 text-white placeholder-slate-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Filter berdasarkan kategori"
                  className="input bg-slate-900/50 border-slate-700 text-white placeholder-slate-400"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Filter berdasarkan tag"
                  className="input bg-slate-900/50 border-slate-700 text-white placeholder-slate-400"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                />
                <select
                  className="select bg-slate-900/50 border-slate-700 text-white"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="-createdAt">Terbaru</option>
                  <option value="createdAt">Terlama</option>
                  <option value="-analytics.clicks">Paling Banyak Diklik</option>
                  <option value="analytics.clicks">Paling Sedikit Diklik</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="alert alert-error mb-8">
                <span>{error}</span>
              </div>
            )}

            {/* Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {links.map(link => (
                <div key={link._id} className="card bg-slate-800/50 backdrop-blur-lg border border-slate-700 hover:bg-slate-700/50 transition-all duration-300">
                  <div className="card-body">
                    <h2 className="card-title text-white">{link.title}</h2>
                    <p className="text-slate-300">{link.description}</p>
                    
                    <div className="flex flex-wrap gap-2 my-3">
                      {link.tags.map(tag => (
                        <span key={tag} className="badge bg-emerald-500/20 text-emerald-200 border-emerald-400/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {link.category && (
                      <div className="text-sm text-slate-400">
                        Category: <span className="text-emerald-400">{link.category}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-4 text-sm text-slate-400">
                      <span>{formatDate(link.createdAt)}</span>
                      <span>{link.analytics?.clicks || 0} clicks</span>
                    </div>
                    
                    <div className="card-actions justify-end mt-4">
                      <a
                        href={`http://localhost:5000/${link.shortCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white border-none"
                      >
                        Kunjungi
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {links.length === 0 && (
              <div className="text-center py-12 text-slate-300">
                <h3 className="text-xl font-semibold mb-2">Tidak ada tautan publik</h3>
                <p>Coba sesuaikan pencarian atau filter Anda</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  className="btn btn-circle bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                >
                  ❮
                </button>
                <span className="flex items-center px-4 text-slate-300">
                  Halaman {page} dari {totalPages}
                </span>
                <button
                  className="btn btn-circle bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                >
                  ❯
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
