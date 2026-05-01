import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../api';
import './Dashboard.css';

const EMPTY_FORM = { name: '', age: '', course: '' };

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStudents = useCallback(async () => {
    try {
      const { data } = await getStudents();
      setStudents(data);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    fetchStudents();
  }, [fetchStudents, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setFormVisible(true);
  };

  const openEdit = (student) => {
    setEditingId(student._id);
    setForm({ name: student.name, age: student.age, course: student.course });
    setFormError('');
    setFormVisible(true);
  };

  const closeForm = () => {
    setFormVisible(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const age = Number(form.age);
    if (!form.name.trim() || !form.course.trim() || !form.age) {
      return setFormError('All fields are required.');
    }
    if (isNaN(age) || age < 1 || age > 100) {
      return setFormError('Age must be a number between 1 and 100.');
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const { data } = await updateStudent(editingId, { ...form, age });
        setStudents((prev) => prev.map((s) => (s._id === editingId ? data : s)));
      } else {
        const { data } = await createStudent({ ...form, age });
        setStudents((prev) => [data, ...prev]);
      }
      closeForm();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="sidebar-brand">
          <span className="brand-hex">⬡</span>
          <span className="brand-label">EduTrack</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item active">
            <span className="nav-icon">⊞</span> Students
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user.name?.[0]?.toUpperCase() || 'U'}</div>
            <div className="user-details">
              <span className="user-name">{user.name || 'User'}</span>
              <span className="user-email">{user.email || ''}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            ⏻
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="dash-main">
        <header className="dash-header">
          <div>
            <h2 className="dash-heading">Students</h2>
            <p className="dash-subheading">
              {students.length} student{students.length !== 1 ? 's' : ''} enrolled
            </p>
          </div>
          <div className="header-actions">
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input
                className="search-input"
                placeholder="Search name or course…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="add-btn" onClick={openAdd}>
              + Add Student
            </button>
          </div>
        </header>

        {loading ? (
          <div className="state-center">
            <div className="loader" />
            <p>Loading students…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="state-center">
            <div className="empty-icon">🎓</div>
            <h3>{searchTerm ? 'No results found' : 'No students yet'}</h3>
            <p>{searchTerm ? 'Try a different search.' : 'Click "Add Student" to get started.'}</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="student-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Course</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s._id} style={{ animationDelay: `${i * 40}ms` }}>
                    <td className="row-num">{i + 1}</td>
                    <td className="student-name">{s.name}</td>
                    <td>{s.age}</td>
                    <td><span className="course-badge">{s.course}</span></td>
                    <td className="date-cell">
                      {new Date(s.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => openEdit(s)}>Edit</button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(s._id)}
                          disabled={deletingId === s._id}
                        >
                          {deletingId === s._id ? '…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal */}
      {formVisible && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeForm()}>
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editingId ? 'Edit Student' : 'Add Student'}</h3>
              <button className="modal-close" onClick={closeForm}>✕</button>
            </div>

            {formError && <div className="form-error">{formError}</div>}

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="field-group">
                <label>Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Alice Johnson"
                  required
                />
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label>Age</label>
                  <input
                    name="age"
                    type="number"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="e.g. 21"
                    min="1"
                    max="100"
                    required
                  />
                </div>
                <div className="field-group">
                  <label>Course</label>
                  <input
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeForm}>Cancel</button>
                <button type="submit" className="btn-save" disabled={submitting}>
                  {submitting ? <span className="spinner-sm" /> : editingId ? 'Save Changes' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}