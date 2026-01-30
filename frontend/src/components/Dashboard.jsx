import { useState, useEffect } from 'react';
import { projects } from '../services/api';
import Chat from './Chat';

export default function Dashboard({ user, onLogout }) {
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data } = await projects.getAll();
      setProjectList(data);
    } catch (err) {
      console.error('Failed to load projects', err);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    try {
      await projects.create(newProject);
      setNewProject({ name: '', description: '' });
      setShowNewProject(false);
      loadProjects();
    } catch (err) {
      alert('Failed to create project');
    }
  };

  if (selectedProject) {
    return <Chat project={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  return (
    <div style={styles.container} className="fade-in dashboard-background">
      <div style={styles.header} className="navbar-black">
        <h1 style={styles.logo}>🤖 Chatbot Platform</h1>
        <div>
          <span style={styles.userName}>👤 {user.name}</span>
          <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.toolbar}>
          <h2 style={styles.title}>📁 My Projects</h2>
          <button onClick={() => setShowNewProject(!showNewProject)} style={styles.newBtn}>
            ✨ New Project
          </button>
        </div>

        {showNewProject && (
          <form onSubmit={createProject} style={styles.form} className="slide-in">
            <input
              type="text"
              placeholder="Project Name"
              value={newProject.name}
              onChange={(e) => setNewProject({...newProject, name: e.target.value})}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newProject.description}
              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              style={styles.input}
            />
            <button type="submit" style={styles.createBtn}>Create Project</button>
          </form>
        )}

        <div style={styles.projectGrid}>
          {projectList.map((project, idx) => (
            <div key={project.id} style={styles.projectCard} className="card fade-in" onClick={() => setSelectedProject(project)}>
              <div style={styles.cardIcon}>💬</div>
              <h3 style={styles.cardTitle}>{project.name}</h3>
              <p style={styles.cardDesc}>{project.description || 'No description'}</p>
              <div style={styles.cardFooter}>Click to open →</div>
            </div>
          ))}
          {projectList.length === 0 && (
            <div style={styles.emptyState} className="fade-in">
              <div style={styles.emptyIcon}>🚀</div>
              <p>No projects yet. Create your first chatbot!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh' },
  header: { padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' },
  logo: { fontSize: '1.5rem', fontWeight: '700', color: '#fff', margin: 0 },
  userName: { marginRight: '1rem', fontWeight: '600', color: '#fff', fontSize: '0.95rem' },
  logoutBtn: { padding: '0.6rem 1.2rem', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600' },
  content: { padding: '2.5rem', maxWidth: '1200px', margin: '0 auto' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title: { color: 'white', fontSize: '1.8rem', margin: 0 },
  newBtn: { padding: '0.75rem 1.5rem', background: 'white', color: '#667eea', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '1rem' },
  form: { background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  input: { width: '100%', padding: '0.875rem', margin: '0.5rem 0', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' },
  createBtn: { padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', marginTop: '0.5rem' },
  projectGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' },
  projectCard: { background: 'white', padding: '2rem', borderRadius: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  cardIcon: { fontSize: '2.5rem', marginBottom: '1rem' },
  cardTitle: { fontSize: '1.3rem', fontWeight: '700', color: '#333', marginBottom: '0.5rem' },
  cardDesc: { color: '#666', fontSize: '0.95rem', marginBottom: '1rem', minHeight: '40px' },
  cardFooter: { color: '#667eea', fontSize: '0.9rem', fontWeight: '600' },
  emptyState: { gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.9)', borderRadius: '16px', color: '#666' },
  emptyIcon: { fontSize: '4rem', marginBottom: '1rem' }
};
