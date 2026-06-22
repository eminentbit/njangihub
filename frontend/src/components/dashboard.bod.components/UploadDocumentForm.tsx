import React, { useState } from "react";

interface UploadDocumentFormProps {
  isDarkMode: boolean;
}

const UploadDocumentForm: React.FC<UploadDocumentFormProps> = ({
  isDarkMode,
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Reports");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New Document:", { title, category, file });
    setTitle("");
    setCategory("Reports");
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
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
        Upload Document
      </h3>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <input
          type="text"
          placeholder="Document Title"
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
          title="Category"
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
          {["Reports", "Minutes", "Policies"].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="file"
          onChange={handleFileChange}
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
          Upload Document
        </button>
      </form>
    </div>
  );
};

export default UploadDocumentForm;
