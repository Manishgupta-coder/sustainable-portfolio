// import React, { useState, useEffect } from 'react';
// import { supabase } from '../../supabase/supabase';
// import { Save, Loader2, AlertCircle, CheckCircle, Info, Bold, Italic, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Image as ImageIcon, Link as LinkIcon, Code, Quote } from 'lucide-react';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextAlign from '@tiptap/extension-text-align';
// import Link from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import TextStyle from '@tiptap/extension-text-style';
// import Color from '@tiptap/extension-color';
// import Highlight from '@tiptap/extension-highlight';

// // Toolbar Component
// const MenuBar = ({ editor }) => {
//   if (!editor) return null;

//   const addImage = () => {
//     const url = window.prompt('Enter image URL:');
//     if (url) {
//       editor.chain().focus().setImage({ src: url }).run();
//     }
//   };

//   const setLink = () => {
//     const url = window.prompt('Enter URL:');
//     if (url) {
//       editor.chain().focus().setLink({ href: url }).run();
//     }
//   };

//   return (
//     <div className="border-b-2 border-gray-200 bg-gray-50 p-3 flex flex-wrap gap-1">
//       {/* Text Formatting */}
//       <button
//         onClick={() => editor.chain().focus().toggleBold().run()}
//         className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
//           editor.isActive('bold') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'
//         }`}
//         title="Bold"
//         type="button"
//       >
//         <Bold className="w-4 h-4" />
//       </button>

//       <button
//         onClick={() => editor.chain().focus().toggleItalic().run()}
//         className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
//           editor.isActive('italic') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'
//         }`}
//         title="Italic"
//         type="button"
//       >
//         <Italic className="w-4 h-4" />
//       </button>

//       <button
//         onClick={() => editor.chain().focus().toggleUnderline().run()}
//         className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
//           editor.isActive('underline') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'
//         }`}
//         title="Underline"
//         type="button"
//       >
//         <Underline className="w-4 h-4" />
//       </button>

//       <div className="w-px h-8 bg-gray-300 mx-1"></div>

//       {/* Headings */}
//       {[1, 2, 3].map((level) => (
//         <button
//           key={level}
//           onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
//           className={`px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors font-semibold ${
//             editor.isActive('heading', { level }) ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'
//           }`}
//           title={`Heading ${level}`}
//           type="button"
//         >
//           H{level}
//         </button>
//       ))}

//       <div className="w-px h-8 bg-gray-300 mx-1"></div>

//       {/* Lists */}
//       <button
//         onClick={() => editor.chain().focus().toggleBulletList().run()}
//         className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
//           editor.isActive('bulletList') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'
//         }`}
//         title="Bullet List"
//         type="button"
//       >
//         <List className="w-4 h-4" />
//       </button>

//       <button
//         onClick={() => editor.chain().focus().toggleOrderedList().run()}
//         className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
//           editor.isActive('orderedList') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'
//         }`}
//         title="Ordered List"
//         type="button"
//       >
//         <ListOrdered className="w-4 h-4" />
//       </button>

//       <div className="w-px h-8 bg-gray-300 mx-1"></div>

//       {/* Alignment */}
//       <button
//         onClick={() => editor.chain().focus().setTextAlign('left').run()}
//         className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
//           editor.isActive({ textAlign: 'left' }) ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'
//         }`}
//         title="Align Left"
//         type="button"
//       >
//         <AlignLeft className="w-4 h-4" />
//       </button>

//       <button
//         onClick={() => editor.chain().focus().setTextAlign('center').run()}
//         className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
//           editor.isActive({ textAlign: 'center' }) ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'
//         }`}
//         title="Align Center"
//         type="button"
//       >
//         <AlignCenter className="w-4 h-4" />
//       </button>

//       <button
//         onClick={() => editor.chain().focus().setTextAlign('right').run()}
//         className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
//           editor.isActive({ textAlign: 'right' }) ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'
//         }`}
//         title="Align Right"
//         type="button"
//       >
//         <AlignRight className="w-4 h-4" />
//       </button>

//       <div className="w-px h-8 bg-gray-300 mx-1"></div>

//       {/* Other Formatting */}
//       <button
//         onClick={() => editor.chain().focus().toggleBlockquote().run()}
//         className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
//           editor.isActive('blockquote') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'
//         }`}
//         title="Blockquote"
//         type="button"
//       >
//         <Quote className="w-4 h-4" />
//       </button>

