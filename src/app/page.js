'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postId, setPostId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getPosts = async () => {
    const { data, error } = await supabase.from('posts').select('*');
    console.log({data, error})
    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data);
    }
  };

  const handleSavePost = async () => {
    if (!title || !content) return;

    try {
      setLoading(true);
      if (isEditing) {
        const { error } = await supabase
          .from('posts')
          .update({ title, content })
          .eq('id', postId);
        if (error) throw new Error('Error updating post');
        getPosts();
      } else {
        const { error } = await supabase.from('posts').insert([{ title, content }]);
        if (error) throw new Error('Error adding post');
        getPosts();
      }
      setTitle('');
      setContent('');
      setPostId(null);
      setIsEditing(false);
      setShowModal(false);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setTitle('');
    setContent('');
    setPostId(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setPostId(post.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const deletePost = async (id) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) {
      console.error('Error deleting post:', error);
    } else {
      getPosts();
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 bg-gradient-to-br from-gray-800 via-purple-600 to-gray-800 text-white font-sans relative overflow-hidden">
      {/* Background Shining Animation */}
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute top-0 left-0 h-64 w-64 bg-gradient-to-r from-pink-500 to-red-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 h-64 w-64 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl animate-pulse delay-200"></div>
      </div>

      <h1 className="text-5xl mb-8 relative z-10 text-center animate-fade-in-up">
        Supabase Posts Manager
      </h1>

      {/* Button to Open Add Modal */}
      <button
        onClick={openAddModal}
        className="relative z-10 bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 rounded hover:scale-110 transition-all transform duration-300 shadow-lg text-lg"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Add Post'}
      </button>

      {/* Display Posts */}
      <div className="relative z-10 mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105 group"
            >
              <div>
                <h3 className="text-xl font-bold">{post.title}</h3>
                <p className="text-sm mt-2">{post.content}</p>
              </div>
              <div className="flex space-x-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => openEditModal(post)}
                  className="bg-yellow-500 px-4 py-2 square-button hover:bg-yellow-700 transition-all transform"
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  className="bg-red-500 px-4 py-2 square-button hover:bg-red-700 transition-all transform"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </div>

      {/* Modal for Add/Edit Post */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-20 animate-fade-in">
          <div className="bg-white text-black p-8 rounded-xl shadow-lg w-1/3 transform scale-95 transition-all duration-300">
            <h2 className="text-3xl mb-4">{isEditing ? 'Edit Post' : 'Add New Post'}</h2>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block mb-4 p-4 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="block mb-4 p-4 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex space-x-4">
              <button
                onClick={handleSavePost}
                className="bg-green-500 px-6 py-3 square-button hover:bg-green-700 transition-all transform"
                disabled={loading}
              >
                {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Add Post'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 px-6 py-3 square-button hover:bg-gray-700 transition-all transform"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
