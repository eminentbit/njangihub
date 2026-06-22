import React from 'react';
import MinutesCard from './MinutesCard';

interface MinutesListProps {
  isDarkMode: boolean;
  filter: string;
  onSelectMinutes: (id: number) => void;
}

const MinutesList: React.FC<MinutesListProps> = ({ isDarkMode, filter, onSelectMinutes }) => {
  const minutesData = [
    { id: 1, title: 'Q2 Strategy Review', date: '2025-05-01T10:00', status: 'Approved', summary: 'Discussed strategic plan for Q2.' },
    { id: 2, title: 'Annual General Meeting', date: '2025-04-30T14:00', status: 'Draft', summary: 'Reviewed annual report and elections.' },
    { id: 3, title: 'Emergency Budget Meeting', date: '2025-05-15T09:00', status: 'Archived', summary: 'Addressed budget shortfall.' },
  ];

  const filteredMinutes = filter === 'All' ? minutesData : minutesData.filter(minutes => minutes.status === filter);

  const isMobile = window.innerWidth < 768;

  return (
    <div style={{
      backgroundColor: isDarkMode ? '#4b5563' : 'white',
      padding: '16px',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      maxHeight: '60vh',
      overflowY: 'auto'
    }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: isDarkMode ? 'white' : 'black' }}>Meeting Minutes</h3>
      {filteredMinutes.length === 0 ? (
        <p style={{ color: isDarkMode ? '#d1d5db' : '#6b7280' }}>No meeting minutes found.</p>
      ) : (
        filteredMinutes.map(minutes => (
          <MinutesCard
            key={minutes.id}
            minutes={minutes}
            isDarkMode={isDarkMode}
            isMobile={isMobile}
            onSelect={() => onSelectMinutes(minutes.id)}
          />
        ))
      )}
    </div>
  );
};

export default MinutesList;