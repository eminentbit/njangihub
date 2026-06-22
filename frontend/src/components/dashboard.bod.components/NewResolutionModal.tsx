import React, { useState } from "react";
import { useBodStore } from "../../store/create.bod.store";

interface NewResolutionModalProps {
  isDarkMode: boolean;
  onClose: () => void;
}

const NewResolutionModal: React.FC<NewResolutionModalProps> = ({
  isDarkMode,
  onClose,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { createResolution } = useBodStore();

  const handleSubmit = async () => {
    await createResolution(title, description);
    onClose();
  };

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
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: isDarkMode ? "#374151" : "white",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          width: "400px",
          color: isDarkMode ? "white" : "black",
        }}
      >
        <h3 style={{ margin: "0 0 16px 0", fontSize: "18px" }}>
          Create New Resolution
        </h3>
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}
          >
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid",
              borderColor: isDarkMode ? "#4b5563" : "#d1d5db",
              backgroundColor: isDarkMode ? "#4b5563" : "white",
              color: isDarkMode ? "white" : "black",
            }}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}
          >
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid",
              borderColor: isDarkMode ? "#4b5563" : "#d1d5db",
              backgroundColor: isDarkMode ? "#4b5563" : "white",
              color: isDarkMode ? "white" : "black",
              minHeight: "80px",
            }}
          />
        </div>
        <div
          style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 16px",
              backgroundColor: isDarkMode ? "#4b5563" : "#e5e7eb",
              color: isDarkMode ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            style={{
              padding: "8px 16px",
              backgroundColor: "#9333ea",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewResolutionModal;
