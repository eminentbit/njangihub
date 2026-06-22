import React from 'react';
import DocumentCard from './DocumentCard';

interface DocumentListProps {
  isDarkMode: boolean;
  filter: { category: string; period: string };
  onSelectDocument: (id: number) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ isDarkMode, filter, onSelectDocument }) => {
  const documentsData = [
    { id: 1, title: 'Annual Report 2024', category: 'Reports', uploadDate: '2025-01-15T09:00', summary: 'Annual financial and operational report for 2024.' },
    { id: 2, title: 'Board Meeting Minutes Q1', category: 'Minutes', uploadDate: '2025-04-01T14:00', summary: 'Minutes from the Q1 board meeting.' },
    { id: 3, title: 'Governance Policy 2025', category: 'Policies', uploadDate: '2025-05-01T10:00', summary: 'Updated governance policies for 2025.' },
  ];

  const filteredDocuments = documentsData.filter(doc => {
    const matchesCategory = filter.category === 'All' || doc.category === filter.category;
    const docDate = new Date(doc.uploadDate);
    const now = new Date();
    let matchesPeriod = true;
    if (filter.period === 'This Year') {
      matchesPeriod = docDate.getFullYear() === now.getFullYear();
    } else if (filter.period === 'Last Year') {
      matchesPeriod = docDate.getFullYear() === now.getFullYear() - 1;
    }
    return matchesCategory && matchesPeriod;
  });

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
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: isDarkMode ? 'white' : 'black' }}>Documents</h3>
      {filteredDocuments.length === 0 ? (
        <p style={{ color: isDarkMode ? '#d1d5db' : '#6b7280' }}>No documents found.</p>
      ) : (
        filteredDocuments.map(doc => (
          <DocumentCard
            key={doc.id}
            document={doc}
            isDarkMode={isDarkMode}
            isMobile={isMobile}
            onSelect={() => onSelectDocument(doc.id)}
          />
        ))
      )}
    </div>
  );
};

export default DocumentList;