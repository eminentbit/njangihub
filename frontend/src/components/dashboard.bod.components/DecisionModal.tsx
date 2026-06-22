import React from "react";

interface DecisionModalProps {
  isOpen: boolean;
  action: "approve" | "reject" | null;
  isDarkMode: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const DecisionModal: React.FC<DecisionModalProps> = ({
  isOpen,
  action,
  isDarkMode,
  onClose,
  onSubmit,
}) => {
  const [reason, setReason] = React.useState("");

  const handleSubmit = () => {
    onSubmit(reason);
    setReason("");
    onClose();
  };

  const isMobile = window.innerWidth < 768;

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: isDarkMode ? "#4b5563" : "white",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          width: isMobile ? "90%" : "400px",
          maxWidth: "90%",
          color: isDarkMode ? "white" : "black",
        }}
      >
        <h3 style={{ margin: "0 0 16px 0", fontSize: "18px" }}>
          {action} Group Request
        </h3>
        <p
          style={{
            margin: "0 0 16px 0",
            fontSize: "14px",
            color: isDarkMode ? "#d1d5db" : "#6b7280",
          }}
        >
          Please provide a reason for your decision:
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter your reason here..."
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid",
            borderColor: isDarkMode ? "#6b7280" : "#d1d5db",
            backgroundColor: isDarkMode ? "#374151" : "white",
            color: isDarkMode ? "white" : "black",
            resize: "vertical",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        />
        <div
          style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              padding: "8px 16px",
              backgroundColor: action === "approve" ? "#10b981" : "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecisionModal;
