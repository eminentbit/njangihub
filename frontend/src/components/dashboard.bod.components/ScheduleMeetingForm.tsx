import React, { useState } from "react";
import { useBodStore } from "../../store/create.bod.store";

interface ScheduleMeetingFormProps {
  isDarkMode: boolean;
}

const ScheduleMeetingForm: React.FC<ScheduleMeetingFormProps> = ({
  isDarkMode,
}) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [agenda, setAgenda] = useState("");
  const { createMeeting } = useBodStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMeeting(title, date, agenda, "", "Pending");
    setTitle("");
    setDate("");
    setAgenda("");
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
        Schedule a Meeting
      </h3>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <input
          type="text"
          placeholder="Meeting Title"
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
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
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
          placeholder="Agenda"
          value={agenda}
          onChange={(e) => setAgenda(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid",
            borderColor: isDarkMode ? "#6b7280" : "#d1d5db",
            backgroundColor: isDarkMode ? "#374151" : "white",
            color: isDarkMode ? "white" : "black",
            minHeight: "60px",
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
          Schedule
        </button>
      </form>
    </div>
  );
};

export default ScheduleMeetingForm;
