import React, { useState } from 'react';
import axios from 'axios';

const LoginModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  // New State for Password Visibility
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Verifying credentials...' });

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);

      setStatus({ type: 'success', message: 'Login Successful! Redirecting...' });

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (err) {
      setStatus({ type: 'error', message: 'Invalid email or password.' });
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0a0908] bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 border-t-4 border-[#22333b]">
        <h2 className="text-2xl font-bold text-[#0a0908] mb-6">Welcome Back</h2>

        {status.message && (
          <div className={`p-3 mb-4 text-sm rounded-md font-medium fade-in ${
            status.type === 'error' ? 'bg-red-100 text-red-700' :
            status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-3 border border-[#c6ac8f] rounded-lg focus:ring-2 focus:ring-[#22333b] focus:outline-none"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              className="w-full p-3 border border-[#c6ac8f] rounded-lg focus:ring-2 focus:ring-[#22333b] focus:outline-none pr-10"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            {/* The Eye Icon Button */}
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#22333b]"
            >
                {showPassword ? (
                    // Eye Open Icon (SVG)
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                ) : (
                    // Eye Closed Icon (SVG)
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                )}
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition">Cancel</button>
            <button type="submit" className="flex-1 bg-[#22333b] text-white font-bold py-2 rounded-lg shadow hover:opacity-90 transition">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;