import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        if (!data.id) {
          console.error("Login response is missing user id");
          setError(
            "Login successful, but user data is incomplete. Please try again or contact support."
          );
          return;
        }
        await login({ id: data.id, email: data.email });
        navigate("/");
      } else {
        console.error("Login failed:", data);
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    }
  };
  return (
    <>
      <div className="ml-10 mt-10">
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
          alt="Login"
        /></div>
       
        <div className="w-full md:w-1/2 p-8 bg-white border border-gray-700 rounded-xl mr-10">
          <h2 className="text-5xl font-extrabold text-gray-800 mb-6 text-center">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-center text-lg mb-8">
            Log in to access your account and explore more.
          </p>
          {error && (
            <p className="text-red-500 text-center font-medium mb-4">{error}</p>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
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
            <div className="flex justify-between items-center">
              <Link
                to="/forgot-password"
                className="text-pink-600 font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <button
              className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-200 text-black rounded-lg font-semibold text-lg hover:opacity-90 transition duration-300 shadow-lg"
              type="submit"
            >
              Login
            </button>
            <p className="text-center text-gray-600 mt-4">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-pink-600 font-medium hover:underline"
              >
                Register here
              </Link>
            </p>
            <p className="text-center text-gray-500 text-sm mt-6">
              By continuing, you agree to Kumari Tex’s{" "}
              <span className="text-pink-600 font-medium">Terms</span> and{" "}
              <span className="text-pink-600 font-medium">Privacy Policy</span>.
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
