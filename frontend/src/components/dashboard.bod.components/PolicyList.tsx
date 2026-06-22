import React from 'react';
import PolicyCard from './PolicyCard';

interface PolicyListProps {
  isDarkMode: boolean;
  filter: { category: string; status: string };
  onSelectPolicy: (id: number) => void;
}

const PolicyList: React.FC<PolicyListProps> = ({ isDarkMode, filter, onSelectPolicy }) => {
  const policiesData = [
    { id: 1, title: 'Board Meeting Policy', category: 'Governance', version: '2.1', lastUpdated: '2025-05-01T10:00', status: 'Active', summary: 'Guidelines for conducting board meetings.' },
    { id: 2, title: 'Financial Reporting Policy', category: 'Financial', version: '1.3', lastUpdated: '2025-04-15T14:00', status: 'Draft', summary: 'Procedures for financial reporting.' },
    { id: 3, title: 'Operational Safety Policy', category: 'Operational', version: '1.0', lastUpdated: '2025-03-10T09:00', status: 'Archived', summary: 'Safety protocols for operations.' },
  ];

  const filteredPolicies = policiesData.filter(policy => {
    const matchesCategory = filter.category === 'All' || policy.category === filter.category;
    const matchesStatus = filter.status === 'All' || policy.status === filter.status;
    return matchesCategory && matchesStatus;
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
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: isDarkMode ? 'white' : 'black' }}>Policies</h3>
      {filteredPolicies.length === 0 ? (
        <p style={{ color: isDarkMode ? '#d1d5db' : '#6b7280' }}>No policies found.</p>
      ) : (
        filteredPolicies.map(policy => (
          <PolicyCard
            key={policy.id}
            policy={policy}
            isDarkMode={isDarkMode}
            isMobile={isMobile}
            onSelect={() => onSelectPolicy(policy.id)}
          />
        ))
      )}
    </div>
  );
};

export default PolicyList;