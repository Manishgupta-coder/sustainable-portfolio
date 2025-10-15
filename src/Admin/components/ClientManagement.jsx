import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/supabase';
import { Search, Eye, Trash2, Edit, Plus, X, Loader2, AlertCircle, Upload, Building2 } from 'lucide-react';

export default function ClientManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    logo: null,
    logoUrl: ''
  });

  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clients:', error);
      setError('Failed to fetch clients');
    } else {
      setClients(data || []);
    }
    setLoading(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setError('');
      setFormData({ ...formData, logo: file });
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const uploadLogo = async (file) => {
    if (!file) return null;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('hero-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    setUploading(false);

    if (error) {
      console.error('Upload error:', error);
      setError('Failed to upload logo: ' + error.message);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('hero-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      logo: null,
      logoUrl: ''
    });
    setImagePreview(null);
    setError('');
  };

  const removeImagePreview = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setFormData({ ...formData, logo: null, logoUrl: '' });
  };

  const handleAddClient = () => {
    resetForm();
    setModalMode('add');
    setShowModal(true);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      logo: null,
      logoUrl: client.logo
    });
    setImagePreview(client.logo);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleViewClient = (client) => {
    setSelectedClient(client);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDeleteClient = async (id, logoUrl) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setLoading(true);

      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(error);
        setError('Failed to delete client');
      } else {
        // Optional: Delete logo from storage
        if (logoUrl) {
          const fileName = logoUrl.split('/').pop();
          await supabase.storage.from('hero-images').remove([fileName]);
        }
        fetchClients();
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.logoUrl && !formData.logo) {
      setError('Please select a logo');
      return;
    }

    setLoading(true);
    let logoUrl = formData.logoUrl;

    // Upload new logo if selected
    if (formData.logo instanceof File) {
      logoUrl = await uploadLogo(formData.logo);
      if (!logoUrl) {
        setLoading(false);
        return;
      }
    }

    const clientData = {
      name: formData.name,
      logo: logoUrl
    };

    if (modalMode === 'add') {
      const { error } = await supabase
        .from('clients')
        .insert([clientData]);

      if (error) {
        console.error(error);
        setError('Failed to add client');
      } else {
        setError('');
        alert('✅ Client added successfully!');
        setShowModal(false);
        resetForm();
        fetchClients();
      }
    } else if (modalMode === 'edit') {
      const { error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', selectedClient.id);

      if (error) {
        console.error(error);
        setError('Failed to update client');
      } else {
        setError('');
        alert('✅ Client updated successfully!');
        setShowModal(false);
        resetForm();
        fetchClients();
      }
    }

    setLoading(false);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-3xl p-6 md:p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Client Management
              </h1>
              <p className="text-gray-500 text-sm md:text-base">
                Manage your client logos and showcase partnerships
              </p>
            </div>
            <button
              onClick={handleAddClient}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Client
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Clients</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{clients.length}</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Clients Grid */}
        {loading && clients.length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-3xl shadow-lg">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="bg-white shadow-lg rounded-3xl p-12 text-center border border-gray-100">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Clients Yet</h3>
            <p className="text-gray-500">Add your first client to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative overflow-hidden h-40 bg-gray-50 flex items-center justify-center p-4">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-center font-semibold text-gray-800 mb-3 line-clamp-1">
                    {client.name}
                  </h3>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewClient(client)}
                      className="flex-1 flex items-center justify-center gap-1 p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button
                      onClick={() => handleEditClient(client)}
                      className="flex-1 flex items-center justify-center gap-1 p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.id, client.logo)}
                      className="flex items-center justify-center p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalMode === 'view' ? 'Client Details' : modalMode === 'add' ? 'Add New Client' : 'Edit Client'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {modalMode === 'view' ? (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-center bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
                  <img
                    src={selectedClient.logo}
                    alt={selectedClient.name}
                    className="max-w-full max-h-64 object-contain"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Client Name</label>
                  <p className="mt-2 text-gray-900 font-medium text-xl">{selectedClient.name}</p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleEditClient(selectedClient)}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                  >
                    Edit Client
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Error Alert */}
                {error && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Client Logo *
                  </label>

                  {imagePreview ? (
                    <div className="relative group">
                      <div className="flex items-center justify-center bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 min-h-[200px]">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-w-full max-h-48 object-contain"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-3">
                        <label className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Change
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={removeImagePreview}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Building2 className="w-12 h-12 text-gray-400 group-hover:text-indigo-600 mb-3 transition-colors" />
                        <p className="mb-2 text-sm text-gray-600 font-medium">
                          <span className="text-indigo-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, SVG up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    For best results, use a transparent PNG or SVG logo
                  </p>
                </div>

                {/* Client Name Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter client name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading || uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {uploading ? 'Uploading...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        {modalMode === 'add' ? 'Add Client' : 'Save Changes'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
