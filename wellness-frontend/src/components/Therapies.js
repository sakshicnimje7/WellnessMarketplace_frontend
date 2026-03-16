import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookingModal from './BookingModal';

const Therapies = () => {
  const [practitioners, setPractitioners] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // --- PROFESSIONAL IMAGE LIST ---
  const proImages = [
    "https://images.unsplash.com/photo-1559839734-2b71ea86b48e?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1537368910025-600021b56369?auto=format&fit=crop&w=300&q=80",
  ];

  useEffect(() => {
    fetchPractitioners();
    fetchCurrentUserRole();
  }, []);

  const fetchPractitioners = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get('https://wellnessmarketplace-backend.onrender.com/api/user/practitioners', { headers });
      setPractitioners(res.data);
    } catch (err) {
      console.error("Failed to fetch doctors", err);
    }
  };

  const fetchCurrentUserRole = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get('https://wellnessmarketplace-backend.onrender.com/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserRole(res.data.role);
    } catch (err) {
      console.error("Failed to fetch user role");
    }
  };

  const handleBookClick = (doctor) => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Just open the modal or show login logic if you prefer
      alert("Please Login to book an appointment.");
      return;
    }
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-[#0a0908] sm:text-4xl">
          Meet Our Wellness Experts
        </h2>
        <p className="mt-4 text-xl text-[#5e503f]">
          Book a session with certified professionals dedicated to your health.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {practitioners.length > 0 ? (
          practitioners.map((doc, index) => (
            <div key={doc.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-[#c6ac8f] hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
              <div className="p-8">

                {/* --- BULLETPROOF IMAGE LOGIC --- */}
                <div className="flex justify-center mb-6">
                    <img
                        src={proImages[index % proImages.length]}
                        alt={doc.name}
                        className="h-32 w-32 rounded-full object-cover border-4 border-[#c6ac8f] shadow-md"
                        // THIS IS THE FIX:
                        onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop
                            // Fallback to a nice Initials Avatar (e.g. "DL" for Dr. Leaf) in your theme colors
                            e.target.src = `https://ui-avatars.com/api/?name=${doc.name}&background=c6ac8f&color=0a0908&size=150&font-size=0.5`;
                        }}
                    />
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold text-[#0a0908]">{doc.name}</h3>
                  <span className="inline-block bg-[#22333b] text-white px-3 py-1 rounded-md text-xs font-bold mt-2 uppercase tracking-wide">
                    {doc.specialization || "General Wellness"}
                  </span>
                  <p className="mt-4 text-[#5e503f] text-sm h-12 overflow-hidden px-2 italic">
                    "{doc.bio || "Dedicated to holistic healing and patient wellness."}"
                  </p>

                  <div className="mt-6 flex items-center justify-between px-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                      <span className="text-yellow-500 text-lg">★</span>
                      <span className="ml-1 text-[#0a0908] font-bold">{doc.rating || "5.0"}</span>
                    </div>

                    {userRole === 'PRACTITIONER' ? (
                        <span className="text-xs font-bold text-[#5e503f] border border-[#c6ac8f] px-3 py-2 rounded-lg bg-[#eae0d5]">
                            Colleague
                        </span>
                    ) : (
                        <button
                          onClick={() => handleBookClick(doc)}
                          className="btn-primary text-sm shadow-lg"
                        >
                          Book Now
                        </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-20 bg-white/50 rounded-xl border border-dashed border-[#c6ac8f]">
            <p className="text-xl text-[#5e503f]">No doctors registered yet.</p>
            <p className="text-sm text-[#5e503f] mt-2">Register a new user as "Practitioner" to see them appear here!</p>
          </div>
        )}
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={selectedDoctor}
      />
    </div>
  );
};

export default Therapies;