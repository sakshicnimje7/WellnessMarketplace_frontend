import React, { useState } from 'react';
import axios from 'axios';

const ReviewModal = ({ isOpen, onClose, product }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://wellnessmarketplace-backend.onrender.com/api/reviews/add', {
        productId: product.id,
        rating: rating,
        comment: comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // NO POPUP, Just Green Text
      setStatus({ type: 'success', message: 'Review Submitted Successfully!' });

      setTimeout(() => {
          setStatus({ type: '', message: '' });
          onClose();
      }, 1500);

    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to submit review.' });
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0a0908] bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96 border-t-4 border-[#22333b]">
        <h3 className="text-xl font-bold text-[#0a0908] mb-2">Review {product?.name}</h3>
        <p className="text-[#5e503f] text-sm mb-4">Share your experience with this product.</p>

        {status.message && (
            <div className={`p-3 mb-4 text-sm rounded-md font-bold text-center ${
                status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
                {status.message}
            </div>
        )}

        <div className="mb-4">
            <label className="block text-sm font-bold text-[#0a0908] mb-1">Rating</label>
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-2xl transition ${star <= rating ? 'text-yellow-500 transform scale-110' : 'text-gray-300'}`}
                    >
                        ★
                    </button>
                ))}
            </div>
        </div>

        <div className="mb-6">
            <label className="block text-sm font-bold text-[#0a0908] mb-1">Comment</label>
            <textarea
                className="w-full p-3 border border-[#c6ac8f] rounded-lg focus:ring-2 focus:ring-[#22333b] focus:outline-none bg-gray-50"
                rows="3"
                placeholder="What did you like or dislike?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            ></textarea>
        </div>

        <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 text-[#5e503f] hover:bg-[#eae0d5] rounded-lg transition font-medium">
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                className="flex-1 bg-[#22333b] text-white font-bold py-3 rounded-lg hover:opacity-90 transition shadow-lg"
            >
                Submit
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;