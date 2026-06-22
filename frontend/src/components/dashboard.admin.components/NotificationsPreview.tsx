import React from "react";
import { Link } from "react-router-dom";
import useUserStore from "../../store/create.user.store";

interface NotificationsPreviewProps {
  onViewAll: () => void;
  showLabels?: boolean;
}

const NotificationsPreview: React.FC<NotificationsPreviewProps> = ({
  onViewAll,
  // showLabels = true,
}) => {
  const { notifications } = useUserStore();

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className={`p-2 rounded-lg text-sm ml-3 ${
            index % 2 === 0 ? "bg-indigo-600" : "bg-indigo-600/30"
          }`}
        >
          <div className="flex justify-between items-start">
            <p>{`Notification ${index + 1}`}</p>
            {!notifications[index]?.isRead && (
              <div className="w-2 h-2 rounded-full bg-red-500 mt-1" />
            )}
          </div>
          <p className="text-xs text-indigo-300 mt-1">{`Created At: ${new Date().toLocaleString()}`}</p>
        </div>
      ))}
      <button
        type="button"
        onClick={onViewAll}
        className="text-indigo-300 text-sm hover:text-white cursor-pointer whitespace-nowrap pb-3 ml-3"
      >
        <Link to="/admin/notifications">View All</Link>
      </button>
    </div>
  );
};

export default NotificationsPreview;
