import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddToCartModal from './AddToCartModal';
import ReviewModal from './ReviewModal';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewProduct, setReviewProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://wellnessmarketplace-backend.onrender.com/api/products', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load products", err);
      setLoading(false);
    }
  };

  const handleConfirmOrder = async (product, quantity) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { alert("Please login first"); return; }
      await axios.post('https://wellnessmarketplace-backend.onrender.com/api/orders/place', {
        productId: product.id,
        quantity: parseInt(quantity)
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSelectedProduct(null);
    } catch (err) {
      alert("Order Failed");
    }
  };

  const handleSubmitReview = async (productId, rating, comment) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { alert("Please login first"); return; }
      await axios.post('https://wellnessmarketplace-backend.onrender.com/api/reviews', { productId, rating, comment },
      { headers: { Authorization: `Bearer ${token}` } });
      alert("Review Submitted!");
      setReviewProduct(null);
    } catch (err) { alert("Failed to submit review"); }
  };

  if (loading) return <div className="text-center mt-20 text-primary font-bold">Loading Wellness Products...</div>;

  return (
    // Uses the "Mist Blue" background from your palette
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-primary mb-8 border-b border-ocean-mid pb-4">
            Wellness Collection
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((item) => (
            // Cards are White to contrast with Blue Background
            <div key={item.id} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-ocean-soft overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

              <div className="h-48 bg-gray-100 overflow-hidden relative">
                 {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">🌿</div>
                  )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-text-main">{item.name}</h3>
                        {/* Tag using Teal color */}
                        <span className="text-xs font-semibold bg-ocean-light text-primary px-2 py-1 rounded-full">
                            {item.category}
                        </span>
                    </div>
                    <span className="text-xl font-bold text-primary">${item.price}</span>
                </div>

                <p className="text-ocean-mid text-sm h-10 line-clamp-2 mb-4">
                    {item.description}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedProduct(item)}
                    // Main button uses Primary Blue
                    className="flex-1 bg-primary text-white py-2.5 rounded-lg hover:bg-ocean-teal transition font-medium shadow-md"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => setReviewProduct(item)}
                    className="px-3 border border-ocean-mid rounded-lg text-ocean-mid hover:text-primary hover:border-primary transition"
                  >
                    ★
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedProduct && <AddToCartModal isOpen={!!selectedProduct} product={selectedProduct} onClose={() => setSelectedProduct(null)} onConfirm={handleConfirmOrder} />}
        {reviewProduct && <ReviewModal isOpen={!!reviewProduct} product={reviewProduct} onClose={() => setReviewProduct(null)} onConfirm={handleSubmitReview} />}
      </div>
    </div>
  );
};

export default Store;