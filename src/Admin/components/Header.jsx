import React from 'react'
import {Bell, ChevronDown, Search} from 'lucide-react'
function Header() {
  return (
    <>
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Admin User</div>
                <div className="text-xs text-gray-500">admin@eco.com</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center text-white font-semibold">
                AU
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </header>
    </>
  )
}

export default Header