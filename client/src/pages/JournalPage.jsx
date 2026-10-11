import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchEntries, createEntry, updateEntry, deleteEntry } from '../api/journal.api';
import { fetchMemories, createMemory, deleteMemory } from '../api/memories.api';
import '../styles/journal.css';

// Modal כללי לטפסים
function Modal({ title, fields, onSave, onClose }) {
  const [values, setValues] = useState(
    fields.reduce((acc, f) => ({ ...acc, [f.name]: f.default || '' }), {})
  );
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <h3 className="modal-title">{title}</h3>
        <form className="modal-form" onSubmit={e => { e.preventDefault(); onSave(values); }}>
          {fields.map(f =>
            f.type === 'textarea'
              ? <textarea key={f.name} placeholder={f.label} value={values[f.name]} rows={4} required={f.required}
                  onChange={e => setValues(v => ({ ...v, [f.name]: e.target.value }))} />
              : <input key={f.name} type={f.type||'text'} placeholder={f.label} value={values[f.name]} required={f.required}
                  onChange={e => setValues(v => ({ ...v, [f.name]: e.target.value }))} />
          )}
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Memories של רשומה אחת – נטענות רק כשהאזור נפתח, מונע fetch כפול
function MemoriesSection({ entry, userName, userEmail }) {
  const [memories, setMemories] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [showAdd, setShowAdd]   = useState(false);

  useEffect(() => {
    fetchMemories(entry.id)
      .then(setMemories)
      .finally(() => setLoading(false));
  }, [entry.id]);

  async function handleAdd(values) {
    const created = await createMemory(entry.id, {
      name: values.name || userName, email: values.email || userEmail, body: values.body
    });
    setMemories(ms => [...(ms||[]), created]);
    setShowAdd(false);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete memory?')) return;
    await deleteMemory(entry.id, id);
    setMemories(ms => ms.filter(m => m.id !== id));
  }

  return (
    <div className="memories-section">
      <div className="memories-header">
        <span className="memories-title">Memories {memories ? `(${memories.length})` : ''}</span>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowAdd(true)}>+ Add memory</button>
      </div>

      {loading && <div className="spinner" style={{ width:24, height:24, margin:'8px auto', borderWidth:2 }} />}

      {(memories||[]).map(m => (
        <div key={m.id} className="memory-item">
          <span className="memory-meta">{m.name}</span>
          <span className="memory-email">{m.email}</span>
          <div className="memory-body">{m.body}</div>
          <div className="memory-actions">
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id)}>🗑️</button>
          </div>
        </div>
      ))}

      {showAdd && (
        <Modal title="Add memory"
          fields={[
            { name:'name',  label:'Your name',  default:userName,  required:true },
            { name:'email', label:'Your email', default:userEmail, type:'email', required:true },
            { name:'body',  label:'Memory…',    type:'textarea',   required:true },
          ]}
          onSave={handleAdd} onClose={() => setShowAdd(false)} />
      )}
    </div>
  );
}

export default function JournalPage() {
  const { session }             = useAuth();
  const userId                  = session?.user?.id;
  const userName                = session?.user?.name;
  const userEmail               = session?.user?.email;
  const [entries, setEntries]   = useState([]);
  const [expanded, setExpanded] = useState(new Set());
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [modal, setModal]       = useState(null);

  // טעינת רשומות פעם אחת – memories נטענות בנפרד כשנפתחות
  useEffect(() => {
    setLoading(true);
    fetchEntries(userId)
      .then(setEntries)
      .catch(() => setError('Failed to load journal'))
      .finally(() => setLoading(false));
  }, [userId]);

  function toggleMemories(id) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleCreate(values) {
    try {
      const created = await createEntry(userId, values);
      setEntries(es => [...es, created]);
      setModal(null);
    } catch { setError('Could not add entry'); }
  }

  async function handleEdit(values) {
    try {
      const updated = await updateEntry(userId, modal.entry.id, values);
      setEntries(es => es.map(e => e.id === updated.id ? updated : e));
      setModal(null);
    } catch { setError('Could not update entry'); }
  }

  // השרת מוחק memories לפני הרשומה (מוסבר ב-journal.controller.js)
  async function handleDelete(id) {
    if (!window.confirm('Delete this entry and all its memories?')) return;
    setEntries(es => es.filter(e => e.id !== id));
    try {
      await deleteEntry(userId, id);
    } catch {
      setError('Could not delete entry');
      fetchEntries(userId).then(setEntries);
    }
  }

  return (
    <div>
      <div className="journal-header">
        <h2 className="journal-title">My Journal</h2>
        <button className="btn btn-primary" onClick={() => setModal('create')}>+ New entry</button>
      </div>

      {error   && <div className="error-msg">{error}</div>}
      {loading && <div className="spinner" />}
      {!loading && entries.length === 0 && <div className="empty-state">No journal entries yet ✍️</div>}

      <div className="entry-list">
        {[...entries].sort((a,b) => a.id-b.id).map(entry => (
          <div key={entry.id} className="entry-card">
            <div className="entry-card-header">
              <div>
                <div className="entry-card-title" onClick={() => toggleMemories(entry.id)}>
                  {entry.title}
                </div>
                {entry.location && <div className="entry-location">📍 {entry.location}</div>}
              </div>
              <span className="entry-card-id">#{entry.id}</span>
            </div>
            <p className="entry-card-body">{entry.body}</p>
            <div className="entry-card-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => toggleMemories(entry.id)}>
                {expanded.has(entry.id) ? '▲ Hide memories' : '▼ Show memories'}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal({ entry })}>✏️ Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(entry.id)}>🗑️ Delete</button>
            </div>

            {expanded.has(entry.id) && (
              <MemoriesSection entry={entry} userName={userName} userEmail={userEmail} />
            )}
          </div>
        ))}
      </div>

      {modal === 'create' && (
        <Modal title="New journal entry"
          fields={[
            { name:'title',    label:'Title',    required:true },
            { name:'location', label:'Location (optional)' },
            { name:'body',     label:'Write about your experience…', type:'textarea', required:true },
          ]}
          onSave={handleCreate} onClose={() => setModal(null)} />
      )}

      {modal?.entry && (
        <Modal title="Edit entry"
          fields={[
            { name:'title',    label:'Title',    default:modal.entry.title,       required:true },
            { name:'location', label:'Location', default:modal.entry.location||'' },
            { name:'body',     label:'Body…',    default:modal.entry.body,        type:'textarea', required:true },
          ]}
          onSave={handleEdit} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
