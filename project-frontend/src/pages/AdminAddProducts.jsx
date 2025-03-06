// import  { useState } from 'react';
// import { addMultipleProducts } from '../api/productApi';

// const AdminAddProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [product, setProduct] = useState({
//     name: '',
//     price: '',
//     originalPrice: '',
//     discount: '',
//     description: '',
//     imageUrl: '',
//     category: {
//       id: '',
//       name: ''
//     }
//   });
//   const [message, setMessage] = useState('');

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'categoryId' || name === 'categoryName') {
//       setProduct(prev => ({
//         ...prev,
//         category: {
//           ...prev.category,
//           [name === 'categoryId' ? 'id' : 'name']: value
//         }
//       }));
//     } else {
//       setProduct(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleAddToList = (e) => {
//     e.preventDefault();
//     const newProduct = {
//       ...product,
//       price: parseFloat(product.price),
//       originalPrice: parseFloat(product.originalPrice),
//       discount: parseInt(product.discount),
//       category: {
//         ...product.category,
//         id: parseInt(product.category.id)
//       }
//     };
//     setProducts([...products, newProduct]);
//     setProduct({
//       name: '',
//       price: '',
//       originalPrice: '',
//       discount: '',
//       description: '',
//       imageUrl: '',
//       category: {
//         id: '',
//         name: ''
//       }
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await addMultipleProducts(products);
//       setMessage('Products added successfully!');
//       setProducts([]);
//     } catch (error) {
//       setMessage(`Failed to add products: ${error.message}`);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Add Multiple Products</h1>
//       <form onSubmit={handleAddToList} className="mb-4 space-y-2">
//         <input
//           type="text"
//           name="name"
//           value={product.name}
//           onChange={handleInputChange}
//           placeholder="Product Name"
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="number"
//           name="price"
//           value={product.price}
//           onChange={handleInputChange}
//           placeholder="Price"
//           className="w-full p-2 border rounded"
//           step="0.01"
//           required
//         />
//         <input
//           type="number"
//           name="originalPrice"
//           value={product.originalPrice}
//           onChange={handleInputChange}
//           placeholder="Original Price"
//           className="w-full p-2 border rounded"
//           step="0.01"
//           required
//         />
//         <input
//           type="number"
//           name="discount"
//           value={product.discount}
//           onChange={handleInputChange}
//           placeholder="Discount (%)"
//           className="w-full p-2 border rounded"
//           required
//         />
//         <textarea
//           name="description"
//           value={product.description}
//           onChange={handleInputChange}
//           placeholder="Description"
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="text"
//           name="imageUrl"
//           value={product.imageUrl}
//           onChange={handleInputChange}
//           placeholder="Image URL"
//           className="w-full p-2 border rounded"
//           required
//         />
//         <select
//           name="categoryId"
//           value={product.category.id}
//           onChange={handleInputChange}
//           className="w-full p-2 border rounded"
//           required
//         >
//           <option value="">Select Category ID</option>
//           <option value="1">1</option>
//           <option value="2">2</option>
//           <option value="3">3</option>
//           <option value="4">4</option>
//           <option value="5">5</option>
//           <option value="6">6</option>
//         </select>
//         <select
//           name="categoryName"
//           value={product.category.name}
//           onChange={handleInputChange}
//           className="w-full p-2 border rounded"
//           required
//         >
//           <option value="">Select Category Name</option>
//           <option value="laptops">Laptops</option>
//           <option value="mobile">Mobile</option>
//           <option value="tablet">Tablet</option>
//           <option value="electronics">Electronics</option>
//           <option value="gadgets">Gadgets</option>
//           <option value="smart tech">Smart Tech</option>
//         </select>
//         <button type="submit" className="w-full bg-yellow-400 text-black p-2 rounded">Add to List</button>
//       </form>
//       <div className="mb-4">
//         <h2 className="text-xl font-bold">Products to Add:</h2>
//         <ul className="space-y-2">
//           {products.map((prod, index) => (
//             <li key={index} className="border p-2 rounded">
//               <p><strong>Name:</strong> {prod.name}</p>
//               <p><strong>Price:</strong> ${prod.price}</p>
//               <p><strong>Original Price:</strong> ${prod.originalPrice}</p>
//               <p><strong>Discount:</strong> {prod.discount}%</p>
//               <p><strong>Description:</strong> {prod.description}</p>
//               <p><strong>Image URL:</strong> {prod.imageUrl}</p>
//               <p><strong>Category ID:</strong> {prod.category.id}</p>
//               <p><strong>Category Name:</strong> {prod.category.name}</p>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <button onClick={handleSubmit} className="w-full bg-yellow-400 text-black p-2 rounded">Submit All Products</button>
//       {message && <p className="mt-4 text-lg">{message}</p>}
//     </div>
//   );
// };

// export default AdminAddProducts;

