import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Plus, BookOpen, BarChart2, Clock, Loader2, Brain, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { chatAPI } from '../services/api';
import Navbar from '../components/Layout/Navbar';

const SUBJECT_COLORS = {
  Mathematics: 'bg-blue-100 text-blue-700',
  Physics: 'bg-blue-50 text-blue-700',
  Chemistry: 'bg-blue-50 text-blue-700',
  Biology: 'bg-blue-50 text-blue-700',
  General: 'bg-gray-100 text-gray-600',
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { chats, loadingChats, loadChats, createChat, deleteChat } = useContext(ChatContext);
  const [stats, setStats] = useState(null);
  const [creatingChat, setCreatingChat] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadChats();
    chatAPI.getStats().then(({ data }) => setStats(data.stats)).catch(() => {});
  }, []);

  const handleNewChat = async () => {
    setCreatingChat(true);
    const chat = await createChat();
    setCreatingChat(false);
    if (chat) navigate(`/chat/${chat._id}`);
  };

  const handleDelete = async (e, chatId) => {
    e.stopPropagation();
    if (window.confirm('Delete this conversation?')) {
      await deleteChat(chatId);
    }
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hello, {user?.name?.split(' ')[0]}!</h1>
            <p className="mt-0.5 text-sm text-gray-600">What would you like to learn today?</p>
          </div>
          <button onClick={handleNewChat} disabled={creatingChat} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-70">
            {creatingChat
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
              : <><Plus className="w-4 h-4" /> New Chat</>}
          </button>
        </div>

        {stats && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalChats}</p>
                <p className="text-sm text-gray-600">Conversations</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDoubts}</p>
                <p className="text-sm text-gray-600">Doubts Solved</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <BarChart2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.keys(stats.subjectBreakdown).length}
                </p>
                <p className="text-sm text-gray-600">Subjects Covered</p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
            <Clock className="w-5 h-5 text-blue-500" />
            Recent Conversations
          </h2>

          {loadingChats ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-16">
              <Brain className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No conversations yet</h3>
              <p className="mb-6 text-sm text-gray-600">Start by asking your first doubt!</p>
              <button onClick={handleNewChat} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow">
                <Plus className="w-4 h-4" /> Start New Chat
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {chats.map(chat => (
                <div key={chat._id} onClick={() => navigate(`/chat/${chat._id}`)}
                  className="group -mx-2 flex cursor-pointer items-center gap-4 rounded-xl px-2 py-3.5 transition-all duration-200 hover:bg-gray-50">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium text-sm text-gray-900 truncate">{chat.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${SUBJECT_COLORS[chat.subject] || SUBJECT_COLORS.General}`}>
                        {chat.subject}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{chat.lastMessage || 'Empty conversation'}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400">{timeAgo(chat.lastActivity)}</span>
                    <button onClick={(e) => handleDelete(e, chat._id)}
                      className="rounded-lg p-1.5 text-gray-400 opacity-0 transition-all duration-200 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}