import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const GRADES = ['8th', '9th', '10th', '11th', '12th', 'College', 'Other'];
const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'English', 'Computer Science', 'Economics'];

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', grade: 'Other', subjects: [],
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const toggleSubject = (sub) => {
    setForm(p => ({
      ...p,
      subjects: p.subjects.includes(sub)
        ? p.subjects.filter(s => s !== sub)
        : [...p.subjects, sub],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome aboard!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="mb-4 inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-sm transition-transform duration-200 hover:scale-105">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">AI Doubt Solver</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-600">Start solving doubts with AI</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Your name"
              value={form.name} onChange={handleChange} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" required />
            <input type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" required />
            <input type={showPw ? 'text' : 'password'} name="password"
              placeholder="Min. 6 characters" value={form.password}
              onChange={handleChange} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" required />

            <select name="grade" value={form.grade} onChange={handleChange} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Subjects (optional)</label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map(sub => (
                  <button key={sub} type="button" onClick={() => toggleSubject(sub)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 ${
                      form.subjects.includes(sub)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600'
                    }`}>
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-70">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}