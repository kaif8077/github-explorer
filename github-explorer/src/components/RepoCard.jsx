import React, { useState, useEffect } from 'react';

const RepoCard = ({ repo, onBookmarkChange }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Check if repo is bookmarked on load
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedRepos') || '[]');
    setIsBookmarked(bookmarks.some(b => b.id === repo.id));
  }, [repo.id]);

  const toggleBookmark = (e) => {
    e.stopPropagation();
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedRepos') || '[]');
    
    if (isBookmarked) {
      // Remove from bookmarks
      const newBookmarks = bookmarks.filter(b => b.id !== repo.id);
      localStorage.setItem('bookmarkedRepos', JSON.stringify(newBookmarks));
      setIsBookmarked(false);
      
      // IMPORTANT: Notify parent immediately
      if (onBookmarkChange) {
        onBookmarkChange();
      }
    } else {
      // Add to bookmarks
      const newBookmark = { 
        id: repo.id, 
        name: repo.name, 
        fullName: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        url: repo.html_url,
        owner: repo.owner?.login,
        bookmarkedAt: new Date().toISOString()
      };
      const newBookmarks = [...bookmarks, newBookmark];
      localStorage.setItem('bookmarkedRepos', JSON.stringify(newBookmarks));
      setIsBookmarked(true);
      
      // IMPORTANT: Notify parent immediately
      if (onBookmarkChange) {
        onBookmarkChange();
      }
    }
  };

  const languageColors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    'C++': '#f34b7d',
    HTML: '#e34c26',
    CSS: '#563d7c',
  };

  const languageColor = languageColors[repo.language] || '#8b949e';

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid var(--border-color)`,
      borderRadius: '10px',
      padding: '16px',
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <h3 style={{ margin: 0 }}>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--accent-blue)',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '600'
            }}
          >
            📁 {repo.name}
          </a>
        </h3>
        <button
          onClick={toggleBookmark}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: isBookmarked ? '#f6c23e' : 'var(--text-secondary)',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark repository'}
        >
          {isBookmarked ? '★' : '☆'}
        </button>
      </div>
      
      {repo.description && (
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '14px',
          marginBottom: '12px',
          lineHeight: '1.5'
        }}>
          {repo.description.length > 200 ? repo.description.substring(0, 200) + '...' : repo.description}
        </p>
      )}
      
      <div style={{
        display: 'flex',
        gap: '20px',
        fontSize: '13px',
        color: 'var(--text-secondary)',
        flexWrap: 'wrap'
      }}>
        {repo.language && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: languageColor,
              display: 'inline-block'
            }}></span>
            {repo.language}
          </span>
        )}
        <span>⭐ {repo.stargazers_count.toLocaleString()}</span>
        <span>🍴 {repo.forks_count.toLocaleString()}</span>
        <span>📅 Updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default RepoCard;