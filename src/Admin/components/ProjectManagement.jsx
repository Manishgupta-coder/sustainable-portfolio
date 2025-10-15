import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/supabase';
import { Search, Eye, Trash2, Edit, Plus, X, Loader2, AlertCircle, ImagePlus, Upload } from 'lucide-react';

export default function ProjectManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    imageUrl: ''
  });

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects');
    } else {
      setProjects(data || []);
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
      setFormData({ ...formData, image: file });
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const uploadImage = async (file) => {
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
      setError('Failed to upload image: ' + error.message);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('hero-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: null,
      imageUrl: ''
    });
    setImagePreview(null);
    setError('');
  };

  const removeImagePreview = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setFormData({ ...formData, image: null, imageUrl: '' });
  };

  const handleAddProject = () => {
    resetForm();
    setModalMode('add');
    setShowModal(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: null,
      imageUrl: project.image
    });
    setImagePreview(project.image);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDeleteProject = async (id, imageUrl) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setLoading(true);

      // Delete from database
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(error);
        setError('Failed to delete project');
      } else {
        // Optional: Delete image from storage
        if (imageUrl) {
          const fileName = imageUrl.split('/').pop();
          await supabase.storage.from('hero-images').remove([fileName]);
        }
        fetchProjects();
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.imageUrl && !formData.image) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    let imageUrl = formData.imageUrl;

    // Upload new image if selected
    if (formData.image instanceof File) {
      imageUrl = await uploadImage(formData.image);
      if (!imageUrl) {
        setLoading(false);
        return;
      }
    }

    const projectData = {
      title: formData.title,
      description: formData.description,
      image: imageUrl
    };

    if (modalMode === 'add') {
      const { error } = await supabase
        .from('projects')
        .insert([projectData]);

      if (error) {
        console.error(error);
        setError('Failed to add project');
      } else {
        setError('');
        alert('✅ Project added successfully!');
        setShowModal(false);
        resetForm();
        fetchProjects();
      }
    } else if (modalMode === 'edit') {
      const { error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', selectedProject.id);

      if (error) {
        console.error(error);
        setError('Failed to update project');
      } else {
        setError('');
        alert('✅ Project updated successfully!');
        setShowModal(false);
        resetForm();
        fetchProjects();
      }
    }

    setLoading(false);
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-3xl p-6 md:p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Project Management
              </h1>
              <p className="text-gray-500 text-sm md:text-base">
                Manage your projects with images and descriptions
              </p>
            </div>
            <button
              onClick={handleAddProject}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Project
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{projects.length}</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
              <ImagePlus className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {loading && projects.length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-3xl shadow-lg">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white shadow-lg rounded-3xl p-12 text-center border border-gray-100">
            <ImagePlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Projects Yet</h3>
            <p className="text-gray-500">Add your first project to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleViewProject(project)}
                      className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleEditProject(project)}
                      className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id, project.image)}
                      className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
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
                {modalMode === 'view' ? 'Project Details' : modalMode === 'add' ? 'Add New Project' : 'Edit Project'}
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
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-64 object-cover"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Title</label>
                  <p className="mt-2 text-gray-900 font-medium text-xl">{selectedProject.title}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Description</label>
                  <p className="mt-2 text-gray-900 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-200">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleEditProject(selectedProject)}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                  >
                    Edit Project
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

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Project Image *
                  </label>

                  {imagePreview ? (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-2xl border-2 border-gray-200 shadow-sm"
                      />
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
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImagePlus className="w-12 h-12 text-gray-400 group-hover:text-indigo-600 mb-3 transition-colors" />
                        <p className="mb-2 text-sm text-gray-600 font-medium">
                          <span className="text-indigo-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Title Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter project title"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows="5"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter project description"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
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
                        {modalMode === 'add' ? 'Add Project' : 'Save Changes'}
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
