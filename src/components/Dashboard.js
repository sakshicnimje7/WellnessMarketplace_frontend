import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      // If no token, redirect or show error (handled by catch)
      const res = await axios.get('http://localhost:8080/api/dashboard/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
      setLoading(false);
    } catch (err) {
      setError('Could not load dashboard. Please try logging in again.');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading your wellness profile...</div>;
  if (error) return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 min-h-screen">
      <h1 className="text-3xl font-bold text-[#0a0908] mb-8">My Dashboard</h1>

      {/* 1. Profile Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#c6ac8f] p-8 mb-8 flex items-center justify-between">
        <div>
            <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-[#22333b] text-white flex items-center justify-center text-2xl font-bold">
                    {data.name.charAt(0)}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-[#0a0908]">{data.name}</h2>
                    <p className="text-[#5e503f]">{data.email}</p>
                    <span className="inline-block bg-[#eae0d5] text-[#22333b] text-xs font-bold px-2 py-1 rounded mt-1">
                        {data.role}
                    </span>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* 2. Appointments Section (Works for Patients AND Doctors) */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow border border-[#c6ac8f] overflow-hidden">
            <div className="p-6 border-b border-[#eae0d5] bg-[#faf7f5]">
                <h3 className="text-xl font-bold text-[#0a0908] flex items-center gap-2">
                    📅 {data.isDoctor ? 'My Upcoming Sessions' : 'My Appointments'}
                </h3>
            </div>
            <div className="p-6">
                {!data.bookings || data.bookings.length === 0 ? (
                    <p className="text-[#5e503f] italic">No upcoming sessions scheduled.</p>
                ) : (
                    <div className="space-y-4">
                        {data.bookings.map((booking) => (
                            <div key={booking.id} className="p-4 bg-white border-l-4 border-[#22333b] rounded shadow-sm">
                                <p className="font-bold text-[#0a0908]">
                                    {/* Handle both Patient and Doctor view */}
                                    {data.isDoctor
                                        ? `Patient: ${booking.patient?.name || 'Unknown'}`
                                        : `Dr. ${booking.practitioner?.name || 'Unknown'}`
                                    }
                                </p>
                                <p className="text-sm text-[#5e503f]">
                                    {new Date(booking.date).toLocaleDateString()} at {new Date(booking.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {booking.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* 3. Orders Section (Hidden for Doctors usually, visible for Patients) */}
        {!data.isDoctor && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow border border-[#c6ac8f] overflow-hidden">
                <div className="p-6 border-b border-[#eae0d5] bg-[#faf7f5]">
                    <h3 className="text-xl font-bold text-[#0a0908] flex items-center gap-2">
                        📦 My Orders
                    </h3>
                </div>
                <div className="p-6">
                    {!data.orders || data.orders.length === 0 ? (
                        <p className="text-[#5e503f] italic">No past orders.</p>
                    ) : (
                        <div className="space-y-4">
                            {data.orders.map((order) => (
                                <div key={order.id} className="flex justify-between items-center p-4 bg-white border border-[#eae0d5] rounded shadow-sm">
                                    <div>
                                        <p className="font-bold text-[#0a0908]">{order.product?.name}</p>
                                        <p className="text-sm text-[#5e503f]">Qty: {order.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[#22333b]">${order.totalAmount}</p>
                                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold">
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;