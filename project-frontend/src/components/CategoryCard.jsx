/* eslint-disable react/prop-types */

import { Link } from 'react-router-dom';

const CategoryCard = ({ id, image , name}) => {
  return (
    <Link to={`/category/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="p-4">
          <img className="w-full h-32 object-contain" src={image} alt={name} />
        </div>
        <div className="p-4 bg-gray-100">
          <p className="text-center font-semibold text-gray-800">{name}</p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;

