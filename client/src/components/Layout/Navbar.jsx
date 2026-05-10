import { Link, useNavigate } from 'react-router-dom';
import { Brain, LogOut, User, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useState, useContext } from 'react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-20 border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm transition-transform duration-200 hover:scale-105">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900 hidden sm:block">AI Doubt Solver</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link to="/dashboard"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900">
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:block">Dashboard</span>
          </Link>

          <div className="relative">
            <button onClick={() => setShowMenu(p => !p)}
              className="flex items-center gap-2 rounded-lg py-1.5 pl-2 pr-3 transition-all duration-200 hover:bg-gray-100">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.name?.split(' ')[0]}
              </span>
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-gray-100 bg-white py-1 shadow-sm">
                  <div className="border-b border-gray-100 px-3 py-2">
                    <p className="font-medium text-sm text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <button onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition-colors duration-200 hover:bg-red-50">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}