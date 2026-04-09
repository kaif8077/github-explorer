const API_URL = 'https://api.github.com';

export const searchUsers = async (query) => {
  if (!query.trim()) return { items: [] };
  
  const response = await fetch(`${API_URL}/search/users?q=${encodeURIComponent(query)}&per_page=30`);
  
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    if (response.status === 422) {
      throw new Error('Search query is too short. Please enter at least 3 characters.');
    }
    throw new Error(`Failed to search users. Status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
};

export const getUserRepos = async (username, page = 1, perPage = 10) => {
  const response = await fetch(
    `${API_URL}/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch repositories for ${username}`);
  }
  
  const repos = await response.json();
  
  // Get total count from Link header
  const linkHeader = response.headers.get('Link');
  let hasMore = false;
  
  if (linkHeader) {
    hasMore = linkHeader.includes('rel="next"');
  }
  
  return { repos, hasMore };
};

export const getUserDetails = async (username) => {
  const response = await fetch(`${API_URL}/users/${username}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user details for ${username}`);
  }
  
  return await response.json();
};