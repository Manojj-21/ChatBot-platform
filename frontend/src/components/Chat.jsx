import { useState, useEffect, useRef } from 'react';
import { chat, prompts } from '../services/api';

export default function Chat({ project, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [promptList, setPromptList] = useState([]);
  const [newPrompt, setNewPrompt] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadHistory();
    loadPrompts();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const { data } = await chat.getHistory(project.id);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load history', err);
    }
  };

  const loadPrompts = async () => {
    try {
      const { data } = await prompts.getByProject(project.id);
      setPromptList(data);
    } catch (err) {
      console.error('Failed to load prompts', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages([...messages, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await chat.send({ projectId: project.id, message: input });
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const addPrompt = async (e) => {
    e.preventDefault();
    try {
      await prompts.create({ projectId: project.id, content: newPrompt });
      setNewPrompt('');
      loadPrompts();
    } catch (err) {
      alert('Failed to add prompt');
    }
  };

  return (
    <div style={styles.container} className="dashboard-background">
      <div style={styles.header} className="navbar-black">
        <button onClick={onBack} style={styles.backBtn}>← Back</button>
        <h2>{project.name}</h2>
        <button onClick={() => setShowPrompts(!showPrompts)} style={styles.promptBtn}>
          System Prompts ({promptList.length})
        </button>
      </div>

      {showPrompts && (
        <div style={styles.promptPanel}>
          <h3>System Prompts</h3>
          {promptList.map(p => (
            <div key={p.id} style={styles.promptItem}>{p.content}</div>
          ))}
          <form onSubmit={addPrompt} style={styles.promptForm}>
            <input
              type="text"
              placeholder="Add system prompt..."
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              style={styles.promptInput}
            />
            <button type="submit" style={styles.addBtn}>Add</button>
          </form>
        </div>
      )}

      <div style={styles.chatArea}>
        {messages.map((msg, idx) => (
          <div key={idx} style={msg.role === 'user' ? styles.userMsg : styles.assistantMsg}>
            <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong>
            <p>{msg.content}</p>
          </div>
        ))}
        {loading && <div style={styles.loading}>Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} style={styles.inputForm}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
          disabled={loading}
        />
        <button type="submit" style={styles.sendBtn} disabled={loading}>Send</button>
      </form>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh' },
  header: { padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' },
  backBtn: { padding: '0.5rem 1rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  promptBtn: { padding: '0.5rem 1rem', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  promptPanel: { background: 'white', padding: '1rem', borderBottom: '1px solid #ddd' },
  promptItem: { background: '#f8f9fa', padding: '0.5rem', margin: '0.5rem 0', borderRadius: '4px', fontSize: '0.9rem' },
  promptForm: { display: 'flex', gap: '0.5rem', marginTop: '1rem' },
  promptInput: { flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' },
  addBtn: { padding: '0.5rem 1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  chatArea: { flex: 1, overflowY: 'auto', padding: '1rem' },
  userMsg: { background: '#007bff', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', marginLeft: 'auto', maxWidth: '70%' },
  assistantMsg: { background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', maxWidth: '70%' },
  loading: { textAlign: 'center', color: '#6c757d', fontStyle: 'italic' },
  inputForm: { display: 'flex', gap: '0.5rem', padding: '1rem', background: 'white', borderTop: '1px solid #ddd' },
  input: { flex: 1, padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' },
  sendBtn: { padding: '0.75rem 1.5rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }
};
