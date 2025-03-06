import { useState, useEffect } from 'react';
import { getProductsByCategory } from '../api/productApi';

import Card from './Card';

const Sarees = () => {
  const [sarees, setSarees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSarees = async () => {
      try {
        // Assuming category ID 2 is for wireless headsets
        const data = await getProductsByCategory(2);
        setSarees(data.slice(0, 5));
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching sarees:', err);
        setError('Failed to fetch sarees. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchSarees();
  }, []);

  if (isLoading) return <div className="text-center py-4">Loading sarees...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          <span className="text-gray-600">Trending Sarees</span>{' '}
          <span className="text-primary">For U</span>
        </h2>
        {sarees.length === 0 ? (
          <p className="text-center text-gray-500">No sarees found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {sarees.map((saree) => (
              <Card key={saree.id} product={saree} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sarees;

