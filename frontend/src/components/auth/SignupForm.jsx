import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { registerUser, handleApiError } from "../../utils/api";

const SignupForm = ({ onSignupSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const showToast = (message, type = "success") => {
    setMessage({ text: message, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (
      !signupData.name ||
      !signupData.email ||
      !signupData.password ||
      !signupData.confirmPassword
    ) {
      showToast("Please fill in all fields", "error");
      return;
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    if (signupData.password.length < 6) {
      showToast("Password must be at least 6 characters long", "error");
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerUser(signupData.name, signupData.email, signupData.password);

      showToast(res.data.message || "Account created successfully!", "success");
      setSignupData({ name: "", email: "", password: "", confirmPassword: "" });
      
      // Switch to login tab after successful signup
      if (onSignupSuccess) {
        setTimeout(() => {
          onSignupSuccess();
        }, 1500);
      }
    } catch (err) {
      console.error("Signup error:", err);
      const errorMessage = handleApiError(err, "Signup failed");
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

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={signupData.name}
            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
            className="w-full h-12 px-4 border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-xl"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Enter your email"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              className="pl-10 w-full h-12 border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-xl"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
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

        <div>
          <label className="text-sm font-medium text-gray-700">Confirm Password</label>
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={signupData.confirmPassword}
              onChange={(e) =>
                setSignupData({ ...signupData, confirmPassword: e.target.value })
              }
              className="pl-10 pr-12 w-full h-12 border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-xl"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold text-white rounded-xl flex items-center justify-center transition-colors"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    </>
  );
};

export default SignupForm;