import { useState, useRef, useContext } from 'react';
import { Send, Image, Mic, X, Loader2, ChevronDown } from 'lucide-react';
import { ChatContext } from '../../context/ChatContext';
import VoiceInput from './VoiceInput';
import toast from 'react-hot-toast';

const SUBJECTS = ['General', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'English', 'Computer Science', 'Economics'];

export default function InputArea({ subject: initialSubject }) {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showVoice, setShowVoice] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(initialSubject || 'General');
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [mode, setMode] = useState('text'); // 'text' | 'image'
  const fileInputRef = useRef();
  const textareaRef = useRef();

  const { sendTextMessage, sendImageMessage, sendVoiceMessage, sendingMessage } = useContext(ChatContext);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setMode('image');
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setMode('text');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendText = async () => {
    const q = text.trim();
    if (!q) return;
    setText('');
    await sendTextMessage(q, selectedSubject);
  };

  const handleSendImage = async () => {
    if (!imageFile) return;
    const q = text.trim();
    const file = imageFile;
    removeImage();
    setText('');
    await sendImageMessage(file, q, selectedSubject);
  };

  const handleVoiceRecorded = async (audioBlob) => {
    setShowVoice(false);
    await sendVoiceMessage(audioBlob, selectedSubject);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (mode === 'image') handleSendImage();
      else handleSendText();
    }
  };

  if (showVoice) {
    return (
      <VoiceInput
        onRecorded={handleVoiceRecorded}
        onCancel={() => setShowVoice(false)}
        disabled={sendingMessage}
      />
    );
  }

  return (
    <div className="space-y-2">
      {imagePreview && (
        <div className="relative inline-block">
          <img src={imagePreview} alt="Preview" className="h-24 rounded-xl border border-gray-200 object-contain shadow-sm" />
          <button onClick={removeImage}
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition-colors duration-200 hover:bg-red-600">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="relative flex-shrink-0">
          <button onClick={() => setShowSubjectPicker(p => !p)}
            className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-medium text-gray-600 transition-all duration-200 hover:border-blue-200 hover:bg-gray-50 hover:text-blue-600">
            {selectedSubject}
            <ChevronDown className="w-3 h-3" />
          </button>
          {showSubjectPicker && (
            <div className="absolute bottom-full left-0 z-20 mb-1 min-w-[160px] rounded-xl border border-gray-100 bg-white py-1 shadow-sm">
              {SUBJECTS.map(s => (
                <button key={s}
                  onClick={() => { setSelectedSubject(s); setShowSubjectPicker(false); }}
                  className={`w-full px-3 py-1.5 text-left text-xs transition-colors duration-150 hover:bg-gray-50 ${selectedSubject === s ? 'font-medium text-blue-600' : 'text-gray-700'}`}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={mode === 'image'
            ? 'Add a question about the image (optional)...'
            : 'Ask your doubt... (Shift+Enter for new line)'}
          rows={1}
          disabled={sendingMessage}
          className="min-h-[44px] max-h-[160px] flex-1 resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-3 text-sm leading-relaxed text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />

        <button onClick={() => fileInputRef.current?.click()} disabled={sendingMessage}
          className={`rounded-lg p-2.5 transition-all duration-200 ${mode === 'image' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600'}`}>
          <Image className="w-5 h-5" />
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />

        <button onClick={() => setShowVoice(true)} disabled={sendingMessage}
          className="rounded-lg p-2.5 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-blue-600">
          <Mic className="w-5 h-5" />
        </button>

        <button onClick={mode === 'image' ? handleSendImage : handleSendText}
          disabled={sendingMessage || (!text.trim() && !imageFile)}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2.5 text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-70">
          {sendingMessage
            ? <Loader2 className="w-5 h-5 animate-spin" />
            : <Send className="w-5 h-5" />}
        </button>
      </div>

      <p className="text-center text-xs text-gray-400">
        AI can make mistakes. Verify important information.
      </p>
    </div>
  );
} 