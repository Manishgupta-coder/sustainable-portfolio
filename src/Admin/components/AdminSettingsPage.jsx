import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock } from "lucide-react";
import { supabase } from '../../supabase/supabase';

export default function ChangePasswordSection() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (newPassword !== confirmPassword) {
      setMessage({ text: "New passwords do not match.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        setMessage({ text: "User not found.", type: "error" });
        setLoading(false);
        return;
      }

      // ✅ Reauthenticate user with old password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword,
      });

      if (signInError) {
        setMessage({ text: "Old password is incorrect.", type: "error" });
        setLoading(false);
        return;
      }

      // ✅ Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setMessage({ text: updateError.message, type: "error" });
      } else {
        setMessage({
          text: "Password updated successfully!",
          type: "success",
        });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Something went wrong.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 p-8"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Change Password
      </h2>

      <form onSubmit={handlePasswordChange} className="space-y-6">
        {/* Old Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <div className="flex items-center border rounded-md px-3">
            <Lock className="h-5 w-5 text-gray-400" />
            <input
              type="password"
              placeholder="Enter current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full py-2 px-2 focus:outline-none text-gray-700"
              required
            />
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="flex items-center border rounded-md px-3">
            <Lock className="h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full py-2 px-2 focus:outline-none text-gray-700"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <div className="flex items-center border rounded-md px-3">
            <Lock className="h-5 w-5 text-gray-400" />
            <input
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full py-2 px-2 focus:outline-none text-gray-700"
              required
            />
          </div>
        </div>

        {/* Status Message */}
        {message.text && (
          <p
            className={`text-sm font-medium ${
              message.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message.text}
          </p>
        )}

        <div className="flex justify-end">
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold px-6 py-2.5 rounded-md hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
