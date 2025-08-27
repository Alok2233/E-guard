import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loginUser, handleApiError } from "../../utils/api";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setMessage({ text: message, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginData;

    if (!email || !password) {
      showToast("Please fill in all fields", "error");
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginUser(email, password);

      showToast("Login successful!", "success");

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = handleApiError(err, "Login failed");
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toast Message */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg text-sm ${
          message.type === "success" 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Enter your email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              className="pl-10 w-full h-12 border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-xl"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              className="pl-10 pr-12 w-full h-12 border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-xl"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold text-white rounded-xl flex items-center justify-center transition-colors"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </>
  );
};

export default LoginForm;