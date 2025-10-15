import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/supabase';
import { Search, Eye, Trash2, Edit, Plus, X, Loader2, AlertCircle, Save, Mail, Phone, MapPin } from 'lucide-react';

export default function ContactSectionUnified() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    detail: '',
    description: '',
    icon: 'Mail',
    display_order: 0
  });

  const [sectionData, setSectionData] = useState({
    title: '',
    detail: ''
  });

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    try {
      // Fetch section data (type = 'section')
      const { data: sectionData, error: sectionError } = await supabase
        .from('contact_management')
        .select('*')
        .eq('type', 'section')
        .single();

      // Fetch contact items (type = 'contact') ordered by display_order
      const { data: contactData, error: contactError } = await supabase
        .from('contact_management')
        .select('*')
        .eq('type', 'contact')
        .order('display_order', { ascending: true });

      if (sectionError && sectionError.code !== 'PGRST116') {
        console.error('Error fetching section data:', sectionError);
        setError('Failed to fetch section data: ' + sectionError.message);
      } else if (sectionData) {
        setSectionData({
          title: sectionData.title || '',
          detail: sectionData.detail || ''
        });
      }

      if (contactError) {
        console.error('Error fetching contacts:', contactError);
        setError('Failed to fetch contact information');
      } else {
        setContacts(contactData || []);
      }

      setError('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    }

    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      detail: '',
      description: '',
      icon: 'Mail',
      display_order: 0
    });
    setError('');
  };

  const handleAddContact = () => {
    resetForm();
    // Set default display order for new contact (highest existing order + 1)
    const maxOrder = Math.max(...contacts.map(c => c.display_order || 0), 0);
    setFormData(prev => ({ ...prev, display_order: maxOrder + 1 }));
    setModalMode('add');
    setShowModal(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setFormData({
      title: contact.title,
      detail: contact.detail,
      description: contact.description,
      icon: contact.icon,
      display_order: contact.display_order || 0
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact information?')) {
      setLoading(true);

      const { error } = await supabase
        .from('contact_management')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(error);
        setError('Failed to delete contact information');
      } else {
        setError('');
        alert('✅ Contact information deleted successfully!');
        fetchData();
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const contactData = {
        type: 'contact',
        title: formData.title,
        detail: formData.detail,
        description: formData.description,
        icon: formData.icon,
        display_order: formData.display_order
      };

      if (modalMode === 'add') {
        const { data, error } = await supabase
          .from('contact_management')
          .insert([contactData])
          .select();

        if (error) {
          console.error('Insert error:', error);
          setError(`Failed to add contact information: ${error.message}`);
        } else {
          setError('');
          alert('✅ Contact information added successfully!');
          setShowModal(false);
          resetForm();
          fetchData();
        }
      } else if (modalMode === 'edit') {
        const { data, error } = await supabase
          .from('contact_management')
          .update(contactData)
          .eq('id', selectedContact.id)
          .select();

        if (error) {
          console.error('Update error:', error);
          setError(`Failed to update contact information: ${error.message}`);
        } else {
          setError('');
          alert('✅ Contact information updated successfully!');
          setShowModal(false);
          resetForm();
          fetchData();
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

  const handleUpdateSection = async () => {
    setLoading(true);
    
    try {
      // Check if section record exists
      const { data: existingData } = await supabase
        .from('contact_management')
        .select('id')
        .eq('type', 'section')
        .single();

      let result;
      
      if (existingData) {
        // Update existing section record
        result = await supabase
          .from('contact_management')
          .update({
            title: sectionData.title,
            detail: sectionData.detail
          })
          .eq('id', existingData.id);
      } else {
        // Create new section record
        result = await supabase
          .from('contact_management')
          .insert([{
            type: 'section',
            title: sectionData.title,
            detail: sectionData.detail
          }]);
      }

      if (result.error) {
        console.error(result.error);
        setError('Failed to update section data: ' + result.error.message);
      } else {
        setError('');
        alert('✅ Section data updated successfully!');
        fetchData();
      }
    } catch (error) {
      console.error('Error updating section:', error);
      setError('Failed to update section data');
    }

    setLoading(false);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIconComponent = (iconName) => {
    const iconMap = {
      Mail: <Mail className="w-6 h-6 text-green-400" />,
      Phone: <Phone className="w-6 h-6 text-green-400" />,
      MapPin: <MapPin className="w-6 h-6 text-green-400" />
    };
    return iconMap[iconName] || <Mail className="w-6 h-6 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-3xl p-6 md:p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                Contact Section Management (Unified)
              </h1>
              <p className="text-gray-500 text-sm md:text-base">
                Manage contact section and individual contact items in one unified table
              </p>
            </div>
          </div>
        </div>

        {/* Section Data Management */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Section Heading & Subheading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Heading</label>
              <input
                type="text"
                value={sectionData.title}
                onChange={(e) => setSectionData({ ...sectionData, title: e.target.value })}
                placeholder="Enter section heading"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subheading</label>
              <input
                type="text"
                value={sectionData.detail}
                onChange={(e) => setSectionData({ ...sectionData, detail: e.target.value })}
                placeholder="Enter section subheading"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>
          <button
            onClick={handleUpdateSection}
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Section Data
              </>
            )}
          </button>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Contact Items</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{contacts.length}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-green-600 p-4 rounded-2xl shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Search and Add Button */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search contact information..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleAddContact}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Contact
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Contacts Grid */}
        {loading && contacts.length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-3xl shadow-lg">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="bg-white shadow-lg rounded-3xl p-12 text-center border border-gray-100">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Contact Information</h3>
            <p className="text-gray-500">Add your first contact information to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {getIconComponent(contact.icon)}
                    <h3 className="text-lg font-bold text-gray-800">{contact.title}</h3>
                  </div>
                  
                  <p className="text-green-600 font-medium mb-2">{contact.detail}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{contact.description}</p>

                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleViewContact(contact)}
                      className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleEditContact(contact)}
                      className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="flex items-center justify-center p-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
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
                {modalMode === 'view' ? 'Contact Details' : modalMode === 'add' ? 'Add New Contact' : 'Edit Contact'}
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
                <div className="flex items-center gap-3">
                  {getIconComponent(selectedContact.icon)}
                  <h3 className="text-xl font-bold text-gray-900">{selectedContact.title}</h3>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Detail</label>
                  <p className="mt-2 text-green-600 font-medium text-lg">{selectedContact.detail}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Description</label>
                  <p className="mt-2 text-gray-900 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-200">
                    {selectedContact.description}
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
                    onClick={() => handleEditContact(selectedContact)}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all shadow-lg"
                  >
                    Edit Contact
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
                    placeholder="Enter contact title"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                {/* Detail Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Detail *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.detail}
                    onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                    placeholder="Enter contact detail (email, phone, address)"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter contact description"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Icon *
                  </label>
                  <select
                    required
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  >
                    <option value="Mail">Mail</option>
                    <option value="Phone">Phone</option>
                    <option value="MapPin">MapPin</option>
                  </select>
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Display Order *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                    placeholder="Enter display order (1, 2, 3...)"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Lower numbers appear first. Current order: Email Us (1), Call Us (2), Visit Us (3)
                  </p>
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
                    disabled={loading}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {modalMode === 'add' ? 'Add Contact' : 'Save Changes'}
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
