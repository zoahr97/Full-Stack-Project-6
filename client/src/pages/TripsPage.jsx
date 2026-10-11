import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchTrips, createTrip, updateTrip, deleteTrip } from '../api/trips.api';
import '../styles/trips.css';

function tripIcon(dest = '') {
  const d = dest.toLowerCase();
  if (d.includes('paris') || d.includes('france')) return '🗼';
  if (d.includes('japan') || d.includes('tokyo'))  return '⛩️';
  if (d.includes('italy') || d.includes('rome'))   return '🍕';
  if (d.includes('beach') || d.includes('hawaii')) return '🏖️';
  if (d.includes('mountain') || d.includes('alps'))return '🏔️';
  return '✈️';
}

const FILTERS = ['all','planned','ongoing','completed'];

function TripModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial || { title:'', destination:'', start_date:'', end_date:'', status:'planned' }
  );
  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <h3 className="modal-title">{initial ? 'Edit trip' : 'New trip'}</h3>
        <form className="modal-form" onSubmit={e => { e.preventDefault(); onSave(form); }}>
          <input placeholder="Trip title"  value={form.title}       onChange={set('title')}       required />
          <input placeholder="Destination" value={form.destination} onChange={set('destination')} required />
          <input type="date" value={form.start_date} onChange={set('start_date')} />
          <input type="date" value={form.end_date}   onChange={set('end_date')} />
          <select value={form.status} onChange={set('status')}>
            <option value="planned">Planned</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TripsPage() {
  const { session }         = useAuth();
  const userId              = session?.user?.id;
  const [trips, setTrips]   = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [modal, setModal]   = useState(null);

  // טעינה פעם אחת – toggle סטטוס מעדכן state מקומית, לא עושה fetch מחדש
  useEffect(() => {
    setLoading(true);
    fetchTrips(userId)
      .then(setTrips)
      .catch(() => setError('Failed to load trips'))
      .finally(() => setLoading(false));
  }, [userId]);

  const visible = trips
    .filter(t => filter === 'all' || t.status === filter)
    .sort((a,b) => a.id - b.id);

  async function handleCreate(values) {
    try {
      const created = await createTrip(userId, values);
      setTrips(ts => [...ts, created]);
      setModal(null);
    } catch { setError('Could not add trip'); }
  }

  async function handleEdit(values) {
    try {
      const updated = await updateTrip(userId, modal.trip.id, values);
      setTrips(ts => ts.map(t => t.id === updated.id ? updated : t));
      setModal(null);
    } catch { setError('Could not update trip'); }
  }

  // Checkbox של todo: completed = status completed
  async function handleToggleCompleted(trip) {
    const nextStatus = trip.status === 'completed' ? 'planned' : 'completed';
    setTrips(ts => ts.map(t => t.id === trip.id ? { ...t, status: nextStatus } : t));
    try {
      const updated = await updateTrip(userId, trip.id, { status: nextStatus });
      setTrips(ts => ts.map(t => t.id === trip.id ? updated : t));
    } catch {
      setError('Could not update todo status');
      fetchTrips(userId).then(setTrips);
    }
  }

  // עדכון אופטימיסטי – מוחק מהמסך מיד, משחזר אם נכשל
  async function handleDelete(id) {
    if (!window.confirm('Delete this todo?')) return;
    setTrips(ts => ts.filter(t => t.id !== id));
    try {
      await deleteTrip(userId, id);
    } catch {
      setError('Could not delete trip');
      fetchTrips(userId).then(setTrips);
    }
  }

  return (
    <div>
      <div className="trips-header">
        <h2 className="trips-title">
          My Todos (Trips)
          <span className="badge badge-planned" style={{ marginLeft:10 }}>
            {trips.filter(t => t.status === 'planned').length} planned
          </span>
        </h2>
        <div className="trips-filters">
          {FILTERS.map(f => (
            <button key={f} className={`filter-btn${filter===f?' active':''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom:20 }}>
        <button className="btn btn-primary" onClick={() => setModal('create')}>+ New todo</button>
      </div>

      {error   && <div className="error-msg">{error}</div>}
      {loading && <div className="spinner" />}
      {!loading && visible.length === 0 && <div className="empty-state">No todos here yet</div>}

      <div className="trip-list">
        {visible.map(trip => (
          <div key={trip.id} className="trip-card">
            <input
              type="checkbox"
              checked={trip.status === 'completed'}
              onChange={() => handleToggleCompleted(trip)}
              title="Mark todo as completed"
              style={{ marginRight: 10, transform: 'scale(1.2)' }}
            />
            <div className="trip-icon">{tripIcon(trip.destination)}</div>
            <div className="trip-info">
              <div className="trip-title">{trip.title}</div>
              <div className="trip-dest">📍 {trip.destination}</div>
              {(trip.start_date || trip.end_date) && (
                <div className="trip-dates">{trip.start_date}{trip.end_date ? ` → ${trip.end_date}` : ''}</div>
              )}
            </div>
            <div className="trip-actions">
              <span className={`badge badge-${trip.status}`}>{trip.status}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal({ trip })}>✏️</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(trip.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {modal === 'create' && <TripModal onSave={handleCreate} onClose={() => setModal(null)} />}
      {modal?.trip && <TripModal initial={modal.trip} onSave={handleEdit} onClose={() => setModal(null)} />}
    </div>
  );
}
