'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import keycloak from '../utils/keyclock';

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    } else {
      keycloak.loadUserInfo().then(info => {
        setUserInfo({
          name: info.name || info.preferred_username || 'User',
          email: info.email || '',
        });
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    keycloak.logout({ redirectUri: 'http://localhost:3000' });
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <header style={styles.navbar}>
        <div style={styles.logo}>🚀 MyPlatform</div>
        <div style={styles.profile}>
          <img
            src={`https://ui-avatars.com/api/?name=${userInfo.name}`}
            alt="Avatar"
            style={styles.avatar}
          />
          <span>{userInfo.name}</span>
        </div>
        <button style={styles.menuButton} onClick={() => setIsSidebarOpen(prev => !prev)}>
          ☰
        </button>
      </header>

      {/* Layout */}
      <div style={styles.body}>
        {isSidebarOpen && (
          <aside style={styles.sidebar}>
            <ul style={styles.sidebarList}>
              <li><a href="/dashboard" style={styles.link}>🏠 Home</a></li>
              <li><a href="/createAssessment" style={styles.link}>📝 Create Assessment</a></li>
              <li><a href="/assessment" style={styles.link}>📝 Get Assessment</a></li>
              <li><a href="/video" style={styles.link}>🎥 Video</a></li>
              <li>
                <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Logout</button>
              </li>
            </ul>
          </aside>
        )}

        <main style={styles.mainContent}>
          <h1 style={{ fontSize: '28px' }}>Welcome, {userInfo.name}!</h1>
          <p style={{ fontSize: '16px' }}>This is your dashboard. Use the sidebar to navigate.</p>
        </main>
      </div>
    </div>
  );
}

// CSS-in-JS
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    backgroundColor: '#1e1e2f',
    color: 'white',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '18px',
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
  },
  menuButton: {
    background: 'none',
    color: 'white',
    fontSize: '24px',
    border: 'none',
    cursor: 'pointer',
    display: 'none',
  },
  body: {
    display: 'flex',
    flex: 1,
  },
  sidebar: {
    width: '220px',
    backgroundColor: '#282c34',
    color: 'white',
    padding: '20px',
    minHeight: '100%',
  },
  sidebarList: {
    listStyle: 'none',
    padding: 0,
  },
  link: {
    display: 'block',
    padding: '10px 0',
    color: 'white',
    textDecoration: 'none',
  },
  logoutBtn: {
    marginTop: '20px',
    padding: '8px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  mainContent: {
    flex: 1,
    padding: '30px',
    backgroundColor: '#f4f6f8',
  },
};

// Media query for mobile (basic CSS override via style tags or module.css can be used in real project)
if (typeof window !== 'undefined') {
  const mediaStyles = document.createElement('style');
  mediaStyles.innerHTML = `
    @media (max-width: 768px) {
      header button {
        display: block !important;
      }
      aside {
        position: absolute;
        background-color: #282c34;
        z-index: 5;
        width: 220px;
        height: 100%;
        top: 60px;
        left: 0;
      }
    }
  `;
  document.head.appendChild(mediaStyles);
}
