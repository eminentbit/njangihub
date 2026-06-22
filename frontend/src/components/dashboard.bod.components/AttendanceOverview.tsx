import React from 'react';

interface AttendanceOverviewProps {
  isDarkMode: boolean;
  filter: { period: string; member: string };
}

const AttendanceOverview: React.FC<AttendanceOverviewProps> = ({ isDarkMode, filter }) => {
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

  const totalAttendees = filteredData.reduce((sum, meeting) => sum + meeting.attendees.length, 0);
  const totalPossible = filteredData.reduce((sum, meeting) => sum + meeting.totalMembers, 0);
  const attendanceRate = totalPossible > 0 ? Math.round((totalAttendees / totalPossible) * 100) : 0;

  return (
    <div style={{
      backgroundColor: isDarkMode ? '#4b5563' : 'white',
      padding: '16px',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      marginBottom: '16px'
    }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: isDarkMode ? 'white' : 'black' }}>
        Attendance Overview ({filter.period})
      </h3>
      <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: attendanceRate >= 80 ? '#10b981' : '#f59e0b' }}>
        {attendanceRate}% Attendance Rate
      </p>
      <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: isDarkMode ? '#d1d5db' : '#6b7280' }}>
        Based on {filteredData.length} meeting{filteredData.length !== 1 ? 's' : ''} with {totalAttendees} of {totalPossible} possible attendees.
      </p>
    </div>
  );
};

export default AttendanceOverview;