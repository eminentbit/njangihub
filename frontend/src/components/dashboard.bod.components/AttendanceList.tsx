import React from 'react';
import AttendanceCard from './AttendanceCard';

interface AttendanceListProps {
  isDarkMode: boolean;
  filter: { period: string; member: string };
  onSelectMember: (member: string) => void;
}

const AttendanceList: React.FC<AttendanceListProps> = ({ isDarkMode, filter, onSelectMember }) => {
  const attendanceData = [
    { meetingId: 1, date: '2025-05-01T10:00', title: 'Q2 Strategy Review', attendees: ['Alice Smith', 'Bob Johnson', 'Clara Lee'], totalMembers: 5 },
    { meetingId: 2, date: '2025-04-30T14:00', title: 'Annual General Meeting', attendees: ['David Brown', 'Emma Wilson', 'Frank Davis', 'Grace Kim'], totalMembers: 5 },
    { meetingId: 3, date: '2025-05-15T09:00', title: 'Emergency Budget Meeting', attendees: ['Henry Adams', 'Isabel Clark'], totalMembers: 5 },
  ];

  const filteredData = filter.period === 'All' ? attendanceData : attendanceData.filter(meeting => {
    const meetingDate = new Date(meeting.date);
    const now = new Date();
    if (filter.period === 'This Month') {
      return meetingDate.getMonth() === now.getMonth() && meetingDate.getFullYear() === now.getFullYear();
    }
    if (filter.period === 'Last Month') {
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
      return meetingDate.getMonth() === lastMonth.getMonth() && meetingDate.getFullYear() === lastMonth.getFullYear();
    }
    return true;
  });

  const isMobile = window.innerWidth < 768;

  return (
    <div style={{
      backgroundColor: isDarkMode ? '#4b5563' : 'white',
      padding: '16px',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      maxHeight: '50vh',
      overflowY: 'auto'
    }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: isDarkMode ? 'white' : 'black' }}>
        Meeting Attendance Records
      </h3>
      {filteredData.length === 0 ? (
        <p style={{ color: isDarkMode ? '#d1d5db' : '#6b7280' }}>No attendance records found.</p>
      ) : (
        filteredData.map(meeting => (
          <AttendanceCard
            key={meeting.meetingId}
            meeting={meeting}
            isDarkMode={isDarkMode}
            isMobile={isMobile}
            onSelectMember={onSelectMember}
          />
        ))
      )}
    </div>
  );
};

export default AttendanceList;