import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registration successful:", data);
        navigate("/login");
      } else {
        console.error("Registration failed:", data);
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className=" flex mt-10 ml-10 ">
        <Link to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
            />
          </svg>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white">
        <div className="hidden md:block md:w-1/2">
          <img
            className="w-full h-auto object-cover"
            src="./assets/newlogo.jpg"
            alt="Register"
          />
        </div>
        <div className="w-full h-auto md:w-1/2 p-8 bg-white border border-gray-800 rounded-xl mr-10">
          <h2 className="text-5xl font-extrabold text-gray-800 mb-6 text-center">
            Create Account
          </h2>
          <p className="text-gray-600 text-center text-lg mb-8">
            Sign up to get started with your journey.
          </p>
          {error && (
            <p className="text-red-500 text-center font-medium mb-4">{error}</p>
          )}
          <form className=" space-y-2" onSubmit={handleSubmit}>
            <div>
              <label
                className="block text-gray-700 font-semibold mb-2 text-lg"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-pink-300 shadow-sm"
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-semibold mb-2 text-lg"
                htmlFor="email"
              >
                E-mail
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-pink-300 shadow-sm"
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-semibold mb-2 text-lg"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-pink-300 shadow-sm"
                type="password"
                id="password"
                placeholder="Enter your password"
                maxLength="8"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-semibold mb-2 text-lg"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-pink-300 shadow-sm"
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                maxLength="8"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-200 text-black rounded-lg font-semibold text-lg hover:opacity-90 transition duration-300 shadow-lg"
              type="submit"
            >
              Register
            </button>
            <p className="text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-pink-600 font-medium hover:underline"
              >
                Login here
              </Link>
            </p>
            <p className="text-center text-gray-500 text-sm mt-6">
              By continuing, you agree to Humeira’s{" "}
              <span className="text-pink-600 font-medium">Terms</span> and{" "}
              <span className="text-pink-600 font-medium">Privacy Policy</span>.
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
