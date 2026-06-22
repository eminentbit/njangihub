import React, { useState } from 'react';

interface AddMinutesFormProps {
  isDarkMode: boolean;
}

const AddMinutesForm: React.FC<AddMinutesFormProps> = ({ isDarkMode }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [summary, setSummary] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New Minutes:', { title, date, summary });
    setTitle('');
    setDate('');
    setSummary('');
  };

  const isMobile = window.innerWidth < 768;

  return (
    <div style={{
      backgroundColor: isDarkMode ? '#4b5563' : 'white',
      padding: '16px',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      width: isMobile ? '100%' : '300px',
      margin: isMobile ? '0 auto' : undefined
    }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: isDarkMode ? 'white' : 'black' }}>Add Meeting Minutes</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="text"
          placeholder="Meeting Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid',
            borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
            backgroundColor: isDarkMode ? '#374151' : 'white',
            color: isDarkMode ? 'white' : 'black',
            fontSize: isMobile ? '14px' : '16px'
          }}
        />
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid',
            borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
            backgroundColor: isDarkMode ? '#374151' : 'white',
            color: isDarkMode ? 'white' : 'black',
            fontSize: isMobile ? '14px' : '16px'
          }}
        />
        <textarea
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid',
            borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
            backgroundColor: isDarkMode ? '#374151' : 'white',
            color: isDarkMode ? 'white' : 'black',
            minHeight: '60px',
            resize: 'vertical',
            fontSize: isMobile ? '14px' : '16px'
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#9333ea',
            color: 'white',
            padding: '8px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            fontSize: isMobile ? '14px' : '16px'
          }}
        >
          Add Minutes
        </button>
      </form>
    </div>
  );
};

export default AddMinutesForm;