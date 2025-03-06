import  { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductsByCategory } from '../api/productApi';

import Card from '../components/Card';

const CategoryPage = () => {
  const { category_id } = useParams();
  console.log(category_id);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProductsByCategory(category_id);
        
        console.log(fetchedProducts);
        setProducts(fetchedProducts);
        // Assuming the first product has the category name
        if (fetchedProducts.length > 0) {
          setCategoryName(fetchedProducts[0].category.name);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
        console.log(err)
      }
    };

    fetchProducts();
  }, [category_id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
</svg>
</Link>
      <h1 className="text-3xl font-bold mb-6 text-center capitalize">{categoryName}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="text-center text-gray-500">No products found in this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;

