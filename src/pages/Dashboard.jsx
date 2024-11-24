import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LinkShortener from '../components/LinkShortener';
import LinkList from '../components/LinkList';
import { Helmet } from 'react-helmet-async';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('links');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>Dasbor | JAPIN URL</title>
        <meta name="description" content="Kelola tautan pendek Anda dan lihat analitik penggunaan di dasbor JAPIN URL." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-base-200">
        <div className="navbar bg-base-100 shadow-lg">
          <div className="flex-1">
            <span className="text-xl font-bold px-4">Dashboard</span>
          </div>
          <div className="flex-none">
            <button onClick={handleLogout} className="btn btn-ghost">
              Logout
            </button>
          </div>
        </div>

        <div className="container mx-auto p-4">
          <div className="tabs tabs-boxed mb-4">
            <button
              className={`tab ${activeTab === 'links' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('links')}
            >
              Tautan Saya
            </button>
            <button
              className={`tab ${activeTab === 'create' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('create')}
            >
              Buat Tautan
            </button>
          </div>

          <div className="mt-4">
            {activeTab === 'links' && <LinkList />}
            {activeTab === 'create' && <LinkShortener />}
          </div>
        </div>
      </div>
    </>
  );
}
