/* eslint-disable react/prop-types */

import { Link } from 'react-router-dom';



const Card = ({product}) => {

  const truncateTitle = (title, length = 40) => {
    return title.length > length ? title.substring(0, length) + "..." : title;
  };
 
  return (
    <>
   

    
  
     <Link to={`/product/${product.customId}`} className="flex1 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-duration-300">
      <div className="imgflex p-4">
        <img className="img w-full h-48 object-contain" src={product.imageUrl} alt={product.name} />
      </div>
      <div className="contentflex p-4">
      <div className="font-semibold ">{truncateTitle(product.name)}</div>
        <p className="mb-2">
          <span className="text-primary font-bold">₹{product.price}</span>{' '}
          <del className="text-red-500">₹{product.originalPrice}</del>
        </p>
        <hr className="my-2" />
        <p className="text-green-600 font-semibold">{product.discount}</p>
      </div>
    </Link> 
    </>
  );
};

export default Card;

