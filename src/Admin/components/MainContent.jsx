import React from 'react'
import {CheckCircle, AlertCircle} from 'lucide-react'
function MainContent() {
    const stats = [
    { label: 'Total Users', value: '12,543', change: '+12%', trend: 'up' },
    { label: 'Active Projects', value: '847', change: '+8%', trend: 'up' },
    { label: 'Carbon Saved', value: '2.4M kg', change: '+15%', trend: 'up' },
    { label: 'Communities', value: '156', change: '+5%', trend: 'up' }
  ];

  const recentActivity = [
    { type: 'success', message: 'New user registered: Sarah Johnson', time: '2 min ago' },
    { type: 'info', message: 'Project "Ocean Cleanup" updated', time: '15 min ago' },
    { type: 'success', message: 'Carbon report generated successfully', time: '1 hour ago' },
    { type: 'warning', message: 'Pending content approval (3 items)', time: '2 hours ago' }
  ];
  return (
    <>
        
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-xl p-6 text-white shadow-lg">
              <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
              <p className="text-blue-100">Here's what's happening with your environmental platform today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{stat.label}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      stat.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                </div>
                <div className="p-6 space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'success' ? 'bg-green-100' :
                        activity.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        {activity.type === 'success' ? (
                          <CheckCircle className={`w-4 h-4 ${activity.type === 'success' ? 'text-green-600' : ''}`} />
                        ) : (
                          <AlertCircle className={`w-4 h-4 ${activity.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'}`} />
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
            </div>
          </div>
    </>
  )
}

export default MainContent