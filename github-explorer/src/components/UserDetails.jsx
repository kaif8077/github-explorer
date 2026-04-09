import React, { useState, useEffect } from 'react';
import { getUserDetails } from '../services/githubApi';

const UserDetails = ({ username }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!username) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getUserDetails(username);
        setUserDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [username]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
        background: 'var(--bg-card)',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <div className="loader-small" />
        <span style={{ marginLeft: '10px' }}>Loading details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        background: 'var(--bg-card)',
        borderRadius: '10px',
        marginBottom: '20px',
        textAlign: 'center',
        color: 'var(--error-red)'
      }}>
        Failed to load user details
      </div>
    );
  }

  if (!userDetails) return null;

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '20px',
      border: `1px solid var(--border-color)`
    }}>
      <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>👤</span> User Details
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px'
      }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Name</div>
          <div style={{ fontWeight: 'bold' }}>{userDetails.name || 'Not specified'}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Company</div>
          <div>{userDetails.company || 'Not specified'}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Location</div>
          <div>{userDetails.location || 'Not specified'}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Blog/Website</div>
          <div>
            {userDetails.blog ? (
              <a href={userDetails.blog} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)' }}>
                {userDetails.blog.length > 30 ? userDetails.blog.substring(0, 30) + '...' : userDetails.blog}
              </a>
            ) : 'Not specified'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Followers</div>
          <div>👥 {userDetails.followers?.toLocaleString()}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Following</div>
          <div>📝 {userDetails.following?.toLocaleString()}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Public Repos</div>
          <div>📚 {userDetails.public_repos?.toLocaleString()}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Joined</div>
          <div>{new Date(userDetails.created_at).toLocaleDateString()}</div>
        </div>
      </div>
      {userDetails.bio && (
        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: `1px solid var(--border-color)` }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '5px' }}>Bio</div>
          <div>{userDetails.bio}</div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;