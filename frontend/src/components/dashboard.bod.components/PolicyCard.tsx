import React from 'react';

interface Policy {
  id: number;
  title: string;
  category: string;
  version: string;
  lastUpdated: string;
  status: string;
  summary: string;
}

interface PolicyCardProps {
  policy: Policy;
  isDarkMode: boolean;
  isMobile: boolean;
  onSelect: () => void;
}

const PolicyCard: React.FC<PolicyCardProps> = ({ policy, isDarkMode, isMobile, onSelect }) => {
  const statusColor = {
    Active: '#10b981',
    Draft: '#f59e0b',
    Archived: '#6b7280'
  }[policy.status] || '#6b7280';

  return (
    <div
      onClick={onSelect}
      style={{
        padding: '16px',
        backgroundColor: isDarkMode ? '#374151' : '#e9d5ff',
        borderRadius: '4px',
        marginBottom: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease'
      }}
    >
      <div style={{ flex: '1' }}>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: isDarkMode ? 'white' : 'black' }}>{policy.title}</h4>
        <p style={{ margin: '0', color: isDarkMode ? '#d1d5db' : '#6b7280', fontSize: '14px' }}>{policy.summary}</p>
        <p style={{ margin: '4px 0 0 0', color: isDarkMode ? '#d1d5db' : '#6b7280', fontSize: '12px' }}>
          Version: {policy.version} | Updated: {new Date(policy.lastUpdated).toLocaleString()}
        </p>
      </div>
      <span style={{
        padding: '4px 8px',
        backgroundColor: statusColor,
        color: 'white',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 'bold',
        alignSelf: isMobile ? 'flex-end' : 'center'
      }}>
        {policy.status}
      </span>
    </div>
  );
};

export default PolicyCard;