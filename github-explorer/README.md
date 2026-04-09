# GitHub Explorer 🚀

A complete GitHub user search application built with React.js

## ✨ Features

### Core Features
- 🔍 Search GitHub users with debouncing (400ms)
- 👤 Display user avatar and username
- 📚 View user repositories with name, stars, forks, description
- ⚡ Loading, Error, and Empty states
- 📱 Fully responsive design

### Bonus Features
- 🔄 **Infinite Scroll** - Automatically load more repositories
- ⭐ **Bookmark Repositories** - Save to localStorage
- 👤 **Extra User Details** - Bio, followers, company, location, etc.
- 🌓 **Dark/Light Mode** - Toggle theme
- 🎯 **Sort by Stars & Forks**
- 🔧 **Filter by Language**

## 🛠️ Tech Stack

- React.js 18 (Functional Components)
- React Hooks (useState, useEffect, useCallback, useMemo)
- Custom Hooks (useDebounce, useInfiniteScroll)
- GitHub REST API
- CSS3 with CSS Variables

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/github-explorer.git

# Navigate to project
cd github-explorer

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build