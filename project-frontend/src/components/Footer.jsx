// import { Link } from "react-router-dom";

// const Footer = () => {
//   return (
//     <div>
//       <footer className="bg-white dark:bg-gray-900 flex bottom-0">
//         <div className="container flex flex-col items-center justify-between px-6 py-8 mx-auto lg:flex-row">
//           <a href="#">
//             <img
//               className="w-auto h-10"
//               src="/assets/humeira logo.png"
//               alt=""
//             />
//           </a>

//           <div className="flex flex-wrap items-center justify-center gap-4 mt-6 lg:gap-6 lg:mt-0">
//             <Link to="/">Home</Link>

//             <Link to="/products">Products</Link>

//             <Link to="/Aboutus">About Us</Link>
//           </div>

//           <p className="mt-6 text-sm text-gray-500 lg:mt-0 dark:text-gray-400">
//             © Copyright 2025 Humeira Moniles.{" "}
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Footer;


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 lg:py-40 px-6 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
        {/* Left Section */}
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl font-bold">Shop Latest Collection On Popular Brands<br /> Order Now.</h2>
        </div>

        {/* Right Section */}
        <div className="space-y-2">
          <p className="flex items-center space-x-2">
            <span className="text-lg">📍</span>
            <span>chettikulam , Nagercoil</span>
          </p>
          <p className="flex items-center space-x-2">
            <span className="text-lg">📧</span>
            <a href="mailto:kumaritex@gmail.com" className="hover:underline">kumaritex@gmail.com</a>
          </p>
        </div>
      </div>

      <hr className="my-6 border-gray-700" />

      {/* Bottom Links */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        <div className="space-x-6 mb-4 md:mb-0">
          <a href="#" className="hover:text-white">About</a>
          <a href="#" className="hover:text-white">Products</a>
          <a href="#" className="hover:text-white">Carrers</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
        <p>&copy; Copyright 2025, All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
