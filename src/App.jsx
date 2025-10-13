import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./page/Landing";
import AdminSignIn from "./page/AdminSignIn";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin-login" element={<AdminSignIn />} />
      </Routes>
    </Router>
  );
};

export default App;
