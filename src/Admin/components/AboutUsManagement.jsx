import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase";
import { Save, Loader2, CheckCircle, AlertCircle, Info } from "lucide-react";

export default function AboutUsManagement() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [aboutId, setAboutId] = useState(null);

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("about_us").select("*").single();

    if (error) {
      console.error(error);
      if (error.code !== "PGRST116") {
        setMessage({ type: "error", text: "Failed to fetch data" });
      }
    } else {
      setTitle(data.title || "");
      setDescription(data.description || "");
      setAboutId(data.id);
    }

    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setMessage({ type: "error", text: "Title and Description are required" });
      return;
    }

    setSaving(true);

    const aboutData = {
      title,
      description,
      updated_at: new Date().toISOString(),
    };

    let result;
    if (aboutId) {
      result = await supabase.from("about_us").update(aboutData).eq("id", aboutId);
    } else {
      result = await supabase.from("about_us").insert([aboutData]).select().single();
    }

    const { error } = result;
    if (error) {
      setMessage({ type: "error", text: "Failed to save About Us data" });
    } else {
      if (!aboutId && result.data) setAboutId(result.data.id);
      setMessage({ type: "success", text: "About Us saved successfully!" });
    }

    setSaving(false);
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-3xl p-6 md:p-8 flex justify-between items-center border border-gray-100 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              About Us Management
            </h1>
            <p className="text-gray-500">Manage your company About Us section</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
            <Info className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-2xl border-2 flex items-start gap-3 ${
              message.type === "success"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <p
              className={`text-sm font-medium ${
                message.type === "success" ? "text-green-800" : "text-red-800"
              }`}
            >
              {message.text}
            </p>
          </div>
        )}

        {/* Form */}
        {loading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-3xl shadow-lg">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-gray-100 space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., About Our Company"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description (Press Enter twice for new paragraph) *
              </label>
              <textarea
                rows="8"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write about your company..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-lg resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
