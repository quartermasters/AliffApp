/**
 * AI Interview Chat Component
 *
 * Real-time conversational interview with ALIFF (recruiter)
 * - WhatsApp/Slack-style chat interface
 * - Typing indicators
 * - Progress tracking through 7 stages
 * - Auto-scroll to latest message
 * - Mobile-responsive
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Loader, CheckCircle, User, Bot, AlertCircle, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface InterviewChatProps {
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  onComplete: (interviewId: string) => void;
}

const STAGES = [
  { id: 1, name: 'Welcome', key: 'WELCOME' },
  { id: 2, name: 'Availability', key: 'AVAILABILITY' },
  { id: 3, name: 'Skills', key: 'SKILLS' },
  { id: 4, name: 'Remote Work', key: 'REMOTE_WORK' },
  { id: 5, name: 'Compensation', key: 'COMPENSATION' },
  { id: 6, name: 'Motivation', key: 'MOTIVATION' },
  { id: 7, name: 'Closing', key: 'CLOSING' },
];

export default function InterviewChat({
  applicationId,
  candidateName,
  jobTitle,
  onComplete,
}: InterviewChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize interview on mount
  useEffect(() => {
    initializeInterview();
  }, []);

  /**
   * Initialize interview session
   */
  const initializeInterview = async () => {
    try {
      setIsInitializing(true);
      setError(null);

      const response = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          candidateName,
          jobTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start interview');
      }

      const data = await response.json();
      setInterviewId(data.interviewId);

      // Add welcome message from ALIFF
      if (data.welcomeMessage) {
        setMessages([
          {
            role: 'assistant',
            content: data.welcomeMessage,
            timestamp: new Date().toISOString(),
          },
        ]);
        setCurrentStage(1);
      }
    } catch (err) {
      console.error('Failed to initialize interview:', err);
      setError('Failed to start interview. Please refresh the page.');
    } finally {
      setIsInitializing(false);
    }
  };

  /**
   * Send user message and get ALIFF response
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending || !interviewId) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsSending(true);
    setError(null);

    // Add user message to chat immediately
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMessage]);

    try {
      // Show typing indicator
      setIsTyping(true);

      // Send to API
      const response = await fetch('/api/interview/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewId,
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      // Add ALIFF response
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Update stage if changed
      if (data.currentStage) {
        const stageIndex = STAGES.findIndex((s) => s.key === data.currentStage);
        if (stageIndex !== -1) {
          setCurrentStage(stageIndex + 1);
        }
      }

      // Check if interview is complete
      if (data.isComplete) {
        setTimeout(() => {
          onComplete(interviewId);
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsTyping(false);
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  /**
   * Handle Enter key press
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Starting your interview with ALIFF...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {/* ALIFF Info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ALIFF</h1>
                <p className="text-sm text-gray-600">Recruitment Agent</p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="hidden md:flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Stage {currentStage} of {STAGES.length}: {STAGES[currentStage - 1]?.name}
              </span>
            </div>
          </div>

          {/* Mobile Progress Bar */}
          <div className="md:hidden mt-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Stage {currentStage} of {STAGES.length}</span>
              <span>{Math.round((currentStage / STAGES.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStage / STAGES.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3">
          <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-red-800">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-gray-200'
                    : 'bg-gradient-to-br from-blue-600 to-green-600'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-6 h-6 text-gray-600" />
                ) : (
                  <Bot className="w-6 h-6 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-white border border-gray-200 text-gray-900 rounded-tl-sm shadow-sm'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            {/* Input Field */}
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSending || isTyping}
                placeholder="Type your answer..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isSending || isTyping}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSending ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-gray-500 mt-2 text-center">
            This interview typically takes 5-10 minutes. Be honest and clear in your responses.
          </p>
        </div>
      </div>

      {/* Stage Progress (Desktop) - Fixed at bottom */}
      <div className="hidden md:block bg-gray-50 border-t border-gray-200 px-6 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {STAGES.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      index + 1 < currentStage
                        ? 'bg-green-600 text-white'
                        : index + 1 === currentStage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1 < currentStage ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      stage.id
                    )}
                  </div>
                  <span className="text-xs text-gray-600 mt-1 whitespace-nowrap">
                    {stage.name}
                  </span>
                </div>
                {index < STAGES.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-1 ${
                      index + 1 < currentStage ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
