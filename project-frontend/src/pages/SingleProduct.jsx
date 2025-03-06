import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getSimilarProducts } from "../api/productApi";

import AddToCart from "../components/AddToCart";
import Header from "../components/Header";

const SingleProduct = () => {
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await getProductById(id);
        setProduct(fetchedProduct);
        setLoading(false);

        if (fetchedProduct) {
          const similar = await getSimilarProducts(
            fetchedProduct.category,
            fetchedProduct.customId
          );
          setSimilarProducts(similar);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to fetch product. Please try again.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCartSuccess = () => {
    navigate("/cart");
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!product)
    return <div className="text-center py-8">Product not found</div>;

  return (
    <>
      <Header />
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="relative">
            <img
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              className="w-full  h-auto max-h-[90vh] object-fill rounded-lg xl:mt-10"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.png";
              }}
            />
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-mono text-gray-900">{product.name}</h1>
            <p className="text-2xl font-semibold text-blue-600">
              ₹{product.price.toFixed(2)}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Size:</h2>
                <div className="flex space-x-2 mt-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg transition-all duration-300 ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold">Color:</h2>
                <div
                  className="w-8 h-8 rounded-full border border-gray-400"
                  style={{ backgroundColor: product.color }}
                ></div>
                <p>{product.color}</p>
              </div>

              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold">Quantity:</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 border rounded-lg"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 border rounded-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Material:</strong> {product.material}
              </p>
              <p>
                <strong>Pattern:</strong> {product.pattern}
              </p>
              <p>
                <strong>Brand:</strong> {product.brand}
              </p>
            </div>

            <AddToCart
              product={product}
              selectedSize={selectedSize}
              quantity={quantity}
              onAddToCartSuccess={handleAddToCartSuccess}
            />
            {similarProducts.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-thin mb-6 ">Similar Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6">
                  {similarProducts.slice(0, 2).map((similarProduct) => (
                    <div
                      key={similarProduct._id}
                      className="border rounded-lg p-4 "
                    >
                      <img
                        src={similarProduct.imageUrl || "/placeholder.svg"}
                        alt={similarProduct.name}
                        className="w-full h-32 object-contain mb-4 rounded-lg"
                      />
                      <h3 className="text-xs font-semibold">
                        {similarProduct.name}
                      </h3>

                      <button
                        onClick={() =>
                          navigate(`/product/${similarProduct.customId}`)
                        }
                        className="mt-3 bg-yellow-400 text-black px-5 py-2 rounded-lg hover:bg-white hover:border-yellow-400 transition-all duration-300 w-full"
                      >
                        view product
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProduct;
