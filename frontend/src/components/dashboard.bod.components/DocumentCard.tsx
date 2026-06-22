import React from 'react';

interface Document {
  id: number;
  title: string;
  category: string;
  uploadDate: string;
  summary: string;
}

interface DocumentCardProps {
  document: Document;
  isDarkMode: boolean;
  isMobile: boolean;
  onSelect: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, isDarkMode, isMobile, onSelect }) => {
  const categoryColor = {
    Reports: '#10b981',
    Minutes: '#f59e0b',
    Policies: '#9333ea'
  }[document.category] || '#6b7280';

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
        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: isDarkMode ? 'white' : 'black' }}>{document.title}</h4>
        <p style={{ margin: '0', color: isDarkMode ? '#d1d5db' : '#6b7280', fontSize: '14px' }}>{document.summary}</p>
        <p style={{ margin: '4px 0 0 0', color: isDarkMode ? '#d1d5db' : '#6b7280', fontSize: '12px' }}>
          Uploaded: {new Date(document.uploadDate).toLocaleString()}
        </p>
      </div>
      <span style={{
        padding: '4px 8px',
        backgroundColor: categoryColor,
        color: 'white',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 'bold',
        alignSelf: isMobile ? 'flex-end' : 'center'
      }}>
        {document.category}
      </span>
    </div>
  );
};

export default DocumentCard;