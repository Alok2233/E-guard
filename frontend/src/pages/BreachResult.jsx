import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowLeft,
  FaLock,
  FaTimes,
} from "react-icons/fa";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { getBreachAnalytics } from "../utils/api";

const BreachResult = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const [isLoading, setIsLoading] = useState(true);
  const [breaches, setBreaches] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!email) return;

    const fetchBreachAnalytics = async () => {
      setIsLoading(true);
      try {
        const data = await getBreachAnalytics(email);

        const breachList = data?.ExposedBreaches?.breaches_details || [];
        setBreaches(breachList);

        if (breachList.length > 0) {
          toast.error(
            `⚠️ Your email was found in ${breachList.length} breach${
              breachList.length > 1 ? "es" : ""
            }.`
          );
        } else {
          toast.success("✅ Good news! No breaches found for this email.");
        }
      } catch (error) {
        console.error("Error fetching breach analytics:", error);
        toast.error("⚠️ Failed to fetch breach details. Try again later.");
      }
      setIsLoading(false);
    };

    fetchBreachAnalytics();
  }, [email]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="pt-16 sm:pt-20 pb-8 sm:pb-16 px-3 sm:px-4 max-w-5xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-[oklch(45%_0.31_264.36)] hover:text-blue-700 mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" /> Back to Home
        </Link>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md text-center p-6 sm:p-8">
            <FaShieldAlt className="w-12 h-12 sm:w-16 sm:h-16 text-[oklch(45%_0.31_264.36)] mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">Scanning Email...</h2>
            <p className="text-gray-600 text-sm sm:text-base px-2">
              Checking {email} against our breach database
            </p>
          </div>
        )}

        {/* Safe Result */}
        {!isLoading && breaches.length === 0 && (
          <div className="bg-gradient-to-r from-green-100 to-green-50 border border-green-200 rounded-lg sm:rounded-xl shadow-lg text-center p-6 sm:p-8">
            <FaCheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-600 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-3 sm:mb-4">
              Good News!
            </h1>
            <div className="px-2">
              <p className="text-lg sm:text-xl text-green-700 mb-4 sm:mb-6">
                No breaches found for 
              </p>
              <p className="text-lg sm:text-xl text-green-700 font-bold break-all">
                {email}
              </p>
            </div>
          </div>
        )}

        {/* Breach Found */}
        {!isLoading && breaches.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-red-100 to-red-50 border border-red-200 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 text-center">
            <FaExclamationTriangle className="w-16 h-16 sm:w-20 sm:h-20 text-red-600 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-3xl font-bold text-red-800 mb-3 sm:mb-4">Oh no!</h1>
            <div className="px-2">
              <p className="text-lg sm:text-xl text-red-700 mb-2">
                Your email was found in{" "}
                <strong>{breaches.length}</strong> breach
                {breaches.length > 1 ? "es" : ""}.
              </p>
              <p className="text-lg sm:text-xl text-red-700 font-bold break-all mb-4">
                {email}
              </p>
              <p className="text-red-600 mb-6 text-sm sm:text-base">
                Your personal information may have been exposed. We recommend
                taking immediate action.
              </p>
            </div>
            <div className="space-y-3">
              <button
                className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md text-sm sm:text-base font-medium"
                onClick={() => setShowPopup(true)}
              >
                Secure Your Account
              </button>
            </div>
            <button
              className="mt-4 sm:mt-6 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition text-sm sm:text-base font-medium"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide Details" : "View Details"}
            </button>
          </div>
        )}
{/* Timeline Details - Mobile Optimized */}
{showDetails && breaches.length > 0 && (
  <div className="mt-6 sm:mt-14">
    {/* Mobile: Vertical stacked cards */}
    <div className="block md:hidden space-y-6">
      {breaches.map((b, index) => (
        <motion.div
          key={b.breach}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-start mb-4">
              <img
                src={b.logo}
                alt={b.breach}
                className="w-12 h-12 rounded-full border mr-3 shadow flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 break-words">
                  {b.breach}{" "}
                  <FaLock className="text-red-500 text-sm flex-shrink-0" />
                </h3>
                <span className="text-sm text-gray-500">{b.xposed_date}</span>
              </div>
            </div>
            <p className="text-gray-700 mb-3 leading-relaxed text-sm">
              {b.details}
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span><strong>Records:</strong></span>
                <span>{b.xposed_records.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span><strong>Domain:</strong></span>
                <span className="break-all">{b.domain}</span>
              </div>
              <div className="flex justify-between">
                <span><strong>Industry:</strong></span>
                <span>{b.industry}</span>
              </div>
              <div className="pt-2">
                <a
                  href={b.references}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm break-all"
                >
                  Reference ↗
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Desktop Timeline (zig-zag) */}
    <div className="hidden md:block relative">
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-700 via-blue-200 to-transparent transform -translate-x-1/2" />
      {breaches.map((b, index) => {
        const isLeft = index % 2 === 0;
        return (
          <motion.div
            key={b.breach}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className={`relative mb-12 w-full flex ${
              isLeft ? "justify-start" : "justify-end"
            }`}
          >
            <span className="absolute left-1/2 transform -translate-x-1/2 top-6 w-6 h-6 bg-blue-800 rounded-full border-4 border-white shadow-lg" />
            <div
              className={`w-[46%] p-6 rounded-xl shadow-xl bg-white border border-gray-100 hover:shadow-2xl transition transform hover:-translate-y-1 ${
                isLeft ? "mr-auto" : "ml-auto"
              }`}
            >
              <div className="flex items-center mb-4">
                <img
                  src={b.logo}
                  alt={b.breach}
                  className="w-14 h-14 rounded-full border mr-4 shadow"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    {b.breach} <FaLock className="text-red-500 text-sm" />
                  </h3>
                  <span className="text-sm text-gray-500">
                    {b.xposed_date}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed">
                {b.details}
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <p>
                  <strong>Records:</strong>{" "}
                  {b.xposed_records.toLocaleString()}
                </p>
                <p>
                  <strong>Domain:</strong> {b.domain}
                </p>
                <p>
                  <strong>Industry:</strong> {b.industry}
                </p>
                <p>
                  <a
                    href={b.references}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Reference ↗
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
)}

      </div>

      {/* Secure Account Popup - Mobile Optimized */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-[#000000de] z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg backdrop-blur-md bg-blue-700 border border-cyan-300 text-white max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-3 text-white hover:text-gray-200 p-2 -m-2"
              >
                <FaTimes size={20} />
              </button>

              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center pr-8">
                🔒 Secure Your Account
              </h2>
              <ul className="space-y-3 text-left list-disc pl-6 text-sm sm:text-base">
                <li>Change your password immediately.</li>
                <li>Enable two-factor authentication (2FA).</li>
                <li>Use a strong & unique password manager.</li>
                <li>Monitor suspicious logins and activity.</li>
                <li>Be cautious of phishing emails & links.</li>
              </ul>

              <div className="mt-6 flex justify-center">
                <button
                  className="w-full sm:w-auto px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg shadow-lg font-medium"
                  onClick={() => setShowPopup(false)}
                >
                  Got it 👍
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default BreachResult;