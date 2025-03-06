import { useState, useEffect } from 'react';
import { getProductsByCategory } from '../api/productApi';

import Card from './Card';

const LatestTees = () => {
  const [Tees, setTees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTees = async () => {
      try {
        const data = await getProductsByCategory(1);
        setTees(data.slice(0, 5)); // Fetch more for a better scroll effect
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch t-shirts. Please try again later.');
        setIsLoading(false);
        console.log(err);
      }
    };

    fetchTees();
  }, []);

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center mb-8">
          <span className="text-gray-700">Latest</span>{' '}
          <span className="text-blue-600">T-Shirts</span>
        </h2>

        {/* Loading State */}
        {isLoading && (
          <div className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:hidden">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="snap-center flex-shrink-0 w-44 animate-pulse bg-gray-300 h-64 rounded-xl"></div>
              ))}
          </div>
        )}

        {/* Error State */}
        {error && <div className="text-red-500 text-center">{error}</div>}

        {/* Mobile: Horizontal Scrollable List */}
        {!isLoading && (
          <div className="relative">
            <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-gray-100 to-transparent pointer-events-none md:hidden"></div>
            <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-gray-100 to-transparent pointer-events-none md:hidden"></div>

            <div className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:hidden">
              {Tees.map((tee) => (
                <div key={tee.id} className="snap-center flex-shrink-0 w-44 ">
                  <Card product={tee} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Tees.map((tee) => (
            <Card key={tee.id} product={tee} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestTees;
