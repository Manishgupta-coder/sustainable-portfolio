import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../supabase/supabase';

function Overview() {
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // Fetch stats and activity on mount
  useEffect(() => {
    fetchStats();
    fetchActivity();

    // Optionally add realtime subscriptions for instant updates
    const statsSub = supabase
      .channel('public:overview_stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'overview_stats' }, (payload) => {
        fetchStats(); // Refetch on any change
      })
      .subscribe();

    const activitySub = supabase
      .channel('public:recent_activity')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'recent_activity' }, (payload) => {
        fetchActivity(); // Refetch on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(statsSub);
      supabase.removeChannel(activitySub);
    };
  }, []);

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from('overview_stats')
      .select('*')
      .order('id', { ascending: true });

    if (!error && data) setStats(data);
  };

  const fetchActivity = async () => {
    const { data, error } = await supabase
      .from('recent_activity')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(7); // Show recent 7 activities

    if (!error && data) setRecentActivity(data);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8">
      {/* Welcome Header */}
      <section className="bg-gradient-to-r from-blue-600 to-green-500 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Overview Dashboard</h1>
        <p className="text-blue-100">Get the latest on users, projects, and platform activity.</p>
      </section>

      {/* Stats Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(stat => (
            <div key={stat.id}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{stat.label}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  stat.trend === 'up'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Grid: Recent Activity and Quick Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6 space-y-4">
            {recentActivity.map(activity => (
              <div key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'success' ? 'bg-green-100'
                  : activity.type === 'warning' ? 'bg-yellow-100'
                  : 'bg-blue-100'
                }`}>
                  {activity.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className={`w-4 h-4 ${
                      activity.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-3">
            <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-lg font-medium hover:shadow-lg transition-all">
              Add New User
            </button>
            <button className="w-full px-4 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Create Project
            </button>
            <button className="w-full px-4 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Generate Report
            </button>
            <button className="w-full px-4 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              View Analytics
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Overview;
