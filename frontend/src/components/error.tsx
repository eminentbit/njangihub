import { UserX, X } from "lucide-react";
import { useState } from "react";

interface ErrorPopupProps {
  error: string;
  onClose?: () => void;
}

export default function ErrorPopup({ error, onClose }: ErrorPopupProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 pointer-events-none">
      <div className="relative mt-4 sm:mt-5 md:mt-6 w-full max-w-sm sm:max-w-md md:max-w-lg pointer-events-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600 p-[1px] shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="relative rounded-2xl bg-rose-500/90 backdrop-blur-xl border border-rose-300/40">
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-rose-300/20 transition-colors duration-200 group"
              aria-label="Close error message"
            >
              <X className="w-4 h-4 text-rose-50 group-hover:text-rose-50 transition-colors" />
            </button>

            {/* Content */}
            <div className="px-4 py-5 sm:px-6 sm:py-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-rose-300/25 backdrop-blur-sm">
                    <UserX className="w-5 h-5 sm:w-6 sm:h-6 text-rose-50 animate-pulse" />
                  </div>
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <h3 className="text-sm sm:text-base font-semibold text-white mb-1">
                    Error
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-50 leading-relaxed break-words">
                    {error}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom accent */}
            <div className="h-1 bg-gradient-to-r from-rose-300 via-rose-200 to-rose-300"></div>
          </div>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 rounded-2xl bg-rose-400/15 blur-xl scale-110 animate-pulse"></div>
      </div>
    </div>
  );
}
