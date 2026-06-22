import React from 'react';

interface RecentResolutionsProps {
  style?: React.CSSProperties;
  isDarkMode?: boolean;
}

const RecentResolutions: React.FC<RecentResolutionsProps> = ({ style, isDarkMode = false }) => {
  return (
    <div style={{ backgroundColor: isDarkMode ? '#4b5563' : 'white', padding: '16px', borderRadius: '4px', ...style }}>
      <h3 style={{ color: isDarkMode ? 'white' : 'black' }}>Recent Resolutions</h3>
      <input
        type="text"
        placeholder="Search resolutions..."
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          backgroundColor: isDarkMode ? '#6b7280' : 'white',
          color: isDarkMode ? 'white' : 'black'
        }}
      />
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ color: isDarkMode ? 'white' : 'black' }}>
          Strategic Plan - Apr 25, 2025 - <span style={{ color: '#22c55e' }}>Approved</span>
        </li>
      </ul>
    </div>
  );
};

export default RecentResolutions;