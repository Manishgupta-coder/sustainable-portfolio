import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/supabase';
import { Save, Upload, ImagePlus, Loader2, AlertCircle } from 'lucide-react';

export default function HeroManagement() {
  const [hero, setHero] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: null,
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('hero_section').select('*').limit(1).single();
    if (error && error.code !== 'PGRST116') { // no rows case
      console.error(error);
      setError('Failed to fetch hero section');
    } else {
      setHero(data);
      if (data) {
        setFormData({
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          image: null,
          imageUrl: data.image_url
        });
      }
      setError('');
    }
    setLoading(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be under 5MB');
      return;
    }
    setError('');
    setFormData({ ...formData, image: file });
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `hero-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage.from('hero-images').upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });

    setUploading(false);

    if (error) {
      console.error(error);
      setError('Image upload failed');
      return null;
    }

    const { data } = supabase.storage.from('hero-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    const heroData = {
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      image_url: imageUrl
    };

    let result;
    if (hero) {
      result = await supabase.from('hero_section').update(heroData).eq('id', hero.id);
    } else {
      result = await supabase.from('hero_section').insert([heroData]);
    }

    if (result.error) {
      console.error(result.error);
      setError('Failed to save hero section');
    } else {
      setError('');
      alert('✅ Hero section saved successfully!');
      fetchHero();
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
          Hero Section Management
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="text-center">
            <label className="block font-semibold text-gray-700 mb-3">Hero Image *</label>
            <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-green-500 transition">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Hero Preview"
                  className="w-full max-h-64 object-cover rounded-xl mb-4"
                />
              ) : (
                <ImagePlus className="w-12 h-12 text-gray-400 mb-3" />
              )}
              <label className="cursor-pointer bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-xl font-medium hover:opacity-90 transition">
                <Upload className="inline w-4 h-4 mr-2" />
                {formData.imageUrl ? 'Change Image' : 'Upload Image'}
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </label>
            </div>
          </div>

          {/* Text Inputs */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter hero title"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle *</label>
            <input
              type="text"
              required
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Enter subtitle"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
            <textarea
              required
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter hero description"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none"
            ></textarea>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            {loading || uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {uploading ? 'Uploading...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Hero Section
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
