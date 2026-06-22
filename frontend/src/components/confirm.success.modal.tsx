import { CheckCircle } from "lucide-react";

export function SuccessModal({
  open,
  message,
  onClose,
  onCreateNjangi,
}: {
  open: boolean;
  message: string;
  onClose: () => void;
  onCreateNjangi: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm animate-fade-in">
        <div className="flex flex-col items-center text-center">
          <span className="bg-green-100 rounded-full p-3 mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </span>
          <h2 className="text-xl font-bold mb-2 text-gray-900">Deleted!</h2>
          <p className="mb-6 text-gray-700">{message}</p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onCreateNjangi}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition shadow"
          >
            Create Njangi
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
