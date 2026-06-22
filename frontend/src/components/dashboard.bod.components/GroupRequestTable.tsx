import React, { useState } from "react";
import GroupRequestRow from "./GroupRequestRow";
import { GroupRequest } from "../../types/group.request";
import { GroupDetails } from "../../types/create-njangi-types";
import GroupRequestModal from "./GroupRequestModal";

interface GroupRequestTableProps {
  requests: GroupRequest[] | null;
  isDarkMode: boolean;
  onSelectRequest: (id: string) => void;
  selectedGroup: GroupDetails;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const GroupRequestTable: React.FC<GroupRequestTableProps> = ({
  requests,
  isDarkMode,
  onSelectRequest,
  selectedGroup,
  // onAccept,
  // onReject,
}) => {
  const isMobile = window.innerWidth < 768;
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState<"approve" | "reject" | undefined>();

  const headerStyle: React.CSSProperties = {
    display: "flex",
    padding: "12px 16px",
    backgroundColor: isDarkMode ? "#4b5563" : "#e9d5ff",
    fontWeight: "bold",
    fontSize: isMobile ? "12px" : "14px",
    color: isDarkMode ? "white" : "black",
    borderRadius: "4px 4px 0 0",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  };

  const columnStyle = (width: string): React.CSSProperties => ({
    flex: width,
    padding: "0 8px",
  });

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "#4b5563" : "white",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        maxHeight: "60vh",
        overflowY: "auto",
      }}
    >
      <div style={headerStyle}>
        <div style={columnStyle("0 0 50px")}>ID</div>
        <div style={columnStyle("1")}>Leader Name</div>
        <div style={columnStyle("1")}>Group Name</div>
        <div style={columnStyle("0 0 150px")}>Max Members</div>
        <div style={columnStyle("2")}>Description</div>
        <div style={columnStyle("0 0 120px")}>State</div>
        {/* <div style={columnStyle("0 0 200px")}>Decision</div> */}
      </div>
      {requests?.length === 0 ? (
        <p
          style={{
            padding: "16px",
            color: isDarkMode ? "#d1d5db" : "#6b7280",
            textAlign: "center",
          }}
        >
          No group requests found.
        </p>
      ) : (
        requests?.map((request, index) => (
          <GroupRequestRow
            key={index}
            request={request}
            isDarkMode={isDarkMode}
            isMobile={isMobile}
            onSelect={() => {
              onSelectRequest(request._id);
            }}
            setAction={setAction}
            onShowModal={() => setIsOpen(true)}
          />
        ))
      )}
      {isOpen && (
        <GroupRequestModal
          action={action}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          request={selectedGroup}
        />
      )}
    </div>
  );
};

export default GroupRequestTable;
