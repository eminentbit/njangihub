"use client";

import { useState } from "react";
import { CreditCard, Check, X } from "lucide-react";

// Exchange rate: 1 USD = approximately 600 CFA
const CFA_EXCHANGE_RATE = 600;

interface SubscriptionModalProps {
  onClose: () => void;
  onSubscribe: () => void;
}

const SubscriptionModal = ({
  onClose,
  onSubscribe,
}: SubscriptionModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string>("monthly");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const plans = [
    {
      id: "monthly",
      name: "Monthly",
      price: 10 * CFA_EXCHANGE_RATE,
      description: "Perfect for individuals",
      features: ["Create up to 3 groups", "Basic analytics", "Email support"],
    },
    {
      id: "yearly",
      name: "Yearly",
      price: 100 * CFA_EXCHANGE_RATE,
      description: "Save 17% with annual billing",
      features: [
        "Create unlimited groups",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
      ],
    },
  ];

  const handleSubscribe = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSubscribe();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Subscribe to Premium</h2>
          <button
            type="button"
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedPlan === plan.id
                  ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{plan.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {plan.description}
                  </p>
                </div>
                {selectedPlan === plan.id && (
                  <div className="bg-indigo-600 text-white p-1 rounded-full">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>

              <p className="text-2xl font-bold mb-3">
                {plan.price.toLocaleString()} CFA
              </p>

              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-3">Payment Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              className={`border rounded-lg p-3 flex items-center gap-3 cursor-pointer ${
                paymentMethod === "card"
                  ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <span>Credit Card</span>
            </div>
            <div
              className={`border rounded-lg p-3 flex items-center gap-3 cursor-pointer ${
                paymentMethod === "mobile"
                  ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => setPaymentMethod("mobile")}
            >
              <svg
                className="h-5 w-5 text-orange-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.5,2 C18.9,2 20,3.1 20,4.5 L20,19.5 C20,20.9 18.9,22 17.5,22 L6.5,22 C5.1,22 4,20.9 4,19.5 L4,4.5 C4,3.1 5.1,2 6.5,2 L17.5,2 Z M12,19 C11.4,19 11,19.4 11,20 C11,20.6 11.4,21 12,21 C12.6,21 13,20.6 13,20 C13,19.4 12.6,19 12,19 Z M17,4 L7,4 L7,18 L17,18 L17,4 Z" />
              </svg>
              <span>Mobile Money</span>
            </div>
            <div
              className={`border rounded-lg p-3 flex items-center gap-3 cursor-pointer ${
                paymentMethod === "bank"
                  ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => setPaymentMethod("bank")}
            >
              <svg
                className="h-5 w-5 text-blue-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4,10V17H7V10H4M10,10V17H13V10H10M2,22H21V19H2M16,10V17H19V10H16M11.5,1L2,6V8H21V6L11.5,1Z" />
              </svg>
              <span>Bank Transfer</span>
            </div>
          </div>
        </div>

        {paymentMethod === "card" && (
          <div className="mb-6 border dark:border-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "mobile" && (
          <div className="mb-6 border dark:border-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="+237 6XX XXX XXX"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You will receive a payment confirmation code on this number to
                complete your subscription.
              </p>
            </div>
          </div>
        )}

        {paymentMethod === "bank" && (
          <div className="mb-6 border dark:border-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Please make a transfer to the following bank account:
            </p>
            <div className="space-y-2 mb-3">
              <p className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Bank:</span>
                <span className="font-medium">Cameroon National Bank</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Account Name:
                </span>
                <span className="font-medium">Group Finance Ltd</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Account Number:
                </span>
                <span className="font-medium">1234567890</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Reference:
                </span>
                <span className="font-medium">
                  SUB-{Math.floor(Math.random() * 10000)}
                </span>
              </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              After making the transfer, please enter your transaction reference
              below:
            </p>
            <input
              type="text"
              placeholder="Transaction Reference"
              className="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary flex items-center gap-2"
            onClick={handleSubscribe}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Subscribe Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
