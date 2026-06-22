import React from "react";
import { Group } from "../../hooks/useAdmin";

type PaymentMethod = "mobile_money" | "bank_transfer" | "card";

interface PaymentModalProps {
  selectedGroup: Group;
  formatCurrency: (amount: number) => string;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  setShowPaymentModal: (show: boolean) => void;
  handlePaymentSubmit: (group: Group) => Promise<void> | void;
  isProcessingPayment: boolean;
  setIsProcessingPayment: (processing: boolean) => void;
}

const PaymentModal = ({
  selectedGroup,
  formatCurrency,
  paymentMethod,
  setPaymentMethod,
  setShowPaymentModal,
  handlePaymentSubmit,
  isProcessingPayment,
  setIsProcessingPayment,
}: PaymentModalProps) => {
  const paymentOptions = [
    {
      value: "mobile_money" as const,
      label: "Mobile Money",
      icon: "📱",
      description: "Pay via MTN, Orange, or other mobile money services",
    },
    {
      value: "bank_transfer" as const,
      label: "Bank Transfer",
      icon: "🏦",
      description: "Direct bank account transfer",
    },
    {
      value: "card" as const,
      label: "Debit/Credit Card",
      icon: "💳",
      description: "Visa, Mastercard, or other payment cards",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessingPayment) return;

    try {
      setIsProcessingPayment(true);
      await handlePaymentSubmit(selectedGroup);
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isProcessingPayment) {
      setShowPaymentModal(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && !isProcessingPayment) {
      setShowPaymentModal(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full transform animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3
              id="payment-modal-title"
              className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2"
            >
              💰 Initiate Payment
            </h3>
            <button
              type="button"
              onClick={() => !isProcessingPayment && setShowPaymentModal(false)}
              disabled={isProcessingPayment}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Group Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                    Contributing to
                  </label>
                  <p className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    {selectedGroup.name}
                  </p>
                  {selectedGroup.description && (
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {selectedGroup.description}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                    Amount
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {formatCurrency(selectedGroup.contributionAmount!)}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Choose Payment Method
              </label>
              <div className="space-y-3">
                {paymentOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`
                      relative flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                      ${
                        paymentMethod === option.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }
                      ${
                        isProcessingPayment
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={paymentMethod === option.value}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as PaymentMethod)
                      }
                      disabled={isProcessingPayment}
                      className="sr-only"
                    />
                    <div className="flex items-center w-full">
                      <span className="text-2xl mr-3">{option.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-base font-medium text-gray-900 dark:text-white">
                            {option.label}
                          </span>
                          <div
                            className={`
                            w-5 h-5 rounded-full border-2 flex items-center justify-center
                            ${
                              paymentMethod === option.value
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300 dark:border-gray-600"
                            }
                          `}
                          >
                            {paymentMethod === option.value && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              disabled={isProcessingPayment}
              className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessingPayment}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isProcessingPayment ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <span>Proceed to Pay</span>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
