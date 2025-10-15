import React, { useEffect, useState, useRef } from 'react';
import { Bell, ChevronDown, Search } from 'lucide-react';
import { supabase } from '../../supabase/supabase';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user on mount
  useEffect(() => {
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(session.user);
      else setUser(null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const getUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) console.error('Error fetching user:', error.message);
    else setUser(data.user);
  };

  // Sign Out
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error.message);
    else navigate('/admin-login'); // Redirect to login page
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (nameOrEmail) => {
    if (!nameOrEmail) return 'AU';
    const name = nameOrEmail.split('@')[0];
    const parts = name.split('.');
    if (parts.length > 1) return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Search */}
      {/* <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>
      </div> */}

      {/* Notifications & Profile */}
      <div className="flex items-center gap-4 justify-end flex-1">
        {/* <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
        </button> */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 pl-4 border-l border-gray-200"
          >
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Admin User'}
              </div>
              <div className="text-xs text-gray-500">
                {user?.email || 'admin@eco.com'}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center text-white font-semibold">
              {getInitials(user?.user_metadata?.name || user?.email)}
            </div>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-xl text-gray-900 font-medium"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
