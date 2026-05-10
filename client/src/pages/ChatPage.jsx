import { useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';
import { ChatContext } from '../context/ChatContext';
import MessageBubble from '../components/Chat/MessageBubble';
import InputArea from '../components/Chat/InputArea';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Navbar from '../components/Layout/Navbar';

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeChat, loadChat, sendingMessage } = useContext(ChatContext);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (id) loadChat(id);
  }, [id]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  if (!activeChat) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex h-[80vh] items-center justify-center px-4">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <div className="sticky top-16 z-10 border-b border-gray-100 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <button onClick={() => navigate('/dashboard')}
            className="rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 text-sm truncate">{activeChat.title}</h2>
          </div>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            {activeChat.subject}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-1 px-4 py-5 sm:py-6">
          {activeChat.messages.length === 0 ? (
            <div className="py-20 text-center sm:py-24">
              <Brain className="mx-auto mb-5 h-10 w-10 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ask Your First Doubt!</h3>
              <p className="mx-auto max-w-xs text-sm text-gray-600">
                Type a question, upload an image, or record your voice. I'm here to help!
              </p>
            </div>
          ) : (
            activeChat.messages.map((msg, i) => (
              <MessageBubble key={msg._id || i} message={msg} />
            ))
          )}

          {sendingMessage && (
            <div className="mt-3 flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 shadow-sm">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="rounded-2xl rounded-bl-sm border border-gray-100 bg-white px-4 py-3 shadow-sm">
                <div className="flex h-5 items-center gap-1.5">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-gray-100 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <InputArea subject={activeChat.subject} />
        </div>
      </div>
    </div>
  );
}