import React, { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../supabase/supabase";
import { useNavigate } from "react-router-dom";

function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const navigate = useNavigate()

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match!" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setStatus({ type: "error", message: error.message });
    } else {
      setStatus({
        type: "success",
        message: "Password reset successful! You can now log in.",
      });

      setTimeout(()=>{
        navigate('/admin-login')
      },2000)

    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-lg rounded-2xl p-8 w-[380px] text-center"
      >
        {/* Icon with animation */}
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="flex justify-center mb-4"
        >
          <div className="bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-xl">
            <Lock className="h-6 w-6 text-white" />
          </div>
        </motion.div>

        <h2 className="text-2xl font-semibold mb-2">Reset Password</h2>
        <p className="text-gray-500 text-sm mb-6">
          Enter your new password below to reset your account.
        </p>

        <form onSubmit={handlePasswordReset}>
          {/* New Password */}
          <div className="text-left mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="flex items-center border rounded-md px-3">
              <Lock className="h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="w-full py-2 px-2 focus:outline-none text-gray-700"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="text-left mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="flex items-center border rounded-md px-3">
              <Lock className="h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full py-2 px-2 focus:outline-none text-gray-700"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Status Message */}
          {status.message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 text-sm mb-4 ${
                status.type === "error"
                  ? "text-red-600 bg-red-50 p-2 rounded-md"
                  : "text-green-600 bg-green-50 p-2 rounded-md"
              }`}
            >
              {status.type === "error" ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              {status.message}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-green-500 text-white w-full py-2.5 rounded-md font-semibold hover:opacity-90 transition-all flex items-center justify-center"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
          </motion.button>
        </form>

        <p className="text-xs text-gray-400 mt-6">
          © 2025 SustainEco Systems & Services
        </p>
      </motion.div>
    </div>
  );
}

export default ResetPasswordPage;
