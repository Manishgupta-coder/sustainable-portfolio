import React, { useState, useEffect } from "react";
import { supabase } from "../supabase/supabase";
import { Mail, Phone, MapPin, Plus, Trash2, Save } from "lucide-react";
import { motion } from "framer-motion";

function ContactAdminPanel() {
  const [contactInfo, setContactInfo] = useState([]);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data: contactData } = await supabase
      .from("contact_info")
      .select("*")
      .order("created_at", { ascending: true });

    const { data: sectionData } = await supabase
      .from("contact_section")
      .select("*")
      .single();

    setContactInfo(contactData || []);
    if (sectionData) {
      setHeading(sectionData.heading);
      setSubheading(sectionData.subheading);
    }

    setLoading(false);
  };

  const handleAddCard = async () => {
    const { error } = await supabase.from("contact_info").insert([
      {
        title: "New Title",
        detail: "New Detail",
        description: "Add description here...",
        icon: "Mail",
      },
    ]);
    if (!error) fetchData();
  };

  const handleDeleteCard = async (id) => {
    const { error } = await supabase.from("contact_info").delete().eq("id", id);
    if (!error) fetchData();
  };

  const handleSaveCard = async (item) => {
    const { error } = await supabase
      .from("contact_info")
      .update({
        title: item.title,
        detail: item.detail,
        description: item.description,
        icon: item.icon,
      })
      .eq("id", item.id);

    if (!error) {
      setEditingItem(null);
      fetchData();
    }
  };

  const handleUpdateHeading = async () => {
    const { error } = await supabase
      .from("contact_section")
      .update({
        heading,
        subheading,
      })
      .eq("id", (await supabase.from("contact_section").select("id").single()).data.id);

    if (!error) alert("Heading updated successfully!");
  };

  const iconMap = {
    Mail: <Mail className="w-6 h-6 text-green-400" />,
    Phone: <Phone className="w-6 h-6 text-green-400" />,
    MapPin: <MapPin className="w-6 h-6 text-green-400" />,
  };

  if (loading)
    return <div className="text-center text-gray-500 py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-6">🛠 Contact Section Admin Panel</h1>

      {/* Update heading */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Section Heading</h2>
        <input
          type="text"
          className="w-full border rounded-md p-2 mb-3"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
        />
        <textarea
          rows="3"
          className="w-full border rounded-md p-2 mb-3"
          value={subheading}
          onChange={(e) => setSubheading(e.target.value)}
        />
        <button
          onClick={handleUpdateHeading}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Save Heading
        </button>
      </div>

      {/* Contact Cards */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Contact Cards</h2>
        <button
          onClick={handleAddCard}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus size={18} /> Add Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactInfo.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-5 rounded-xl shadow border"
          >
            {editingItem === item.id ? (
              <>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) =>
                    setContactInfo((prev) =>
                      prev.map((c) =>
                        c.id === item.id ? { ...c, title: e.target.value } : c
                      )
                    )
                  }
                  className="w-full border p-2 rounded mb-2"
                />
                <input
                  type="text"
                  value={item.detail}
                  onChange={(e) =>
                    setContactInfo((prev) =>
                      prev.map((c) =>
                        c.id === item.id ? { ...c, detail: e.target.value } : c
                      )
                    )
                  }
                  className="w-full border p-2 rounded mb-2"
                />
                <textarea
                  value={item.description}
                  onChange={(e) =>
                    setContactInfo((prev) =>
                      prev.map((c) =>
                        c.id === item.id
                          ? { ...c, description: e.target.value }
                          : c
                      )
                    )
                  }
                  className="w-full border p-2 rounded mb-2"
                />
                <select
                  value={item.icon}
                  onChange={(e) =>
                    setContactInfo((prev) =>
                      prev.map((c) =>
                        c.id === item.id ? { ...c, icon: e.target.value } : c
                      )
                    )
                  }
                  className="w-full border p-2 rounded mb-4"
                >
                  <option value="Mail">Mail</option>
                  <option value="Phone">Phone</option>
                  <option value="MapPin">MapPin</option>
                </select>

                <button
                  onClick={() => handleSaveCard(item)}
                  className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 mr-2"
                >
                  <Save size={16} /> Save
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-2">
                  {iconMap[item.icon] || <Mail className="w-6 h-6 text-gray-400" />}
                  <h3 className="font-bold text-lg">{item.title}</h3>
                </div>
                <p className="text-green-600 font-medium">{item.detail}</p>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>

                <div className="flex justify-between">
                  <button
                    onClick={() => setEditingItem(item.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCard(item.id)}
                    className="text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ContactAdminPanel;
