// ============================================
// Landing.jsx - Public Marketing Page
// ============================================
// Shown to unauthenticated users at route "/".
// Displays hero, feature cards, CTA, and footer.
// No TODOs — this page is fully provided.
// ============================================

import { Link } from 'react-router-dom';
import { Brain, MessageSquare, Image, Mic, BookOpen, Zap, Shield, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: <MessageSquare className="w-6 h-6 text-blue-500" />,
    title: 'Text Doubts',
    desc: 'Type any question and get instant, detailed explanations from your AI tutor.',
  },
  {
    icon: <Image className="w-6 h-6 text-purple-500" />,
    title: 'Image Doubts',
    desc: 'Upload photos of problems, diagrams, or equations. Vision AI analyzes them instantly.',
  },
  {
    icon: <Mic className="w-6 h-6 text-green-500" />,
    title: 'Voice Doubts',
    desc: 'Record your question and our AI transcribes and answers it in seconds.',
  },
  {
    icon: <BookOpen className="w-6 h-6 text-orange-500" />,
    title: 'All Subjects',
    desc: 'Math, Physics, Chemistry, Biology, History, English, and more — all in one place.',
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: 'Instant Answers',
    desc: 'No waiting. Get step-by-step solutions in seconds powered by Groq LLaMA.',
  },
  {
    icon: <Shield className="w-6 h-6 text-red-500" />,
    title: 'Chat History',
    desc: 'All your doubts are saved. Review previous conversations anytime.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm transition-transform duration-200 hover:scale-105">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900">AI Doubt Solver</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-white hover:text-gray-900 sm:px-4">
            Login
          </Link>
          <Link to="/register" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow md:px-5">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-1.5 text-sm font-medium text-blue-700 shadow-sm">
          <Zap className="w-4 h-4" />
          Powered by Groq LLaMA & AssemblyAI
        </div>
        <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Your Personal AI Tutor <br />
          <span className="text-blue-600">Available 24/7</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-base text-gray-600 sm:text-lg lg:text-xl">
          Ask doubts via text, image, or voice. Get instant step-by-step explanations
          for any subject. Perfect for students from Grade 8 to College.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link to="/register" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow sm:px-8 sm:text-base">
            Start Solving Doubts
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login" className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-blue-200 hover:text-blue-600 hover:shadow sm:px-8 sm:text-base">
            Sign In
          </Link>
        </div>

        {/* Demo preview */}
        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md sm:mt-16 sm:p-5">
          <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="ml-2 text-xs text-gray-400">AI Doubt Solver Chat</span>
          </div>
          <div className="space-y-3 text-left">
            <div className="flex justify-end">
              <div className="max-w-xs rounded-2xl rounded-br-sm bg-blue-600 px-4 py-2 text-sm text-white shadow-sm">
                What is the quadratic formula and how do I use it?
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Brain className="w-4 h-4 text-blue-600" />
              </div>
              <div className="max-w-sm rounded-2xl rounded-bl-sm bg-gray-50 px-4 py-2 text-sm text-gray-600">
                The quadratic formula is: <strong>x = (-b ± √(b²-4ac)) / 2a</strong>
                <br /><br />
                For ax² + bx + c = 0, simply substitute the values of a, b, and c...
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          Everything You Need to Clear Doubts
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-center text-gray-600 sm:mb-12">
          Multiple input methods, all subjects, instant AI-powered answers.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50">
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-14 text-center sm:px-6 sm:py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-blue-600 px-6 py-10 shadow-sm sm:py-12">
          <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">Ready to ace your exams?</h2>
          <p className="mb-6 text-blue-100">Join students already using AI to clear their doubts instantly.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 shadow-sm transition-all duration-200 hover:bg-blue-50 hover:shadow"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-500">
        Built with React, Node.js, MongoDB, Groq LLaMA & AssemblyAI
      </footer>
    </div>
  );
}
