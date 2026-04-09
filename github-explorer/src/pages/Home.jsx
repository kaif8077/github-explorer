import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import UserList from '../components/UserList';
import RepoList from '../components/RepoList';
import UserDetails from '../components/UserDetails';
import { useDebounce } from '../hooks/useDebounce';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { searchUsers, getUserRepos } from '../services/githubApi';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [reposError, setReposError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const debouncedSearch = useDebounce(searchTerm, 400);

  // Dark mode toggle
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  // Search users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!debouncedSearch) {
        setUsers([]);
        return;
      }

      setLoadingUsers(true);
      setError(null);
      
      try {
        const data = await searchUsers(debouncedSearch);
        setUsers(data.items || []);
        if (data.items?.length === 0) {
          setError('No users found');
        }
      } catch (err) {
        setError(err.message);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [debouncedSearch]);

  // Load initial repos when user is selected
  const loadInitialRepos = useCallback(async (user) => {
    setLoadingRepos(true);
    setReposError(null);
    setPage(1);
    setHasMore(true);
    
    try {
      const { repos: newRepos, hasMore: more } = await getUserRepos(user.login, 1, 20);
      setRepos(newRepos);
      setHasMore(more);
      setPage(1);
    } catch (err) {
      setReposError(err.message);
      setRepos([]);
    } finally {
      setLoadingRepos(false);
    }
  }, []);

  // Load more repos for infinite scroll
  const loadMoreRepos = useCallback(async () => {
    if (loadingMore || !hasMore || !selectedUser) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    
    try {
      const { repos: newRepos, hasMore: more } = await getUserRepos(selectedUser.login, nextPage, 20);
      setRepos(prev => [...prev, ...newRepos]);
      setHasMore(more);
      setPage(nextPage);
    } catch (err) {
      console.error('Error loading more repos:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [selectedUser, page, hasMore, loadingMore]);

  const lastRepoRef = useInfiniteScroll(loadMoreRepos, hasMore, loadingMore);

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    await loadInitialRepos(user);
  };

  const handleRetryRepos = () => {
    if (selectedUser) {
      loadInitialRepos(selectedUser);
    }
  };

  // Get bookmarked repos count
  const bookmarkedCount = JSON.parse(localStorage.getItem('bookmarkedRepos') || '[]').length;

  return (
    <div style={{ minHeight: '100vh' }} className="fade-in">
      {/* Header */}
      <header style={{
        background: 'var(--bg-secondary)',
        borderBottom: `1px solid var(--border-color)`,
        padding: '20px 0',
        marginBottom: '30px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div>
              <h1 style={{
                fontSize: '28px',
                background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-green))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '5px'
              }}>
                🚀 GitHub Explorer
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Search GitHub users and explore their repositories
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              {bookmarkedCount > 0 && (
                <div style={{
                  padding: '8px 15px',
                  background: 'var(--bg-card)',
                  borderRadius: '20px',
                  fontSize: '14px',
                  border: `1px solid var(--border-color)`
                }}>
                  ⭐ {bookmarkedCount} Bookmarked
                </div>
              )}
              
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                style={{
                  padding: '10px 20px',
                  background: 'var(--bg-card)',
                  border: `1px solid var(--border-color)`,
                  borderRadius: '10px',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '20px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {isDarkMode ? '🌙 Dark' : '☀️ Light'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          isLoading={loadingUsers}
        />

        <div className="main-grid" style={{
          display: 'grid',
          gridTemplateColumns: '350px 1fr',
          gap: '30px',
          marginTop: '20px'
        }}>
          {/* Left Column - Users */}
          <div>
            <UserList
              users={users}
              onSelectUser={handleSelectUser}
              selectedUser={selectedUser}
              loading={loadingUsers}
              error={error}
              searchTerm={searchTerm}
            />
          </div>

          {/* Right Column - Repositories & Details */}
          <div>
            {selectedUser ? (
              <>
                {/* User Details Section - EXTRA DETAILS BONUS */}
                <UserDetails username={selectedUser.login} />
                
                <div style={{
                  marginBottom: '20px',
                  padding: '15px 20px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  border: `1px solid var(--border-color)`
                }}>
                  <h2 style={{ marginBottom: '5px' }}>
                    📚 {selectedUser.login}'s Repositories
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Total: {repos.length} public repositories {hasMore && '(loading more...)'}
                  </p>
                </div>
                
                <RepoList
                  repos={repos}
                  isLoading={loadingRepos}
                  error={reposError}
                  onRetry={handleRetryRepos}
                  lastElementRef={lastRepoRef}
                  hasMore={hasMore}
                  loadingMore={loadingMore}
                />
              </>
            ) : (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '64px', marginBottom: '20px' }}>👈</div>
                  <h3>Select a user to view repositories</h3>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>
                    Click on any user from the left panel to see their GitHub repositories and details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: '60px',
        padding: '20px 0',
        borderTop: `1px solid var(--border-color)`,
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '14px'
      }}>
        <div className="container">
          <p>Made with ❤️ using React.js & GitHub API | Data provided by GitHub</p>
          <p style={{ fontSize: '12px', marginTop: '5px' }}>
            🔍 Search | ⭐ Bookmark | 🌓 Dark Mode | 📜 Infinite Scroll
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;