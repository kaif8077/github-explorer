import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import UserList from '../components/UserList';
import RepoList from '../components/RepoList';
import UserDetails from '../components/UserDetails';
import BookmarkList from '../components/BookmarkList';
import { useDebounce } from '../hooks/useDebounce';
import { searchUsers, getUserRepos, getUserDetails } from '../services/githubApi';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const [repos, setRepos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRepos, setTotalRepos] = useState(0);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingRepos, setLoadingRepos] = useState(false);
    const [error, setError] = useState(null);
    const [reposError, setReposError] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [bookmarks, setBookmarks] = useState([]);
    const [showBookmarks, setShowBookmarks] = useState(false);

    const debouncedSearch = useDebounce(searchTerm, 400);
    const REPOS_PER_PAGE = 10;

    // Load bookmarks from localStorage - THIS WILL UPDATE LIVE
    const loadBookmarks = useCallback(() => {
        const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedRepos') || '[]');
        setBookmarks(savedBookmarks);
        console.log('Bookmarks updated:', savedBookmarks.length); // For debugging
    }, []);

    // Initial load of bookmarks
    useEffect(() => {
        loadBookmarks();
    }, [loadBookmarks]);

    // Dark mode toggle
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
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

    // Load user details and repos
    const loadUserData = useCallback(async (user, page = 1) => {
        setLoadingRepos(true);
        setReposError(null);

        try {
            const details = await getUserDetails(user.login);
            setSelectedUserDetails(details);
            setTotalRepos(details.public_repos || 0);
            setTotalPages(Math.ceil((details.public_repos || 0) / REPOS_PER_PAGE));

            const { repos: newRepos } = await getUserRepos(user.login, page, REPOS_PER_PAGE);
            setRepos(newRepos);
            setCurrentPage(page);
        } catch (err) {
            setReposError(err.message);
            setRepos([]);
        } finally {
            setLoadingRepos(false);
        }
    }, []);

    const handleSelectUser = async (user) => {
        setSelectedUser(user);
        setShowBookmarks(false);
        await loadUserData(user, 1);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && selectedUser) {
            loadUserData(selectedUser, page);
        }
    };

    const handleRetryRepos = () => {
        if (selectedUser) {
            loadUserData(selectedUser, currentPage);
        }
    };

    // Handle bookmark removal - WITH LIVE UPDATE
    const handleRemoveBookmark = (bookmarkId) => {
        const newBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
        localStorage.setItem('bookmarkedRepos', JSON.stringify(newBookmarks));
        setBookmarks(newBookmarks); // LIVE UPDATE - state immediately updates

        // Refresh current repos to update star icon
        if (selectedUser) {
            loadUserData(selectedUser, currentPage);
        }
    };

    // Handle bookmark click - open in new tab
    const handleBookmarkClick = (bookmark) => {
        window.open(bookmark.url, '_blank');
    };

    // Handle bookmark change from RepoCard - WITH LIVE UPDATE
    const handleBookmarkChange = () => {
        console.log('Bookmark changed, reloading...'); // For debugging
        loadBookmarks(); // Reload bookmarks immediately

        // Refresh current repos to update star icon
        if (selectedUser) {
            loadUserData(selectedUser, currentPage);
        }
    };

    // Generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const bookmarkedCount = bookmarks.length;

    return (
        <div style={{ minHeight: '100vh' }} className="fade-in">
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
                            {/* Bookmarks Button with LIVE Count */}
                            <button
                                onClick={() => {
                                    setShowBookmarks(!showBookmarks);
                                    setSelectedUser(null);
                                    loadBookmarks(); // Refresh bookmarks when opening
                                }}
                                style={{
                                    padding: '8px 16px',
                                    background: showBookmarks ? 'var(--accent-blue)' : 'var(--bg-card)',
                                    border: `1px solid var(--border-color)`,
                                    borderRadius: '20px',
                                    color: showBookmarks ? 'white' : 'var(--text-primary)',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <span>⭐</span>
                                <span>Bookmarks</span>
                                <span style={{
                                    background: showBookmarks ? 'white' : 'var(--accent-blue)',
                                    color: showBookmarks ? 'var(--accent-blue)' : 'white',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    {bookmarkedCount}
                                </span>
                            </button>

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
                            >
                                {isDarkMode ? '🌙 Dark' : '☀️ Light'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    isLoading={loadingUsers}
                />

                {showBookmarks ? (
                    <div style={{ marginTop: '20px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px',
                            flexWrap: 'wrap',
                            gap: '15px'
                        }}>
                            <h2>⭐ Your Bookmarked Repositories</h2>
                            <button
                                onClick={() => setShowBookmarks(false)}
                                style={{
                                    padding: '8px 16px',
                                    background: 'var(--bg-card)',
                                    border: `1px solid var(--border-color)`,
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer'
                                }}
                            >
                                ← Back to Search
                            </button>
                        </div>
                        <BookmarkList
                            bookmarks={bookmarks}
                            onRemoveBookmark={handleRemoveBookmark}
                            onBookmarkClick={handleBookmarkClick}
                        />
                    </div>
                ) : (
                    <div className="main-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: '350px 1fr',
                        gap: '30px',
                        marginTop: '20px'
                    }}>
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

                        <div>
                            {selectedUser ? (
                                <>
                                    <UserDetails username={selectedUser.login} />

                                    <div style={{
                                        marginBottom: '20px',
                                        padding: '15px 20px',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: '12px',
                                        border: `1px solid var(--border-color)`
                                    }}>
                                        <h2 style={{ marginBottom: '5px', fontSize: '20px' }}>
                                            📚 {selectedUser.login}'s Repositories
                                        </h2>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                            Showing {repos.length} of {totalRepos} public repositories
                                        </p>
                                    </div>

                                    <RepoList
                                        repos={repos}
                                        isLoading={loadingRepos}
                                        error={reposError}
                                        onRetry={handleRetryRepos}
                                        onBookmarkChange={handleBookmarkChange}
                                    />

                                    {totalPages > 0 && !loadingRepos && (
                                        <>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginTop: '30px',
                                                padding: '20px',
                                                flexWrap: 'wrap'
                                            }}>
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    style={{
                                                        padding: '8px 16px',
                                                        background: currentPage === 1 ? 'var(--border-color)' : 'var(--accent-blue)',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        color: 'white',
                                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                                        opacity: currentPage === 1 ? 0.5 : 1,
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    ← Previous
                                                </button>

                                                {getPageNumbers().map(pageNum => (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        style={{
                                                            padding: '8px 16px',
                                                            minWidth: '40px',
                                                            background: currentPage === pageNum ? 'var(--accent-blue)' : 'var(--bg-card)',
                                                            border: `1px solid ${currentPage === pageNum ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                                                            borderRadius: '8px',
                                                            color: currentPage === pageNum ? 'white' : 'var(--text-primary)',
                                                            cursor: 'pointer',
                                                            fontWeight: currentPage === pageNum ? 'bold' : 'normal'
                                                        }}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                ))}

                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    style={{
                                                        padding: '8px 16px',
                                                        background: currentPage === totalPages ? 'var(--border-color)' : 'var(--accent-blue)',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        color: 'white',
                                                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                                        opacity: currentPage === totalPages ? 0.5 : 1,
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    Next →
                                                </button>
                                            </div>

                                            <div style={{
                                                textAlign: 'center',
                                                marginTop: '10px',
                                                marginBottom: '20px',
                                                color: 'var(--text-secondary)',
                                                fontSize: '13px'
                                            }}>
                                                Page {currentPage} of {totalPages}
                                            </div>
                                        </>
                                    )}
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
                                            Click on any user from the left panel to see their GitHub repositories
                                        </p>
                                        {bookmarkedCount > 0 && (
                                            <button
                                                onClick={() => setShowBookmarks(true)}
                                                style={{
                                                    marginTop: '20px',
                                                    padding: '10px 20px',
                                                    background: 'var(--accent-blue)',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    color: 'white',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                View your {bookmarkedCount} bookmarked repos →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            <footer
                style={{
                    marginTop: "60px",
                    padding: "20px 0",
                    borderTop: "1px solid var(--border-color)",
                    textAlign: "center",
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                }}
            >
                <div className="container">
                    <p>
                        GitHub Explorer — built by Mohammad Kaif as part of a React assignment.
                    </p>
                    <p style={{ fontSize: "12px", marginTop: "5px" }}>
                        Search users, explore repositories, and manage bookmarks.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;