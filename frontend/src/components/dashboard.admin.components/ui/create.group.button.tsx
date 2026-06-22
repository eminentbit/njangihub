import { useState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import UpgradeModal from "../../upgradePlan";

const CreateGroupButton = ({
  adminGroupsCount,
}: {
  adminGroupsCount: number;
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-close after 5 seconds
  useEffect(() => {
    if (!showInfo) return;
    const timer = setTimeout(() => setShowInfo(false), 5000);
    return () => clearTimeout(timer);
  }, [showInfo]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showInfo &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowInfo(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInfo]);

  const handleClick = () => {
    if (adminGroupsCount < 1) {
      // your normal create‐group logic here
      console.log("Opening group creation modal...");
    } else {
      setShowInfo((v) => !v);
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        className={`font-semibold rounded-lg px-6 py-3 shadow-lg transition-all duration-150
          ${
            adminGroupsCount >= 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white"
          }`}
        onClick={handleClick}
      >
        <span className="flex items-center gap-2">
          <Plus size={18} />
          {adminGroupsCount >= 1 ? "Group Limit Reached" : "Create New Group"}
        </span>
      </button>

      {openModal && (
        <UpgradeModal isOpen={openModal} onClose={() => setOpenModal(false)} />
      )}

      {showInfo && adminGroupsCount >= 1 && (
        <div
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 max-h-40 overflow-auto
                      bg-red-100 border border-red-300 text-red-700 rounded-lg p-4 shadow-md z-20"
        >
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
              />
            </svg>
            <div className="space-y-1">
              <p>
                You can only create one group on the free plan. To get more
                groups,{" "}
                <button
                  type="button"
                  className="underline font-medium"
                  onClick={() => {
                    setOpenModal(true);
                    setShowInfo(false);
                  }}
                >
                  upgrade your plan
                </button>
                .
              </p>
              <p className="text-xs text-gray-500">
                Upgrade now to unlock unlimited groups.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateGroupButton;
