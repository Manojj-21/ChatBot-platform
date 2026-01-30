import { useState } from 'react';
import { auth } from '../services/api';

export default function Login({ onLogin, onToggle }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await auth.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      onLogin(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container} className="fade-in auth-background">
      <form onSubmit={handleSubmit} style={styles.form} className="slide-in">
        <h2 style={styles.title}>🤖 Chatbot Platform</h2>
        <p style={styles.subtitle}>Sign in to continue</p>
        {error && <div style={styles.error} className="fade-in">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? <span className="spinner"></span> : 'Login'}
        </button>
        <p style={styles.footer}>Don't have an account? <a onClick={onToggle} style={styles.link}>Register</a></p>
      </form>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' },
  form: { background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', width: '100%', maxWidth: '400px' },
  title: { textAlign: 'center', marginBottom: '0.5rem', color: '#333', fontSize: '1.8rem' },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: '2rem', fontSize: '0.9rem' },
  input: { width: '100%', padding: '0.875rem', margin: '0.5rem 0', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' },
  button: { width: '100%', padding: '0.875rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', marginTop: '1rem' },
  error: { background: '#fee', color: '#c33', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  footer: { textAlign: 'center', marginTop: '1.5rem', color: '#666', fontSize: '0.9rem' },
  link: { color: '#667eea', cursor: 'pointer', fontWeight: '600' }
};
