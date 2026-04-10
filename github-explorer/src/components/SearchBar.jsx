import React from 'react';

const SearchBar = ({ value, onChange, isLoading }) => {
  return (
    <div style={{ marginBottom: '30px' }}>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute',
          left: '15px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '18px'
        }}>
          🔍
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search GitHub users..."
          style={{
            width: '100%',
            padding: '14px 20px 14px 45px',
            fontSize: '16px',
            background: 'var(--bg-secondary)',
            border: `2px solid var(--border-color)`,
            borderRadius: '12px',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--accent-blue)';
            e.target.style.boxShadow = '0 0 0 3px rgba(88, 166, 255, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border-color)';
            e.target.style.boxShadow = 'none';
          }}
        />
        {isLoading && (
          <div style={{
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            border: '2px solid var(--border-color)',
            borderTopColor: 'var(--accent-blue)',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
          }} />
        )}
      </div>
      {value && (
        <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Showing results for: <strong style={{ color: 'var(--accent-blue)' }}>"{value}"</strong>
        </p>
      )}
    </div>
  );
};

export default SearchBar;