import React from 'react';

const BookmarkList = ({ bookmarks, onRemoveBookmark, onBookmarkClick }) => {
  if (bookmarks.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        border: `1px solid var(--border-color)`
      }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>⭐</div>
        <h3>No bookmarked repos</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Click the star icon (★) on any repository to bookmark it
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderRadius: '12px',
      padding: '20px',
      border: `1px solid var(--border-color)`
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: `2px solid var(--border-color)`
      }}>
        <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>⭐</span> Your Bookmarks
          <span style={{
            background: 'var(--accent-blue)',
            padding: '2px 10px',
            borderRadius: '20px',
            fontSize: '14px',
            color: 'white'
          }}>
            {bookmarks.length}
          </span>
        </h2>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            style={{
              background: 'var(--bg-card)',
              border: `1px solid var(--border-color)`,
              borderRadius: '10px',
              padding: '15px',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(5px)';
              e.currentTarget.style.borderColor = 'var(--accent-blue)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div 
                style={{ flex: 1 }}
                onClick={() => onBookmarkClick(bookmark)}
              >
                <div style={{ 
                  fontWeight: 'bold', 
                  color: 'var(--accent-blue)',
                  fontSize: '16px',
                  marginBottom: '8px'
                }}>
                  📁 {bookmark.name}
                </div>
                {bookmark.description && (
                  <div style={{ 
                    fontSize: '13px', 
                    color: 'var(--text-secondary)',
                    marginBottom: '10px',
                    lineHeight: '1.4'
                  }}>
                    {bookmark.description.length > 150 
                      ? bookmark.description.substring(0, 150) + '...' 
                      : bookmark.description}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                  {bookmark.owner && <span>👤 {bookmark.owner}</span>}
                  <span>⭐ {bookmark.stars?.toLocaleString() || 0}</span>
                  <span>🍴 {bookmark.forks?.toLocaleString() || 0}</span>
                  {bookmark.language && <span>🔤 {bookmark.language}</span>}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveBookmark(bookmark.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#f85149',
                  padding: '5px',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                title="Remove bookmark"
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarkList;