import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="container mx-auto my-8 px-4">
      <div>
        <Link to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
          </svg>
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-8 text-center">About Us</h1>
      <div className="max-w-3xl mx-auto">
        <p className="mb-6 text-lg">
          Welcome to Kumari Textiles! We are dedicated to providing high-quality textiles and traditional wear, ensuring our customers experience elegance and comfort.
        </p>
        <p className="mb-6 text-lg">
          Our journey began in 1995 with a passion for weaving rich traditions into modern styles. Over the years, we have grown into a trusted name in the textile industry, serving customers across the country with premium fabrics and exquisite designs.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="mb-6 text-lg">
          At Kumari Textiles, our mission is to preserve and promote the beauty of traditional and contemporary textiles. We are committed to offering a curated selection of fabrics, sarees, and ethnic wear that celebrate craftsmanship and quality.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
        <ul className="list-disc list-inside mb-6 text-lg">
          <li>Wide range of premium fabrics and ethnic wear</li>
          <li>Authentic designs crafted by skilled artisans</li>
          <li>Competitive prices and exclusive collections</li>
          <li>Fast and reliable nationwide shipping</li>
          <li>Dedicated customer support for a seamless shopping experience</li>
        </ul>
        <p className="mb-6 text-lg">
          We take pride in our heritage and continuously strive to bring our customers the finest textiles. Your satisfaction is our top priority, and we always welcome your feedback and suggestions.
        </p>
        <p className="text-lg">
          Thank you for choosing Kumari Textiles. We look forward to being a part of your fashion and tradition!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
