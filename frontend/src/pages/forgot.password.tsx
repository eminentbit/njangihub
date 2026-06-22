// ForgotPassword.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import { securePost } from "../utils/axiosClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300"
    >
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Forgot Password
        </h2>
        <p className="text-sm text-blue-600 mb-4 text-center">
          Enter your email and we'll send you instructions to reset your
          password.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await securePost("/auth/forgot-password", { email });
              console.log("Reset link sent to:", email);
            } catch (error) {
              console.error("Error sending reset link:", error);
            }
          }}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Your email address"
            className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </motion.div>
  );
}
