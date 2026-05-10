import { Brain, User, Image, Mic, FileText, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';

const InputTypeBadge = ({ type }) => {
  const badges = {
    image: { icon: <Image className="w-3 h-3" />, label: 'Image', cls: 'bg-blue-100 text-blue-700' },
    voice: { icon: <Mic className="w-3 h-3" />, label: 'Voice', cls: 'bg-blue-50 text-blue-700' },
    text: { icon: <FileText className="w-3 h-3" />, label: 'Text', cls: 'bg-blue-100 text-blue-700' },
  };
  const badge = badges[type] || badges.text;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium ${badge.cls}`}>
      {badge.icon} {badge.label}
    </span>
  );
};

// REMOVE the className from ReactMarkdown
// WRAP it in a div instead

const MarkdownRenderer = ({ content }) => (
  <div className="prose prose-sm max-w-none text-gray-700 prose-headings:text-gray-900 prose-p:my-2 prose-a:text-blue-600 prose-strong:text-gray-900">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-800" {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copyContent = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const timestamp = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  if (isUser) {
    return (
      <div className="mb-3 flex justify-end animate-fade-in">
        <div className="flex max-w-[85%] flex-col items-end gap-1 sm:max-w-[80%]">
          {message.imageUrl && (
            <img src={message.imageUrl} alt="Uploaded"
              className="mb-1 max-h-64 w-full max-w-xs rounded-xl border border-gray-200 object-contain shadow-sm" />
          )}
          {message.inputType === 'voice' && (
            <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-500">
              <Mic className="w-3 h-3" />
              <span>Voice message transcribed</span>
            </div>
          )}
          <div className="rounded-2xl rounded-br-sm bg-blue-600 px-4 py-2.5 text-white shadow-sm">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
          <div className="flex items-center gap-2 px-1">
            <InputTypeBadge type={message.inputType} />
            <span className="text-xs text-gray-400">{timestamp}</span>
          </div>
        </div>
        <div className="ml-2 mt-auto flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 shadow-sm">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3 flex items-start gap-2.5 animate-fade-in">
      <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 shadow-sm">
        <Brain className="w-4 h-4 text-white" />
      </div>
      <div className="max-w-[95%] flex-1 sm:max-w-[90%]">
        <div className="group relative rounded-2xl rounded-bl-sm border border-gray-100 bg-white px-4 py-3 shadow-sm transition-shadow duration-200 hover:shadow">
          <button onClick={copyContent}
            className="absolute right-2.5 top-2.5 rounded-lg p-1.5 text-gray-400 opacity-0 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100">
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <MarkdownRenderer content={message.content} />
        </div>
        <span className="text-xs text-gray-400 px-1 mt-1">{timestamp}</span>
      </div>
    </div>
  );
}