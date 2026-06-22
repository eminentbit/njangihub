import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePaymentStatus } from "../../hooks/usePayment";
import { useTransactionStore } from "../../store/payment.store";
import getRoleName from "../../utils/roles";
import { useAuthStore } from "../../store/create.auth.store";

const PaymentProcessing = () => {
  const [status, setStatus] = useState<
    "pending" | "completed" | "failed" | "cancelled"
  >("pending");
  const [errorMessage, setErrorMessage] = useState("");
  const [cancelled, setCancelled] = useState(false);

  const { transactionId, reference, clearTransaction } = useTransactionStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data, isError } = usePaymentStatus(
    reference,
    transactionId,
    !cancelled && status === "pending"
  );

  // Track and update status when payment status is received
  useEffect(() => {
    const txStatus = data?.status?.toLowerCase();
    if (!txStatus || cancelled) return;

    if (["success", "successful", "completed"].includes(txStatus)) {
      setStatus("completed");
      clearTransaction();
    } else if (["failed", "error", "rejected"].includes(txStatus)) {
      setStatus("failed");
      setErrorMessage(data.message || "Transaction failed.");
      clearTransaction();
    }
  }, [data, cancelled, clearTransaction]);

  // Redirect on completion or cancel
  useEffect(() => {
    if (["completed", "cancelled"].includes(status)) {
      const timeout = setTimeout(() => {
        navigate(`/${getRoleName(user?.role)}/dashboard`);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [status, navigate, user?.role]);

  // Handle timeout for pending transactions (e.g., 2 mins)
  useEffect(() => {
    if (status === "pending") {
      const timeout = setTimeout(() => {
        setStatus("cancelled");
        clearTransaction();
      }, 2 * 60 * 1000); // 2 mins
      return () => clearTimeout(timeout);
    }
  }, [status, clearTransaction]);

  const handleCancel = () => {
    setCancelled(true);
    setStatus("cancelled");
    clearTransaction();
  };

  // UI Components
  const renderPending = () => (
    <>
      <p className="text-lg mb-4 text-gray-700 text-center">
        Please complete the transaction on your mobile device.
      </p>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Dial <strong>*126#</strong> if nothing pops up.
      </p>
      <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin mb-6" />
      <button
        onClick={handleCancel}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Cancel Transaction
      </button>
    </>
  );

  const renderCompleted = () => (
    <div className="flex flex-col items-center">
      <div className="text-green-500 text-8xl mb-4">✓</div>
      <p className="text-lg text-green-600 mb-2 text-center">
        Transaction completed successfully!
      </p>
      <p className="text-sm text-gray-600 text-center">
        Redirecting to dashboard...
      </p>
    </div>
  );

  const renderFailed = () => (
    <div className="flex flex-col items-center">
      <div className="text-red-500 text-8xl mb-4">✗</div>
      <p className="text-lg text-red-600 mb-2 text-center">
        Transaction failed.
      </p>
      <p className="text-sm text-gray-500 mb-4 text-center">{errorMessage}</p>
      <button
        onClick={() => navigate(`/${getRoleName(user?.role)}/dashboard`)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Return to Dashboard
      </button>
    </div>
  );

  const renderCancelled = () => (
    <div className="flex flex-col items-center">
      <div className="text-yellow-500 text-8xl mb-4">↺</div>
      <p className="text-lg text-yellow-600 mb-2 text-center">
        Transaction cancelled.
      </p>
      <p className="text-sm text-gray-600 mb-2 text-center">
        Please reject the request on your phone to avoid charges.
      </p>
      <p className="text-sm text-gray-500 text-center">
        Redirecting to dashboard...
      </p>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center text-center">
      <div className="text-red-400 text-6xl mb-4">⚠️</div>
      <p className="text-lg text-red-600 mb-2">Connection error.</p>
      <p className="text-sm text-gray-600 mb-4">
        Could not check payment status. Please try again later.
      </p>
      <button
        onClick={() => navigate(`/${getRoleName(user?.role)}/dashboard`)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go to Dashboard
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Processing Payment
      </h2>

      {isError && renderError()}
      {!isError && status === "pending" && renderPending()}
      {!isError && status === "completed" && renderCompleted()}
      {!isError && status === "failed" && renderFailed()}
      {!isError && status === "cancelled" && renderCancelled()}
    </div>
  );
};

export default PaymentProcessing;
