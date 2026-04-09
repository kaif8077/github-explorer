import React from 'react';

const UserList = ({ users, onSelectUser, selectedUser, loading, error, searchTerm }) => {
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        minHeight: '400px'
      }}>
        <div className="loader" />
        <p style={{ marginLeft: '15px', color: 'var(--text-secondary)' }}>Searching users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px',
        background: 'var(--bg-secondary)',
        borderRadius: '12px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚠️</div>
        <h3 style={{ color: 'var(--error-red)', marginBottom: '10px' }}>Error</h3>
        <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
      </div>
    );
  }

  if (!loading && users.length === 0 && searchTerm) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px',
        background: 'var(--bg-secondary)',
        borderRadius: '12px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>👤</div>
        <h3>No users found</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Try searching with a different username</p>
      </div>
    );
  }

  if (!loading && users.length === 0 && !searchTerm) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px',
        background: 'var(--bg-secondary)',
        borderRadius: '12px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔍</div>
        <h3>Start searching</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Enter a username to find GitHub users</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderRadius: '12px',
      padding: '16px',
      maxHeight: '600px',
      overflowY: 'auto'
    }}>
      <div style={{
        padding: '8px 12px',
        marginBottom: '16px',
        borderBottom: `2px solid var(--border-color)`,
        fontWeight: 'bold',
        color: 'var(--text-secondary)'
      }}>
        📊 {users.length} user{users.length !== 1 ? 's' : ''} found
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '12px',
              background: selectedUser?.id === user.id ? 'var(--accent-blue)' : 'var(--bg-card)',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: `1px solid ${selectedUser?.id === user.id ? 'var(--accent-blue)' : 'var(--border-color)'}`,
              transform: selectedUser?.id === user.id ? 'scale(1.02)' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
              if (selectedUser?.id !== user.id) {
                e.currentTarget.style.transform = 'translateX(5px)';
                e.currentTarget.style.borderColor = 'var(--accent-blue)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedUser?.id !== user.id) {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }
            }}
          >
            <img
              src={user.avatar_url}
              alt={user.login}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: `2px solid ${selectedUser?.id === user.id ? 'white' : 'var(--accent-blue)'}`
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: 'bold',
                fontSize: '16px',
                color: selectedUser?.id === user.id ? 'white' : 'var(--text-primary)'
              }}>
                {user.login}
              </div>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '12px',
                  color: selectedUser?.id === user.id ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)',
                  textDecoration: 'none'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                View Profile →
              </a>
            </div>
            {selectedUser?.id === user.id && (
              <div style={{ color: 'white', fontSize: '20px' }}>✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;