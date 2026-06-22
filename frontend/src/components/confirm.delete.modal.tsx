import { AlertTriangle } from "lucide-react";
import Loader from "./loader";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export function ConfirmModal({
  open,
  title = "Are you sure?",
  message,
  onConfirm,
  onCancel,
  loading,
}: ConfirmModalProps) {
  if (!open) return null;
  console.log("Current is Loading: ", loading)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-md:w-[90%] w-full max-w-sm animate-fade-in">
        <div className="flex flex-col items-center text-center">
          <span className="bg-yellow-100 rounded-full p-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </span>
          <h2 className="text-xl font-bold mb-2 text-gray-900">{title}</h2>
          <p className="mb-6 text-gray-700">{message}</p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition"
            disabled={loading}
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition shadow disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <div className="mr-2 flex items-center ">
                <Loader />
                <span className="animate-pulse">Cancelling...</span>
              </div>
            ) : (
              <span>Yes, Cancel</span>
            )}
          </button>
        </div>
      </div>
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95);}
            to { opacity: 1; transform: scale(1);}
          }
          .animate-fade-in {
            animation: fade-in 0.2s ease;
          }
        `}
      </style>
    </div>
  );
}