//       <button
//         onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//         className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
//           editor.isActive('codeBlock') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'
//         }`}
//         title="Code Block"
//         type="button"
//       >
//         <Code className="w-4 h-4" />
//       </button>

//       <div className="w-px h-8 bg-gray-300 mx-1"></div>

//       {/* Media */}
//       <button
//         onClick={setLink}
//         className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
//           editor.isActive('link') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'
//         }`}
//         title="Add Link"
//         type="button"
//       >
//         <LinkIcon className="w-4 h-4" />
//       </button>

//       <button
//         onClick={addImage}
//         className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-700"
//         title="Add Image"
//         type="button"
//       >
//         <ImageIcon className="w-4 h-4" />
//       </button>

//       <div className="w-px h-8 bg-gray-300 mx-1"></div>

//       {/* Color Picker */}
//       <input
//         type="color"
//         onInput={(e) => editor.chain().focus().setColor(e.target.value).run()}
//         value={editor.getAttributes('textStyle').color || '#000000'}
//         className="w-8 h-8 rounded cursor-pointer"
//         title="Text Color"
//       />

//       <input
//         type="color"
//         onInput={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
//         className="w-8 h-8 rounded cursor-pointer"
//         title="Highlight Color"
//       />
//     </div>
//   );
// };

// export default function AboutUsManagement() {
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [title, setTitle] = useState('');
//   const [aboutId, setAboutId] = useState(null);

//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Underline,
//       TextAlign.configure({
//         types: ['heading', 'paragraph'],
//       }),
//       Link.configure({
//         openOnClick: false,
//       }),
//       Image,
//       TextStyle,
//       Color,
//       Highlight.configure({ multicolor: true }),
//     ],
//     content: '<p>Start writing your about us content...</p>',
//     editorProps: {
//       attributes: {
//         class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] max-h-[600px] overflow-y-auto p-4',
//       },
//     },
//   });

//   useEffect(() => {
//     fetchAboutUs();
//   }, []);

//   const fetchAboutUs = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from('about_us')
//       .select('*')
//       .single();

//     if (error) {
//       if (error.code === 'PGRST116') {
//         console.log('No about us data found');
//       } else {
//         console.error(error);
//         setMessage({ type: 'error', text: 'Failed to fetch data' });
//       }
//     } else {
//       setTitle(data.title || '');
//       if (editor && data.description) {
//         editor.commands.setContent(data.description);
//       }
//       setAboutId(data.id);
//     }
//     setLoading(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!title.trim()) {
//       setMessage({ type: 'error', text: 'Title is required' });
//       return;
//     }

//     const description = editor.getHTML();
//     if (!description || description === '<p></p>') {
//       setMessage({ type: 'error', text: 'Description is required' });
//       return;
//     }

//     setSaving(true);
//     const aboutData = {
//       title: title,
//       description: description,
//       updated_at: new Date().toISOString()
//     };

//     if (aboutId) {
//       const { error } = await supabase
//         .from('about_us')
//         .update(aboutData)
//         .eq('id', aboutId);

//       if (error) {
//         console.error(error);
//         setMessage({ type: 'error', text: 'Failed to update About Us section' });
//       } else {
//         setMessage({ type: 'success', text: 'About Us section updated successfully!' });
//       }
//     } else {
//       const { data, error } = await supabase
//         .from('about_us')
//         .insert([aboutData])
//         .select()
//         .single();

//       if (error) {
//         console.error(error);
//         setMessage({ type: 'error', text: 'Failed to create About Us section' });
//       } else {
//         setAboutId(data.id);
//         setMessage({ type: 'success', text: 'About Us section created successfully!' });
//       }
//     }

