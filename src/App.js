import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Therapies from './components/Therapies';
import Store from './components/Store';
import Community from './components/Community';
import Dashboard from './components/Dashboard';
import DoctorDashboard from './components/DoctorDashboard';
import AiAssistant from './components/AiAssistant';
import Footer from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    // 1. "flex-col" allows us to stack Navbar, Content, and Footer vertically
    <div className="min-h-screen flex flex-col">
      <Navbar onNavigate={setCurrentPage} />

      {/* 2. "flex-grow" pushes the footer down if the content is short */}
      <div className="flex-grow">
        {currentPage === 'home' && (
          <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-extrabold text-primary sm:text-6xl mb-6">
              Heal your mind, <span className="text-ocean-teal">body, and soul.</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-ocean-darkest">
              Your journey to holistic wellness starts here. Book expert therapies, join our community, and shop curated products.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <button
                onClick={() => setCurrentPage('ai')}
                className="px-8 py-3 rounded-full text-white bg-secondary hover:bg-opacity-90 transition font-bold shadow-lg flex items-center gap-2"
              >
                🤖 Ask AI Assistant
              </button>
              <button
                onClick={() => setCurrentPage('store')}
                className="px-8 py-3 rounded-full text-primary bg-white border-2 border-primary hover:bg-ocean-light transition font-bold shadow-sm"
              >
                View Store
              </button>
            </div>
          </div>
        )}

        {currentPage === 'therapies' && <Therapies />}
        {currentPage === 'store' && <Store />}
        {currentPage === 'community' && <Community />}
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'doctor-dashboard' && <DoctorDashboard />}
        {currentPage === 'ai' && <AiAssistant />}
      </div>

      {/* 3. The Footer is now correctly placed at the bottom */}
      <Footer />
    </div>
  );
}

export default App;