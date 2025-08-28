import React, { useState } from "react";
import { Shield, Key, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import AnimatedBackground from "../components/AnimatedBackground";

const PasswordCheck = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();

  const handlePasswordCheck = () => {
    if (!password.trim()) return;
    setIsChecking(true);
    // Simulate delay & navigate
    setTimeout(() => {
      navigate("/password-result", { state: { password } });
    }, 1200);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && password.trim() && !isChecking) {
      handlePasswordCheck();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      <AnimatedBackground />
      
      {/* Hero Section - Fixed padding and responsive design */}
      <section className="flex-1 text-white py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 text-center relative">
        {/* Icon - Responsive sizing */}
        <Key className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-4 text-[oklch(45%_0.31_264.36)]" />
        
        {/* Title - Responsive text sizing */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 px-2">
          Password Security Check
        </h1>
        
        {/* Description - Responsive text and spacing */}
        <p className="text-base sm:text-lg md:text-xl max-w-xs sm:max-w-md md:max-w-2xl mx-auto mb-6 sm:mb-8 px-2 leading-relaxed">
          Check if your password has been exposed in data breaches and get instant strength analysis with recommendations.
        </p>

        {/* Input Section - Improved mobile layout */}
        <div className="max-w-xs sm:max-w-sm md:max-w-lg mx-auto mb-6 sm:mb-8">
          {/* Mobile-first: Stack vertically on very small screens */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border">
            {/* Input container */}
            <div className="flex items-center flex-1 min-w-0">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 ml-3 sm:ml-4 flex-shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password to check"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-2 sm:px-4 py-3 sm:py-3 outline-none text-gray-700 text-sm sm:text-base min-w-0"
              />
              <button
                type="button"
                className="px-2 sm:px-4 py-3 text-gray-400 hover:text-gray-600 flex-shrink-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
            
            {/* Button - Full width on mobile, auto on larger screens */}
            <button
              onClick={handlePasswordCheck}
              disabled={isChecking || !password.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 sm:px-6 py-3 font-medium transition-all duration-300 text-sm sm:text-base w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-gray-200"
            >
              {isChecking ? "Checking..." : "Check Now"}
            </button>
          </div>
        </div>

        {/* Privacy Notice Card - Improved mobile spacing and text */}
        <div className="max-w-xs sm:max-w-sm md:max-w-xl mx-auto px-2">
          <div className="p-4 sm:p-6 flex items-start space-x-3 rounded-xl sm:rounded-2xl border border-cyan-400 bg-white/10 backdrop-blur-lg shadow-lg">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 mt-1 flex-shrink-0" />
            <div className="text-left">
              <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">
                Your Privacy is Protected
              </h3>
              <p className="text-blue-200 text-xs sm:text-sm leading-relaxed">
                Passwords are never stored or transmitted. We use secure hashing to check against breach databases without exposing your actual password.
              </p>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default PasswordCheck;