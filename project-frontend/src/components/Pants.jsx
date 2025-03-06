import  { useState, useEffect } from 'react';
import { getProductsByCategory } from '../api/productApi';
import Card from './Card';


const Pants = () => {
  const [pants, setPants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPants = async () => {
      try {
        // Assuming category ID 3 is for pants
        const data = await getProductsByCategory(6);
        setPants(data.slice(0, 5));
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching pants:', err);
        setError('Failed to fetch pants. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchPants();
  }, []);

  if (isLoading) return <div className="text-center py-4">Loading pants...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">pants</h2>
        {pants.length === 0 ? (
          <p className="text-center text-gray-500">No pants found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {pants.map((accessory) => (
             
              <Card key={accessory.id} product={accessory} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pants;

