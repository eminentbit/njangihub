import React from 'react';

interface Meeting {
  meetingId: number;
  date: string;
  title: string;
  attendees: string[];
  totalMembers: number;
}

interface AttendanceCardProps {
  meeting: Meeting;
  isDarkMode: boolean;
  isMobile: boolean;
  onSelectMember: (member: string) => void;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({ meeting, isDarkMode, isMobile, onSelectMember }) => {
  const attendanceRate = Math.round((meeting.attendees.length / meeting.totalMembers) * 100);

  return (
    <div style={{
      padding: '16px',
      backgroundColor: isDarkMode ? '#374151' : '#e9d5ff',
      borderRadius: '4px',
      marginBottom: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'flex-start' : 'center',
      gap: '8px'
    }}>
      <div style={{ flex: '1' }}>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: isDarkMode ? 'white' : 'black' }}>{meeting.title}</h4>
        <p style={{ margin: '0', color: isDarkMode ? '#d1d5db' : '#6b7280', fontSize: '14px' }}>
          Date: {new Date(meeting.date).toLocaleString()}
        </p>
        <p style={{ margin: '4px 0 0 0', color: isDarkMode ? '#d1d5db' : '#6b7280', fontSize: '14px' }}>
          Attendees: {meeting.attendees.map((attendee, index) => (
            <span key={index}>
              <span
                onClick={() => onSelectMember(attendee)}
                style={{
                  color: isDarkMode ? '#93c5fd' : '#5b1a89',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  marginRight: '4px'
                }}
              >
                {attendee}
              </span>
              {index < meeting.attendees.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
        <p style={{ margin: '4px 0 0 0', color: isDarkMode ? '#d1d5db' : '#6b7280', fontSize: '14px' }}>
          Absent: {meeting.totalMembers - meeting.attendees.length} member{meeting.totalMembers - meeting.attendees.length !== 1 ? 's' : ''}
        </p>
      </div>
      <span style={{
        padding: '4px 8px',
        backgroundColor: attendanceRate >= 80 ? '#10b981' : '#f59e0b',
        color: 'white',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 'bold',
        alignSelf: isMobile ? 'flex-end' : 'center'
      }}>
        {attendanceRate}% Attendance
      </span>
    </div>
  );
};

export default AttendanceCard;