//     setSaving(false);
//     setTimeout(() => setMessage({ type: '', text: '' }), 5000);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="bg-white shadow-lg rounded-3xl p-6 md:p-8 mb-8 border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
//                 About Us Management
//               </h1>
//               <p className="text-gray-500 text-sm md:text-base">
//                 Manage your website's About Us section content
//               </p>
//             </div>
//             <div className="hidden md:block">
//               <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
//                 <Info className="w-8 h-8 text-white" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Message Alert */}
//         {message.text && (
//           <div
//             className={`mb-6 p-4 rounded-2xl border-2 flex items-start gap-3 animate-fadeIn ${
//               message.type === 'success'
//                 ? 'bg-green-50 border-green-200'
//                 : 'bg-red-50 border-red-200'
//             }`}
//           >
//             {message.type === 'success' ? (
//               <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//             ) : (
//               <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
//             )}
//             <p
//               className={`text-sm font-medium ${
//                 message.type === 'success' ? 'text-green-800' : 'text-red-800'
//               }`}
//             >
//               {message.text}
//             </p>
//           </div>
//         )}

//         {/* Main Content */}
//         {loading ? (
//           <div className="flex items-center justify-center h-64 bg-white rounded-3xl shadow-lg">
//             <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
//           </div>
//         ) : (
//           <div className="bg-white shadow-lg rounded-3xl border border-gray-100">
//             <form onSubmit={handleSubmit}>
//               <div className="p-6 md:p-8 space-y-6">
//                 {/* Title Input */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-3">
//                     Section Title *
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     placeholder="e.g., About Our Company"
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-lg"
//                   />
//                   <p className="mt-2 text-sm text-gray-500">
//                     This will be the main heading of your About Us section
//                   </p>
//                 </div>

//                 {/* Rich Text Editor */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-3">
//                     Description *
//                   </label>
//                   <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
//                     <MenuBar editor={editor} />
//                     <EditorContent editor={editor} className="bg-white" />
//                   </div>
//                   <p className="mt-2 text-sm text-gray-500">
//                     Use the toolbar above to format your text, add images, links, and create engaging content
//                   </p>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="border-t border-gray-100 p-6 md:p-8 bg-gray-50 rounded-b-3xl">
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                   <div className="text-sm text-gray-500">
//                     <p>Changes will be visible on the client side immediately after saving</p>
//                   </div>
//                   <button
//                     type="submit"
//                     disabled={saving}
//                     className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {saving ? (
//                       <>
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                         Saving...
//                       </>
//                     ) : (
//                       <>
//                         <Save className="w-5 h-5" />
//                         Save Changes
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Preview Section */}
//         {editor && editor.getHTML() !== '<p></p>' && (
//           <div className="mt-8 bg-white shadow-lg rounded-3xl p-6 md:p-8 border border-gray-100">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//               <Info className="w-6 h-6 text-indigo-600" />
//               Live Preview
//             </h2>
//             <div className="border-t-2 border-gray-100 pt-6">
//               <h3 className="text-3xl font-bold text-gray-900 mb-6">
//                 {title || 'Your Title Here'}
//               </h3>
//               <div
//                 className="prose prose-lg max-w-none 
//                   prose-headings:text-gray-900 
//                   prose-p:text-gray-700 
//                   prose-a:text-indigo-600 
//                   prose-strong:text-gray-900 
//                   prose-img:rounded-xl
//                   prose-blockquote:border-l-4 
//                   prose-blockquote:border-indigo-600 
//                   prose-blockquote:pl-4"
//                 dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
//               />
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Custom CSS */}
//       <style jsx global>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out;
//         }

//         .ProseMirror {
//           outline: none;
//         }

//         .ProseMirror p.is-editor-empty:first-child::before {
//           color: #9ca3af;
//           content: attr(data-placeholder);
//           float: left;
//           height: 0;
//           pointer-events: none;
//         }

//         .ProseMirror img {
//           max-width: 100%;
//           height: auto;
//           border-radius: 0.75rem;
//         }

//         .ProseMirror blockquote {
//           border-left: 4px solid #6366f1;
//           padding-left: 1rem;
//           font-style: italic;
//           color: #4b5563;
//         }

//         .ProseMirror code {
//           background-color: #f3f4f6;
//           padding: 0.2rem 0.4rem;
//           border-radius: 0.25rem;
//           font-size: 0.875em;
//         }

//         .ProseMirror pre {
//           background-color: #1f2937;
//           color: #f9fafb;
//           padding: 1rem;
//           border-radius: 0.5rem;
//           overflow-x: auto;
//         }

//         .ProseMirror pre code {
//           background-color: transparent;
//           color: inherit;
//           padding: 0;
//         }
//       `}</style>
//     </div>
//   );
// }
