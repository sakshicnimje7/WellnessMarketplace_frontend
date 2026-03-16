import React, { useState } from 'react';
import axios from 'axios';

const AiAssistant = () => {
  const [symptom, setSymptom] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!symptom.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://wellnessmarketplace-backend.onrender.com/api/ai/analyze',
        { symptom: symptom },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data);
    } catch (err) {
      alert("AI Service Unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-surface p-8 rounded-2xl shadow-xl border border-ocean-soft">

        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">🤖 Wellness AI Assistant</h1>
            <p className="text-ocean-mid">Describe your symptoms, and our AI will recommend the best therapy for you.</p>
        </div>

        <form onSubmit={handleAnalyze} className="mb-8">
            <textarea
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-lg"
                rows="3"
                placeholder="E.g., I have been feeling very stressed lately..."
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
            ></textarea>

            <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-primary text-white font-bold py-3 rounded-xl hover:bg-ocean-dark transition shadow-lg disabled:opacity-50"
            >
                {loading ? "Analyzing..." : "Get Recommendations"}
            </button>
        </form>

        {result && (
            <div className="bg-ocean-light bg-opacity-20 border border-ocean-soft rounded-xl p-6 animation-fade-in">
                <h3 className="text-xl font-bold text-ocean-darkest mb-4">💡 AI Suggestion</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-xs font-bold text-gray-500 uppercase">Recommended Therapy</p>
                        <p className="text-lg font-bold text-primary">{result.therapy}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-xs font-bold text-gray-500 uppercase">Suggested Product</p>
                        <p className="text-lg font-bold text-secondary">{result.product}</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-ocean-teal">
                    <p className="text-sm text-text-muted italic">"{result.reason}"</p>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default AiAssistant;