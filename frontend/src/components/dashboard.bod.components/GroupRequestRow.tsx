import React, { Dispatch, SetStateAction } from "react";
import { GroupDetails } from "../../types/create-njangi-types";

interface GroupRequestRowProps {
  request: {
    groupDetails: GroupDetails;
    _id: string;
  };
  isDarkMode: boolean;
  isMobile: boolean;
  onSelect: () => void;
  onShowModal: (id: string) => void;
  setAction: Dispatch<SetStateAction<"approve" | "reject" | undefined>>;
}

const GroupRequestRow: React.FC<GroupRequestRowProps> = ({
  request,
  isDarkMode,
  isMobile,
  onSelect,
}) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    backgroundColor: isDarkMode ? "#374151" : "#f9fafb",
    borderBottom: `1px solid ${isDarkMode ? "#4b5563" : "#e5e7eb"}`,
    fontSize: isMobile ? "12px" : "14px",
    color: isDarkMode ? "white" : "black",
    transition: "background-color 0.3s ease",
  };

  const columnStyle = (width: string): React.CSSProperties => ({
    flex: width,
    padding: "0 8px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  });

  return (
    <div style={rowStyle}>
      <div style={columnStyle("0 0 50px")}>{request._id}</div>
      <div style={columnStyle("1")}>
        {request.groupDetails.adminEmail &&
          truncateText(request.groupDetails.adminEmail, isMobile ? 15 : 20)}
      </div>
      <div style={columnStyle("1")}>
        {truncateText(request.groupDetails.groupName, isMobile ? 15 : 20)}
      </div>
      <div style={columnStyle("0 0 150px")}>
        {request.groupDetails.numberOfMember || "N/A"}
      </div>
      <div style={columnStyle("2")}>
        {request.groupDetails.rules &&
          truncateText(request.groupDetails.rules, isMobile ? 20 : 40)}
      </div>
      <div style={columnStyle("0 0 120px")}>
        <span
          style={{
            padding: "4px 8px",
            backgroundColor: "#f59e0b",
            color: "white",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {request.groupDetails.status && request.groupDetails.status}
        </span>
      </div>
      <div style={columnStyle("0 0 200px")}>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={onSelect}
            style={{
              padding: "4px 8px",
              backgroundColor: "#9333ea",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: isMobile ? "12px" : "14px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            View More ➔
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupRequestRow;
