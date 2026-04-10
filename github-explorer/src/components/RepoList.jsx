import React, { useState, useMemo } from 'react';
import RepoCard from './RepoCard';

const RepoList = ({ repos, isLoading, error, onRetry, onBookmarkChange }) => {
  const [sortBy, setSortBy] = useState('updated');
  const [filterLanguage, setFilterLanguage] = useState('all');

  const languages = useMemo(() => {
    const langs = new Set(repos.map(repo => repo.language).filter(Boolean));
    return ['all', ...Array.from(langs).sort()];
  }, [repos]);

  const processedRepos = useMemo(() => {
    let filtered = [...repos];
    
    if (filterLanguage !== 'all') {
      filtered = filtered.filter(repo => repo.language === filterLanguage);
    }
    
    filtered.sort((a, b) => {
      if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
      if (sortBy === 'forks') return b.forks_count - a.forks_count;
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
    
    return filtered;
  }, [repos, sortBy, filterLanguage]);

  if (isLoading) {
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
        <span style={{ marginLeft: '15px' }}>Loading repositories...</span>
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
        <h3 style={{ color: 'var(--error-red)', marginBottom: '10px' }}>Failed to load repositories</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              padding: '10px 20px',
              background: 'var(--accent-blue)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px',
        background: 'var(--bg-secondary)',
        borderRadius: '12px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>📦</div>
        <h3>No repositories found</h3>
        <p style={{ color: 'var(--text-secondary)' }}>This user doesn't have any public repositories</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>Sort by:</div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px 12px',
              background: 'var(--bg-card)',
              border: `1px solid var(--border-color)`,
              borderRadius: '8px',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <option value="updated">Latest Updated</option>
            <option value="stars">Most Stars ⭐</option>
            <option value="forks">Most Forks 🍴</option>
          </select>

          <div style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>Filter by language:</div>
          <select
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
            style={{
              padding: '8px 12px',
              background: 'var(--bg-card)',
              border: `1px solid var(--border-color)`,
              borderRadius: '8px',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>
                {lang === 'all' ? 'All Languages' : lang}
              </option>
            ))}
          </select>

          <div style={{ marginLeft: 'auto', color: 'var(--text-secondary)', fontSize: '14px' }}>
            📊 Showing {processedRepos.length} repos
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {processedRepos.map(repo => (
          <RepoCard 
            key={repo.id} 
            repo={repo} 
            onBookmarkChange={onBookmarkChange}
          />
        ))}
      </div>
    </div>
  );
};

export default RepoList;