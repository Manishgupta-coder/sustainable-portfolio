import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./page/Landing";
import AdminSignIn from "./page/AdminSignIn";
import ForgotPasswordPage from "./page/ForgotPasswordPage";
import ResetPasswordPage from "./page/ResetPasswordPage";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";
import AdminDashboard from "./Admin/pages/Dashboard";
import MainContent from "./Admin/components/MainContent";
import CustomerQueries from "./Admin/components/CustomerQueries";
import ProjectManagement from "./Admin/components/ProjectManagement";
import AdminSettingsPage from "./Admin/components/AdminSettingsPage";
import HeroManagement from "./Admin/components/HeroManagement";
import ClientManagement from "./Admin/components/ClientManagement";
import ContactSection from "./Admin/components/ContactSectionUnified";
import { supabase } from "./supabase/supabase";
// import AboutUsManagement from "./Admin/components/AboutUsManagement";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin-login" element={<AdminSignIn />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
        <Route path="/reset-password" element={<ResetPasswordPage/>}/>
        <Route element={<ProtectedRoute/>}>
          <Route path="/dashboard" element={<AdminDashboard/>}>
            <Route index element={<MainContent/>}/>
            <Route path="customerQueries" element={<CustomerQueries/>}/>
            <Route path="projects" element={<ProjectManagement/>}/>
            <Route path="settings" element={<AdminSettingsPage/>}/>
            <Route path="heroSection" element={<HeroManagement/>}/>
            <Route path="clients" element={<ClientManagement/>}/>
            <Route path="contactSection" element={<ContactSection/>}/>
            {/* <Route path="aboutUs" element={<AboutUsManagement/>}/> */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;


