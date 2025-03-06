import { Link } from "react-router-dom";

const FeatureSection = () => {
  return (
    <div className="bg-gradient-to-r from-gray-300 via-gray-200 to-white py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Left Section */}
          <div className="flex-1">
            <p className="text-lg text-gray-500 uppercase tracking-widest">Introducing New</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mt-2">
              Xiaomi Mi 11 Ultra <span className="text-blue-600">12GB + 256GB</span>
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              *Data provided by internal laboratories. Industry measurement.
            </p>
            <Link to="/products">
            <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center gap-2">
              Buy Now <i className="fa fa-arrow-right"></i>
            </button>
            </Link>
          </div>

          {/* Middle Section */}
          <div className="flex-1 relative rounded-lg">
            <img
              src="./assets/phone(g).png"
              alt="Phone"
              className="w-full max-w-sm mx-auto lg:mx-0 bg-transparent "
            />
            <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg px-4 py-2 rounded-lg flex items-center gap-2 text-gray-700">
              <i className="fa fa-inr text-blue-600"></i>
              <span className="font-semibold">54,000</span>
            </button>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
