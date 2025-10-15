import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn } from "lucide-react";
import { supabase } from "../supabase/supabase";
import { Link, useNavigate } from "react-router-dom";

function AdminSignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    const {data,error} = await supabase.auth.signInWithPassword({
        email:formData.email,
        password:formData.password
    })
    if(error){
        console.error(error);
        setLoading(false)
    }
    else{
        navigate('/dashboard')
        console.log(data);
        setLoading(false)
    }
  };


  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 sm:p-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-700 to-green-500 rounded-2xl flex items-center justify-center"
          >
            <LogIn className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Sign In</h2>
          <p className="text-gray-600 mt-2">
            Welcome back! Please log in to your dashboard.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="flex items-center gap-3 border border-gray-300 focus-within:ring-2 focus-within:ring-blue-700 rounded-xl px-4 py-2 bg-white">
              <Mail className="text-blue-700 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="admin@sustainco.com"
                className="w-full outline-none bg-transparent text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="flex items-center gap-3 border border-gray-300 focus-within:ring-2 focus-within:ring-green-500 rounded-xl px-4 py-2 bg-white">
              <Lock className="text-green-600 w-5 h-5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full outline-none bg-transparent text-gray-700"
              />
            </div>
          </div>
          <div className="flex justify-end mt-2 mb-5">
      <Link
        to="/forgot-password"
        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        Forgot Password?
      </Link>
    </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-700 to-green-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} SustainEco Systems & Services
          </p>
        </div>
      </motion.div>
    </section>
  );
}

export default AdminSignIn;
