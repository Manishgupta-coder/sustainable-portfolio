import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MainContent from '../components/MainContent';
import { Outlet } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Sidebar/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header/>
        <main className="flex-1 overflow-y-auto p-6">
        <Outlet/>
        </main>
        {/* <MainContent/> */}
      </div>
    </div>
  );
}