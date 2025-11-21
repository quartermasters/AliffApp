"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MessageCircle,
  Send,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";

interface Message {
  id: string;
  role: "interviewer" | "candidate" | "system";
  content: string;
  timestamp: string;
}

interface InterviewSession {
  id: string;
  candidateName: string;
  jobTitle: string;
  status: string;
  startedAt?: string;
  messages: Message[];
  questionsAsked: string[];
  currentQuestionIndex: number;
}

export default function InterviewChatPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages]);

  // Load session
  useEffect(() => {
    loadSession();
  }, [sessionId]);

  // Auto-focus input
  useEffect(() => {
    if (started && !completed) {
      inputRef.current?.focus();
    }
  }, [started, completed]);

  const loadSession = async () => {
    try {
      const response = await fetch(`/api/recruitment/interview/${sessionId}`);
      if (!response.ok) {
        throw new Error("Session not found");
      }
      const data = await response.json();
      setSession(data.session);
      setStarted(data.session.status !== "SCHEDULED");
      setCompleted(data.session.status === "COMPLETED");
    } catch (err) {
      setError("Interview session not found or has expired.");
    }
  };

  const startInterview = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/recruitment/interview/${sessionId}/start`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      setSession(data.session);
      setStarted(true);
      setLoading(false);
    } catch (err) {
      setError("Failed to start interview. Please try again.");
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading || completed) return;

    const userMessage = message.trim();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `/api/recruitment/interview/${sessionId}/respond`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage }),
        }
      );

      const data = await response.json();
      setSession(data.session);
      setCompleted(data.completed);
      setLoading(false);
    } catch (err) {
      setError("Failed to send message. Please try again.");
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Session Not Found
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/careers")}
            className="bg-navy-900 text-white px-6 py-3 rounded-lg hover:bg-navy-800 transition-colors"
          >
            Back to Careers
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-gold-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Ready for Your Interview?
            </h1>
            <p className="text-lg text-gray-600">
              {session.candidateName} • {session.jobTitle}
            </p>
          </div>

          <div className="bg-navy-50 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gold-600" />
              What to Expect (15 minutes)
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 mr-2 text-victory-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>8-12 questions</strong> about your experience, skills,
                  and work style
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 mr-2 text-victory-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Conversational format</strong> - just chat naturally
                  like you would with a person
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 mr-2 text-victory-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>No trick questions</strong> - be authentic and share
                  your real experiences
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 mr-2 text-victory-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Take your time</strong> - thoughtful answers are better
                  than rushed ones
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-gold-50 border border-gold-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">💡 Pro Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Use specific examples from your experience</li>
              <li>• Explain your thought process and reasoning</li>
              <li>• If a question isn't clear, ask for clarification</li>
              <li>• Be honest about areas where you're still learning</li>
            </ul>
          </div>

          <button
            onClick={startInterview}
            disabled={loading}
            className="w-full bg-navy-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-navy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Starting Interview...
              </>
            ) : (
              <>
                Start Interview
                <Send className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center mr-3">
                <MessageCircle className="w-5 h-5 text-gold-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  ALIFF Interview
                </h2>
                <p className="text-sm text-gray-600">{session.jobTitle}</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              <span>
                {session.questionsAsked.length}/
                {10 /* or config.maxQuestionsAllowed */} questions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-32">
        <div className="space-y-4">
          {session.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "candidate" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === "candidate"
                    ? "bg-navy-900 text-white"
                    : msg.role === "interviewer"
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "bg-gray-100 text-gray-600 text-sm italic"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <div
                  className={`text-xs mt-1 ${
                    msg.role === "candidate"
                      ? "text-gray-300"
                      : "text-gray-500"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      {!completed && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4">
          <div className="max-w-4xl mx-auto px-4">
            <form onSubmit={sendMessage} className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your answer here... (Press Enter to send, Shift+Enter for new line)"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
                  rows={3}
                  disabled={loading || completed}
                />
              </div>
              <button
                type="submit"
                disabled={loading || completed || !message.trim()}
                className="bg-navy-900 text-white p-3 rounded-xl hover:bg-navy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Send className="w-6 h-6" />
                )}
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              Press <strong>Enter</strong> to send, <strong>Shift+Enter</strong>{" "}
              for new line
            </p>
          </div>
        </div>
      )}

      {/* Completed State */}
      {completed && (
        <div className="fixed bottom-0 left-0 right-0 bg-victory-50 border-t-2 border-victory-400 py-6">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <CheckCircle className="w-12 h-12 text-victory-600 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Interview Complete!
            </h3>
            <p className="text-gray-600 mb-4">
              Thank you for your time. Your responses are being evaluated by our
              multi-AI system.
            </p>
            <button
              onClick={() => router.push("/careers")}
              className="bg-navy-900 text-white px-6 py-3 rounded-lg hover:bg-navy-800 transition-colors"
            >
              Back to Careers
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
