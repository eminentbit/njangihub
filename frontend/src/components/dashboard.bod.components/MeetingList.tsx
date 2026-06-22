import React from "react";
import MeetingCard from "./MeetingCard";
import { useBodStore } from "../../store/create.bod.store";

interface MeetingListProps {
  isDarkMode: boolean;
  filter: string;
}

const MeetingList: React.FC<MeetingListProps> = ({ isDarkMode, filter }) => {
  // const meetings = [
  //   { id: 1, title: 'Q2 Strategy Review', date: '2025-05-10T10:00', status: 'Upcoming', agenda: 'Discuss Q2 strategy and budget.' },
  //   { id: 2, title: 'Annual General Meeting', date: '2025-04-30T14:00', status: 'Completed', agenda: 'Annual report and elections.' },
  //   { id: 3, title: 'Emergency Budget Meeting', date: '2025-05-15T09:00', status: 'Cancelled', agenda: 'Address budget shortfall.' },
  // ];

  const { meetings } = useBodStore();

  const filteredMeetings =
    filter === "All"
      ? meetings
      : meetings.filter((meeting) => meeting.status === filter);

  // For responsiveness
  const isMobile = window.innerWidth < 768;

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "#4b5563" : "white",
        padding: "16px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        maxHeight: "60vh",
        overflowY: "auto",
      }}
    >
      <h3
        style={{
          margin: "0 0 16px 0",
          fontSize: "18px",
          color: isDarkMode ? "white" : "black",
        }}
      >
        Scheduled Meetings
      </h3>
      {filteredMeetings.length === 0 ? (
        <p style={{ color: isDarkMode ? "#d1d5db" : "#6b7280" }}>
          No meetings found.
        </p>
      ) : (
        filteredMeetings.map((meeting, index) => (
          <MeetingCard
            key={index}
            meeting={meeting}
            isDarkMode={isDarkMode}
            isMobile={isMobile}
          />
        ))
      )}
    </div>
  );
};

export default MeetingList;
