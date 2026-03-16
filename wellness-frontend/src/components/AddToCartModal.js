import React, { useState } from 'react';
import axios from 'axios';

const AddToCartModal = ({ isOpen, onClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState({ type: '', message: '' });

  if (!isOpen) return null;

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');

      // FIX: Ensure correct payload keys for OrderController
      const payload = {
        productId: product.id,
        quantity: quantity
      };

      await axios.post('https://wellnessmarketplace-backend.onrender.com/api/orders/create', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStatus({ type: 'success', message: 'Added to Cart!' });

      setTimeout(() => {
          setStatus({ type: '', message: '' });
          onClose();
      }, 1500);

    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Failed to add item.' });
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0a0908] bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96 border-t-4 border-[#22333b]">
        <h3 className="text-xl font-bold text-[#0a0908] mb-4">Add to Cart</h3>
        <p className="text-[#5e503f] mb-6">
            How many <span className="font-bold text-[#0a0908]">{product?.name}</span> would you like?
        </p>

        {status.message && (
            <div className={`p-3 mb-4 text-sm rounded-md font-bold text-center ${
                status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
                {status.message}
            </div>
        )}

        <div className="flex items-center justify-center gap-4 mb-8">
            <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg bg-[#eae0d5] text-[#22333b] font-bold hover:bg-[#c6ac8f]"
            >
                -
            </button>
            <span className="text-2xl font-bold text-[#0a0908] w-8 text-center">{quantity}</span>
            <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg bg-[#eae0d5] text-[#22333b] font-bold hover:bg-[#c6ac8f]"
            >
                +
            </button>
        </div>

        <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 text-[#5e503f] hover:bg-[#eae0d5] rounded-lg transition font-medium">
                Cancel
            </button>
            <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#22333b] text-white font-bold py-3 rounded-lg hover:opacity-90 transition shadow-lg"
            >
                Confirm
            </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;