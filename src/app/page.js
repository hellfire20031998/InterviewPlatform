'use client';

import keycloak from './utils/keyclock';

export default function Home() {
  const handleLogin = () => {
    keycloak.login({ redirectUri: 'http://localhost:3000/dashboard' });
  };

  const handleSignUp = () => {
    keycloak.register({ redirectUri: 'http://localhost:3000/dashboard' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎓 Welcome to the Interview Platform</h1>
        <p style={styles.subtitle}>Please log in or sign up to continue</p>
        <div style={styles.buttonGroup}>
          <button onClick={handleLogin} style={{ ...styles.button, backgroundColor: '#0070f3' }}>
            🔐 Login
          </button>
          <button onClick={handleSignUp} style={{ ...styles.button, backgroundColor: '#28a745' }}>
            ✍️ Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e0eafc, #cfdef3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Segoe UI, sans-serif',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '90%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '28px',
    marginBottom: '10px',
    color: '#333',
  },
  subtitle: {
    fontSize: '16px',
    marginBottom: '30px',
    color: '#666',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};
