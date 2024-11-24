import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import Swal from 'sweetalert2';

export default function LinkList() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');

  useEffect(() => {
    fetchLinks();
  }, [currentPage, search, sort]);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/links', {
        params: {
          page: currentPage,
          search,
          sort,
          limit: 10
        }
      });
      setLinks(response.data.links || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Fetch error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch links';
      const statusCode = error.response?.status;
      Swal.fire({
        icon: 'error',
        title: `Error (${statusCode || 'Network Error'})`,
        text: errorMessage,
        background: '#1a1a1a',
        color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (link) => {
    setEditingLink({
      ...link,
      tags: link.tags?.join(', ') || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingLink(null);
  };

  const handleSave = async (link, updatedData) => {
    try {
      const tags = updatedData.tags?.split(',').map(tag => tag.trim()).filter(tag => tag) || [];
      
      const response = await axios.put(`/links/${link._id}`, {
        ...updatedData,
        tags
      });
      
      setLinks(links.map(l => l._id === link._id ? response.data : l));
      setEditingLink(null);
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Link updated successfully',
        background: '#1a1a1a',
        color: '#fff'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to update link',
        background: '#1a1a1a',
        color: '#fff'
      });
    }
  };

  const handleDelete = async (linkId) => {
    try {
      await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        background: '#1a1a1a',
        color: '#fff'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(`/links/${linkId}`);
          setLinks(links.filter(link => link._id !== linkId));
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Your link has been deleted.',
            background: '#1a1a1a',
            color: '#fff'
          });
        }
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to delete link',
        background: '#1a1a1a',
        color: '#fff'
      });
    }
  };

  const handleTogglePrivacy = async (link) => {
    try {
      const response = await axios.put(`/links/${link._id}`, {
        isPublic: !link.isPublic
      });
      const updatedLinks = links.map(l => 
        l._id === link._id ? response.data : l
      );
      setLinks(updatedLinks);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `Link is now ${response.data.isPublic ? 'public' : 'private'}`,
        background: '#1a1a1a',
        color: '#fff',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update privacy setting',
        background: '#1a1a1a',
        color: '#fff'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search links..."
          className="input input-bordered flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select select-bordered"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="-analytics.clicks">Most Clicked</option>
          <option value="analytics.clicks">Least Clicked</option>
        </select>
      </div>

      {links.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold mb-2">No links found</h3>
          <p className="text-gray-500">Create your first shortened link to get started!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {links.map(link => (
            <div key={link._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              {editingLink && editingLink._id === link._id ? (
                <div className="card-body">
                  <input
                    type="text"
                    className="input input-bordered w-full mb-2"
                    value={editingLink.originalUrl}
                    onChange={(e) => setEditingLink({...editingLink, originalUrl: e.target.value})}
                    placeholder="Original URL"
                  />
                  <input
                    type="text"
                    className="input input-bordered w-full mb-2"
                    value={editingLink.shortCode}
                    onChange={(e) => setEditingLink({...editingLink, shortCode: e.target.value})}
                    placeholder="Short Code"
                  />
                  <input
                    type="text"
                    className="input input-bordered w-full mb-2"
                    value={editingLink.category || ''}
                    onChange={(e) => setEditingLink({...editingLink, category: e.target.value})}
                    placeholder="Category"
                  />
                  <input
                    type="text"
                    className="input input-bordered w-full mb-2"
                    value={editingLink.tags}
                    onChange={(e) => setEditingLink({...editingLink, tags: e.target.value})}
                    placeholder="Tags (comma separated)"
                  />
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Public</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={editingLink.isPublic || false}
                        onChange={(e) => setEditingLink({...editingLink, isPublic: e.target.checked})}
                      />
                    </label>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <button
                      className="btn btn-ghost"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleSave(link, editingLink)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card-body">
                  <h2 className="card-title">
                    {link.shortCode}
                    <span className={`badge ${!link.isPublic ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {!link.isPublic ? 'Private' : 'Public'}
                    </span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    <div>
                      <p className="text-sm opacity-70">Original URL:</p>
                      <a
                        href={link.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary break-all"
                      >
                        {link.originalUrl}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm opacity-70">Short URL:</p>
                      <a
                        href={`http://localhost:5000/${link.shortCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary"
                      >
                        localhost:5000/{link.shortCode}
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {link.tags?.map(tag => (
                      <div key={tag} className="badge badge-outline">{tag}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm opacity-70">
                    <div>Category: {link.category || 'Uncategorized'}</div>
                    <div>Clicks: {link.analytics?.clicks || 0}</div>
                    <div>Created: {new Date(link.createdAt).toLocaleDateString()}</div>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <button
                      className="btn btn-circle btn-sm bg-blue-100 hover:bg-blue-200 text-blue-800 border-none"
                      onClick={() => handleTogglePrivacy(link)}
                      title={`Make ${!link.isPublic ? 'Public' : 'Private'}`}
                    >
                      {!link.isPublic ? '🔒' : '🌎'}
                    </button>
                    <button
                      className="btn btn-circle btn-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-none"
                      onClick={() => handleEdit(link)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-circle btn-sm bg-red-100 hover:bg-red-200 text-red-800 border-none"
                      onClick={() => handleDelete(link._id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center space-x-4 mt-8">
        <button
          className="btn btn-outline"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="self-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-outline"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
