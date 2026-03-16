import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [sessions, setSessions] = useState([]);
  const [profileData, setProfileData] = useState({ name: '', specialization: '', bio: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchDoctorAppointments();
    fetchCurrentProfile();
  }, []);

  const fetchDoctorAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://wellnessmarketplace-backend.onrender.com/api/doctor/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(res.data);
    } catch (err) {
      console.error("Failed to load appointments");
    }
  };

  const fetchCurrentProfile = async () => {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://wellnessmarketplace-backend.onrender.com/api/user/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setProfileData(prev => ({ ...prev, name: res.data.name }));
    } catch (err) {
        console.error("Failed to load profile");
    }
  };

  // This function caused the warning because it wasn't being used in the JSX.
  // Now we are using it below!
  const markComplete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://wellnessmarketplace-backend.onrender.com/api/doctor/appointment/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDoctorAppointments();
      setStatus({ type: 'success', message: 'Session marked as completed!' });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (err) {
      setStatus({ type: 'error', message: 'Could not update appointment.' });
    }
  };

  const handleUpdateProfile = async (e) => {
      e.preventDefault();
      try {
        const token = localStorage.getItem('token');
        await axios.put('https://wellnessmarketplace-backend.onrender.com/api/user/practitioner/update', profileData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setStatus({ type: 'success', message: 'Profile Updated Successfully!' });
        setTimeout(() => setStatus({ type: '', message: '' }), 3000);
      } catch (err) {
          setStatus({ type: 'error', message: 'Update failed. Ensure you are registered as a Practitioner.' });
      }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold text-[#0a0908]">Doctor's Portal</h1>
                <p className="text-[#5e503f]">Manage your practice.</p>
            </div>

            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-[#c6ac8f]">
                <button
                    onClick={() => setActiveTab('appointments')}
                    className={`px-4 py-2 rounded-md font-medium transition ${activeTab === 'appointments' ? 'bg-[#22333b] text-white shadow' : 'text-[#5e503f] hover:bg-gray-50'}`}
                >
                    Appointments
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-4 py-2 rounded-md font-medium transition ${activeTab === 'profile' ? 'bg-[#22333b] text-white shadow' : 'text-[#5e503f] hover:bg-gray-50'}`}
                >
                    Edit Profile
                </button>
            </div>
        </div>

        {status.message && (
            <div className={`mb-6 p-4 rounded-lg font-bold text-center fade-in ${
                status.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
                {status.message}
            </div>
        )}

        {/* --- RESTORED APPOINTMENTS LIST --- */}
        {activeTab === 'appointments' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#c6ac8f] overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-[#0a0908]">Upcoming Sessions</h2>
                </div>

                <div className="divide-y divide-gray-200">
                    {sessions.length > 0 ? (
                        sessions.map((session) => (
                            <div key={session.id} className="p-6 flex flex-col md:flex-row justify-between items-center hover:bg-white/50 transition">
                                <div className="mb-4 md:mb-0">
                                    <p className="text-xs font-bold text-[#5e503f] uppercase tracking-wider">Patient</p>
                                    <p className="text-lg font-bold text-[#22333b]">{session.patient?.name || "Unknown"}</p>
                                    <p className="text-sm text-[#5e503f]">{session.patient?.email}</p>
                                </div>
                                <div className="mb-4 md:mb-0 text-center md:text-left">
                                    <p className="text-xs font-bold text-[#5e503f] uppercase tracking-wider">Time</p>
                                    <p className="text-lg font-medium text-[#0a0908]">
                                        {new Date(session.date).toLocaleDateString()}
                                    </p>
                                    <p className="text-[#c6ac8f] font-bold">
                                        {new Date(session.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                </div>
                                <div>
                                    {session.status === 'COMPLETED' ? (
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">Completed</span>
                                    ) : (
                                        <button
                                            onClick={() => markComplete(session.id)} // <--- NOW IT IS USED!
                                            className="btn-primary text-sm"
                                        >
                                            Mark Complete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center text-gray-400">
                            No appointments scheduled yet.
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* PROFILE TAB (Kept as is) */}
        {activeTab === 'profile' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#c6ac8f] p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-[#0a0908] mb-6">Edit Public Profile</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-[#0a0908] mb-2">Display Name</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-[#c6ac8f] rounded-lg focus:ring-2 focus:ring-[#22333b] focus:outline-none"
                            value={profileData.name}
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#0a0908] mb-2">Specialization</label>
                        <select
                            className="w-full p-3 border border-[#c6ac8f] rounded-lg focus:ring-2 focus:ring-[#22333b] focus:outline-none bg-white"
                            value={profileData.specialization}
                            onChange={(e) => setProfileData({...profileData, specialization: e.target.value})}
                        >
                            <option value="">Select Specialization...</option>
                            <option value="YOGA">Yoga & Meditation</option>
                            <option value="PHYSIOTHERAPY">Physiotherapy</option>
                            <option value="REIKI">Reiki Healing</option>
                            <option value="AYURVEDA">Ayurveda</option>
                            <option value="CHIROPRACTIC">Chiropractic</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#0a0908] mb-2">Bio / About Me</label>
                        <textarea
                            rows="4"
                            className="w-full p-3 border border-[#c6ac8f] rounded-lg focus:ring-2 focus:ring-[#22333b] focus:outline-none"
                            placeholder="Tell patients about your experience..."
                            value={profileData.bio}
                            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        ></textarea>
                    </div>
                    <button type="submit" className="btn-primary w-full">Save Changes</button>
                </form>
            </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;