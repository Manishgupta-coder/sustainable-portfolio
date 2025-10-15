import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "../supabase/supabase";
import { Link } from "react-router-dom";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password", // change to your frontend reset URL
    });

    if (error) {
      setStatus({ type: "error", message: error.message });
    } else {
      setStatus({
        type: "success",
        message: "Password reset email sent! Check your inbox.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[380px] text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-xl">
            <Mail className="h-6 w-6 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-2">Forgot Password?</h2>
        <p className="text-gray-500 text-sm mb-6">
          Enter your email address and we’ll send you a reset link.
        </p>

        <form onSubmit={handlePasswordReset}>
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="flex items-center border rounded-md mb-4 px-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="admin@sustainco.com"
                className="w-full py-2 px-2 focus:outline-none text-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {status.message && (
            <div
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
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-green-500 text-white w-full py-2.5 rounded-md font-semibold hover:opacity-90 transition-all flex items-center justify-center"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Reset Link"}
          </button>
        </form>

        <div className="flex justify-center mt-6">
          <Link
            to="/admin-login"
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          © 2025 SustainEco Systems & Services
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
