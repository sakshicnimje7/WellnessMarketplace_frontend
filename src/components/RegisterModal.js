import React, { useState } from 'react';
import axios from 'axios';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'PATIENT'
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Creating account...' });

    try {
      await axios.post('http://localhost:8080/api/auth/register', formData);
      setStatus({ type: 'success', message: 'Registration Successful! Please Login.' });
      setTimeout(() => {
        onClose();
        onSwitchToLogin();
      }, 1500);
    } catch (err) {
      // Replaces "Registration Failed" popup
      setStatus({ type: 'error', message: 'Registration Failed: Email might be taken.' });
    }
  };

  return (
    <div className="fixed inset-0 bg-violet-900 bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 border-t-4 border-secondary">
        <h2 className="text-2xl font-bold text-text-main mb-2">Create Account</h2>
        <p className="text-text-muted text-sm mb-6">Join our wellness community today.</p>

        {status.message && (
          <div className={`p-3 mb-4 text-sm rounded-md font-medium fade-in ${
            status.type === 'error' ? 'bg-red-100 text-red-700' :
            status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" required
            className="w-full p-3 border border-violet-200 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input type="email" placeholder="Email Address" required
            className="w-full p-3 border border-violet-200 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input type="password" placeholder="Password" required
            className="w-full p-3 border border-violet-200 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <select
            className="w-full p-3 border border-violet-200 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-white text-gray-700"
            onChange={(e) => setFormData({...formData, role: e.target.value === 'Doctor' ? 'PRACTITIONER' : 'PATIENT'})}
          >
            <option value="Patient">I am a Patient</option>
            <option value="Doctor">I am a Practitioner</option>
          </select>

          <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg shadow hover:bg-opacity-90 transition mt-2">
            Register
          </button>
        </form>

        <div className="text-center mt-4">
            <p className="text-sm text-gray-500">Already have an account? <button onClick={() => { onClose(); onSwitchToLogin(); }} className="text-primary font-bold hover:underline">Login</button></p>
            <button onClick={onClose} className="text-xs text-gray-400 mt-2 hover:text-gray-600">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;