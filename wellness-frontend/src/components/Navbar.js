import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const Navbar = ({ onNavigate }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // Store the Role

  useEffect(() => {
    checkLoginStatus();
  }, [isLoginOpen]);

  const checkLoginStatus = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // FETCH USER ROLE TO SEE IF THEY ARE A DOCTOR
      try {
        const res = await axios.get('https://wellnessmarketplace-backend.onrender.com/api/user/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setUserRole(res.data.role); // 'PRACTITIONER' or 'PATIENT'
      } catch (err) {
        console.error("Failed to fetch role");
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  };

  const handleProtectedNavigation = (page) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoginOpen(true);
    } else {
      onNavigate(page);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserRole(null);
    onNavigate('home');
  };

  return (
      <>
        <nav className="bg-gradient-to-r from-[#0a0908] to-[#22333b] shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">

              <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
                <span className="text-2xl font-extrabold text-white tracking-wide flex items-center gap-2">
                  🌿 Wellness<span className="text-[#c6ac8f]">Market</span>
                </span>
              </div>

              <div className="flex items-center space-x-6">
                <button
                  onClick={() => handleProtectedNavigation('ai')}
                  className="text-white bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-lg transition font-bold flex items-center gap-2 text-sm backdrop-blur-sm"
                >
                  ✨ AI Helper
                </button>

                {['Therapies', 'Store', 'Community', 'Dashboard'].map((item) => (
                    <button
                      key={item}
                      onClick={() => handleProtectedNavigation(item.toLowerCase())}
                      className="text-[#eae0d5] hover:text-white transition font-medium text-sm tracking-wide"
                    >
                      {item}
                    </button>
                ))}

                {/* --- THE FIX: ONLY SHOW IF PRACTITIONER --- */}
                {userRole === 'PRACTITIONER' && (
                    <button
                        onClick={() => handleProtectedNavigation('doctor-dashboard')}
                        className="text-white border border-[#c6ac8f] px-3 py-1.5 rounded-lg hover:bg-[#c6ac8f] hover:text-[#0a0908] transition text-sm font-medium"
                    >
                        Dr. Panel
                    </button>
                )}

                {isLoggedIn ? (
                    <button
                    onClick={handleLogout}
                    className="bg-[#c6ac8f] text-[#0a0908] px-5 py-2 rounded-lg font-bold hover:bg-[#eae0d5] transition shadow-sm text-sm"
                    >
                    Logout
                    </button>
                ) : (
                    <>
                    <button onClick={() => setIsLoginOpen(true)} className="text-white hover:text-[#c6ac8f] font-medium text-sm">Login</button>
                    <button onClick={() => setIsRegisterOpen(true)} className="bg-white text-[#22333b] px-5 py-2 rounded-lg font-bold hover:bg-[#eae0d5] transition shadow-md text-sm">Register</button>
                    </>
                )}
              </div>
            </div>
          </div>
        </nav>

        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} onSwitchToLogin={() => setIsLoginOpen(true)} />
      </>
  );
};

export default Navbar;