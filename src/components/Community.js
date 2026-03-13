import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Community = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  // New Status State to replace Popups
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/forum/questions', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const postQuestion = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        setStatus({ type: 'error', message: 'You must be logged in to post.' });
        return;
    }

    try {
      await axios.post('http://localhost:8080/api/forum/ask', { content: newQuestion }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewQuestion('');
      setStatus({ type: 'success', message: 'Question posted successfully!' });
      fetchQuestions();

      // Clear message after 3 seconds
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to post. Please try again.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-extrabold text-[#0a0908] text-center mb-8">Wellness Community</h2>

      {/* --- INLINE STATUS MESSAGE (No More Popups) --- */}
      {status.message && (
        <div className={`mb-6 p-4 rounded-lg font-bold text-center fade-in ${
            status.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
            {status.message}
        </div>
      )}

      {/* Input Box */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg p-6 mb-10 border border-[#c6ac8f]">
        <textarea
          className="w-full p-4 border border-[#c6ac8f]/50 rounded-lg focus:ring-2 focus:ring-[#22333b] focus:outline-none bg-white/80"
          rows="3"
          placeholder="Share your wellness journey or ask a question..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        ></textarea>
        <div className="mt-4 text-right">
          <button onClick={postQuestion} className="btn-primary">Post Question</button>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {questions.length === 0 ? (
          <p className="text-center text-[#5e503f]">No discussions yet. Be the first!</p>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow p-6 border-l-4 border-[#22333b] hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-[#22333b]">{q.user ? q.user.name : "Anonymous"}</span>
                <span className="text-xs text-[#5e503f]">
                    {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : "Just now"}
                </span>
              </div>
              <p className="text-[#0a0908] text-lg">{q.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Community;