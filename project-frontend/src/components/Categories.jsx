import  { useState, useEffect } from 'react';

import { getCategories } from '../api/productApi';
import CategoryCard from './CategoryCard';




const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch categories. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);
  
console.log(categories)

  if (isLoading) return <div className="text-center py-4">Loading categories...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Shop with Categories</h2>
        {categories.length === 0 ? (
          <p className="text-center text-gray-500">No categories found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} id={category.id}  name={category.name} image={category.image} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;

