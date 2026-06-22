// VerifyEmail.tsx
import { motion } from "framer-motion";

export default function VerifyEmail() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300"
    >
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">
          Check Your Email
        </h1>
        <p className="text-blue-600 mb-6">
          We've sent a verification link to your email address. Please check
          your inbox and click on the link to verify your account.
        </p>
        <button
          type="button"
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Resend Email
        </button>
      </div>
    </motion.div>
  );
}
