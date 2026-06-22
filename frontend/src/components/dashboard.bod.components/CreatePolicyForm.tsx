import React, { useState } from "react";

interface CreatePolicyFormProps {
  isDarkMode: boolean;
}

const CreatePolicyForm: React.FC<CreatePolicyFormProps> = ({ isDarkMode }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Governance");
  const [version, setVersion] = useState("1.0");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New Policy:", { title, category, version, content });
    setTitle("");
    setCategory("Governance");
    setVersion("1.0");
    setContent("");
  };

  const isMobile = window.innerWidth < 768;

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "#4b5563" : "white",
        padding: "16px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        width: isMobile ? "100%" : "300px",
        margin: isMobile ? "0 auto" : undefined,
      }}
    >
      <h3
        style={{
          margin: "0 0 16px 0",
          fontSize: "16px",
          color: isDarkMode ? "white" : "black",
        }}
      >
        Create Policy
      </h3>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <input
          type="text"
          placeholder="Policy Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid",
            borderColor: isDarkMode ? "#6b7280" : "#d1d5db",
            backgroundColor: isDarkMode ? "#374151" : "white",
            color: isDarkMode ? "white" : "black",
            fontSize: isMobile ? "14px" : "16px",
          }}
        />
        <select
          title="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid",
            borderColor: isDarkMode ? "#6b7280" : "#d1d5db",
            backgroundColor: isDarkMode ? "#374151" : "white",
            color: isDarkMode ? "white" : "black",
            fontSize: isMobile ? "14px" : "16px",
          }}
        >
          {["Governance", "Financial", "Operational"].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Version (e.g., 1.0)"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid",
            borderColor: isDarkMode ? "#6b7280" : "#d1d5db",
            backgroundColor: isDarkMode ? "#374151" : "white",
            color: isDarkMode ? "white" : "black",
            fontSize: isMobile ? "14px" : "16px",
          }}
        />
        <textarea
          placeholder="Policy Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid",
            borderColor: isDarkMode ? "#6b7280" : "#d1d5db",
            backgroundColor: isDarkMode ? "#374151" : "white",
            color: isDarkMode ? "white" : "black",
            minHeight: "80px",
            resize: "vertical",
            fontSize: isMobile ? "14px" : "16px",
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#9333ea",
            color: "white",
            padding: "8px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            fontSize: isMobile ? "14px" : "16px",
          }}
        >
          Create Policy
        </button>
      </form>
    </div>
  );
};

export default CreatePolicyForm;
