import {React, useEffect, useState} from 'react'
import { Home, Users, FileText, TrendingUp, Settings, Menu, X, LogOut, Leaf} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase/supabase';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [activeUrl, setActiveUrl] = useState('');
    const location = useLocation();
    const navigate = useNavigate()
    const menuItems = [
    { id: 'overview', icon: Home, label: 'Overview',url: "/dashboard"},
    { id: 'Queries', icon: Users, label: 'Queries',url: "customerQueries" },
    { id: 'Projects', icon: FileText, label: 'Projects',url:"projects" },
    { id: 'heroSection', icon: TrendingUp, label: 'Hero Section',url:"heroSection" },
    { id: 'aboutUs', icon: Settings, label: 'About Us',url:"#" },
    { id: 'clients', icon: Settings, label: 'Clients',url:"clients" },
    { id: 'contactSection', icon: Users, label: 'Contact Section',url:"contactSection" },
    { id: 'settings', icon: Settings, label: 'Settings',url:"settings" },
  ];

  useEffect(()=>{
    const path = window.location.pathname; 
    const lastPart = path.substring(path.lastIndexOf('/') + 1);  
    setActiveUrl(lastPart==="dashboard"?"/dashboard":lastPart);
  },[location])


  const handleLogout = async()=>{
    const {error} = await supabase.auth.signOut()
    if(error){
        console.log(error);
        
    }
    else{
        setTimeout(()=>{
        navigate('/admin-login')
        },2000)
    }
  }

  return (
    <>
        <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 bg-white border-r border-gray-200 flex flex-col shadow-sm`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">EcoAdmin</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
              to={item.url}
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  ((activeUrl === item.url))
                    ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar