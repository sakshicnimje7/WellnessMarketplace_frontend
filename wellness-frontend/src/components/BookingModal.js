import React, { useState } from 'react';
import axios from 'axios';

const BookingModal = ({ isOpen, onClose, doctor }) => {
  const [date, setDate] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  if (!isOpen) return null;

  const handleBooking = async () => {
    if (!date) {
        setStatus({ type: 'error', message: 'Please select a date and time.' });
        return;
    }

    try {
      const token = localStorage.getItem('token');

      // FIX: Ensure the payload keys match your Java DTO exactly
      const payload = {
        practitionerId: doctor.id,
        date: date // HTML datetime-local sends "2025-12-30T10:00", which Spring Boot likes.
      };

      await axios.post('https://wellnessmarketplace-backend.onrender.com/api/bookings/book', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStatus({ type: 'success', message: 'Booking Confirmed!' });

      setTimeout(() => {
          setStatus({ type: '', message: '' });
          onClose();
      }, 2000);

    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Booking Failed. Try again.' });
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0a0908] bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96 border-t-4 border-[#22333b]">
        <h2 className="text-xl font-bold text-[#0a0908] mb-1">Book Session with {doctor?.name}</h2>
        <p className="text-sm text-[#5e503f] mb-6 uppercase tracking-wide">Specialist in {doctor?.specialization}</p>

        {status.message && (
            <div className={`p-3 mb-4 text-sm rounded-md font-bold text-center ${
                status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
                {status.message}
            </div>
        )}

        <label className="block text-sm font-bold text-[#0a0908] mb-2">Select Date & Time</label>
        <input
          type="datetime-local"
          className="w-full p-3 border border-[#c6ac8f] rounded-lg focus:ring-2 focus:ring-[#22333b] focus:outline-none mb-6"
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 text-[#5e503f] hover:bg-[#eae0d5] rounded-lg transition font-medium">
                Cancel
            </button>
            <button
                onClick={handleBooking}
                className="flex-1 bg-[#22333b] text-white font-bold py-3 rounded-lg hover:opacity-90 transition shadow-lg"
            >
                Confirm Booking
            </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;