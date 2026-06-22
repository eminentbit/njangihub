import { useState } from "react";
import { CreditCard, Smartphone, Ban, X } from "lucide-react";

type PaymentMethod = {
  id: string;
  label: string;
  type: "card" | "mobile" | "bank";
  details?: string;
  isDefault?: boolean;
};

export default function SettingsPayment() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newMethod, setNewMethod] = useState<Partial<PaymentMethod>>({
    type: "card",
  });
  const [error, setError] = useState("");

  const handleAdd = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setNewMethod({ type: "card" });
    setError("");
  };

  const saveMethod = () => {
    if (!newMethod.label || !newMethod.type) {
      setError("Please fill in all required fields.");
      return;
    }
    const id = Date.now().toString();
    setMethods((prev) => [
      ...prev.map((m) => ({ ...m, isDefault: false })),
      { ...newMethod, id, isDefault: true } as PaymentMethod,
    ]);
    handleClose();
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Payment Methods
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Manage your preferred payment options
      </p>

      <div className="space-y-4 mb-6">
        {methods.map((m) => (
          <div
            key={m.id}
            className="flex justify-between items-center p-4 border dark:border-gray-700 rounded-lg hover:shadow transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-md">
                {m.type === "card" && (
                  <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                )}
                {m.type === "mobile" && (
                  <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                )}
                {m.type === "bank" && (
                  <Ban className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {m.label}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {m.details}
                </p>
              </div>
            </div>
            {m.isDefault && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">
                Default
              </span>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAdd}
          className="w-full inline-flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-600 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition"
        >
          <CreditCard className="h-5 w-5" />
          Add New Payment Method
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Add Payment Method
              </h3>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 focus:outline-none"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <div className="space-y-4">
              <label
                htmlFor="payment-type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Payment Type
              </label>
              <select
                id="payment-type"
                value={newMethod.type}
                onChange={(e) =>
                  setNewMethod({
                    ...newMethod,
                    type: e.target.value as PaymentMethod["type"],
                  })
                }
                className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="card">Credit/Debit Card</option>
                <option value="mobile">Mobile Money</option>
                <option value="bank">UBA Bank Transfer</option>
              </select>

              <input
                type="text"
                placeholder={
                  newMethod.type === "mobile"
                    ? "Mobile Number"
                    : newMethod.type === "bank"
                    ? "Account Number"
                    : "Card Number"
                }
                value={newMethod.label || ""}
                onChange={(e) =>
                  setNewMethod({ ...newMethod, label: e.target.value })
                }
                className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />

              {newMethod.type === "card" && (
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={newMethod.details?.split("Expires ")[1] || ""}
                    onChange={(e) =>
                      setNewMethod({
                        ...newMethod,
                        details: `Expires ${e.target.value}`,
                      })
                    }
                    className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    onChange={() => {
                      /* store CVV securely */
                    }}
                    className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveMethod}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
