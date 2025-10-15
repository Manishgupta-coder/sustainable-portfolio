import React, { useEffect, useState } from 'react';
import { Search, Eye, Trash2, MessageSquare, Filter, X } from 'lucide-react';
import { supabase } from '../../supabase/supabase';

export default function CustomerQueries() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    const getAllQueries = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
      } else if (data) {
        const formattedData = data.map((item) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          message: item.msg,
          status: item.status.toLowerCase(),
          date: item.date,
          time: item.time,
        }));
        setQueries(formattedData);
      }
    };

    getAllQueries();
  }, []);

  const truncateMessage = (msg, length = 60) => msg.length > length ? msg.substring(0, length) + '...' : msg;

  const handleViewQuery = (query) => {
    setSelectedQuery(query);
    setShowModal(true);
  };

  const handleDeleteQuery = async (id) => {
    if (window.confirm('Are you sure you want to delete this query?')) {
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (error) {
        console.error(error);
      } else {
        setQueries(queries.filter(q => q.id !== id));
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase.from('messages').update({ status: newStatus }).eq('id', id);
    if (error) {
      console.error(error);
    } else {
      setQueries(queries.map(q => q.id === id ? { ...q, status: newStatus } : q));
      if (selectedQuery?.id === id) {
        setSelectedQuery({ ...selectedQuery, status: newStatus });
      }
    }
  };

  const filteredQueries = queries.filter(query => {
    const matchesSearch =
      query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || query.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = queries.filter(q => q.status === 'pending').length;
  const contactedCount = queries.filter(q => q.status === 'contacted').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Queries</h1>
          <p className="text-gray-500">Manage and respond to customer inquiries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Queries</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{queries.length}</p>
              </div>
              <MessageSquare className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{pendingCount}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 font-bold">{pendingCount}</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Contacted</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{contactedCount}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">{contactedCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-700"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
              </select>
            </div>
          </div>
        </div>

        {/* Queries Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredQueries.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No queries found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredQueries.map((query) => (
                    <tr key={query.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{query.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{query.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">{truncateMessage(query.message)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div>{query.date}</div>
                        <div className="text-xs text-gray-500">{query.time}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          query.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewQuery(query)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuery(query.id)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Delete Query"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Query Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</label>
                <p className="mt-2 text-gray-900 font-medium">{selectedQuery.name}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</label>
                <p className="mt-2 text-gray-900">{selectedQuery.email}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Date & Time</label>
                <p className="mt-2 text-gray-900">{selectedQuery.date} at {selectedQuery.time}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Message</label>
                <p className="mt-2 text-gray-900 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {selectedQuery.message}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider block mb-2">Status</label>
                <select
                  value={selectedQuery.status}
                  onChange={(e) => handleStatusChange(selectedQuery.id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900"
                >
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleStatusChange(selectedQuery.id, 'contacted');
                  setShowModal(false);
                }}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Mark as Contacted
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
