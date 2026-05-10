import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, X, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VoiceInput({ onRecorded, onCancel, disabled }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'recording' | 'stopped'
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const stopStream = () => {
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopStream();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
      ].find(type => MediaRecorder.isTypeSupported(type));
      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setStatus('stopped');
        stopStream();
      };

      mediaRecorder.start(250);
      setStatus('recording');
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(d => {
          if (d >= 120) { stopRecording(); return d; } // Max 2 minutes
          return d + 1;
        });
      }, 1000);
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        toast.error('Microphone access denied. Please allow microphone permissions.');
      } else {
        toast.error(err.message || 'Could not access microphone.');
      }
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleSend = () => {
    if (audioBlob) onRecorded(audioBlob);
  };

  const handleDiscard = () => {
    stopRecording();
    setAudioBlob(null);
    setAudioUrl(null);
    setStatus('idle');
    setDuration(0);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium text-sm text-gray-700">Voice Input</h3>
        <button onClick={onCancel} className="rounded-lg p-1 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      {status === 'idle' && (
        <div className="text-center py-4">
          <p className="mb-4 text-sm text-gray-600">Press the button and speak your doubt clearly</p>
          <button onClick={startRecording}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-blue-700">
            <Mic className="w-7 h-7" />
          </button>
          <p className="text-xs text-gray-400 mt-3">Max 2 minutes</p>
        </div>
      )}

      {status === 'recording' && (
        <div className="text-center py-4">
          <div className="mb-2 flex items-center justify-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600"></div>
            <span className="text-sm font-medium text-blue-600">Recording...</span>
          </div>
          <p className="mb-4 text-3xl font-mono font-bold text-gray-900">{formatTime(duration)}</p>
          <button onClick={stopRecording}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-white shadow-sm transition-all duration-200 hover:scale-105">
            <Square className="w-5 h-5" />
          </button>
          <p className="text-xs text-gray-400 mt-2">Tap to stop</p>
        </div>
      )}

      {status === 'stopped' && (
        <div className="py-2">
          <p className="mb-3 text-center text-sm text-gray-600">Recording complete ({formatTime(duration)})</p>
          {audioUrl && <audio controls src={audioUrl} className="mb-4 w-full rounded-lg border border-gray-200 bg-white" />}
          <div className="flex gap-2">
            <button onClick={handleDiscard} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50">
              <X className="w-4 h-4" /> Discard
            </button>
            <button onClick={handleSend} disabled={disabled} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-70">
              {disabled
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                : <><Send className="w-4 h-4" /> Send</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
