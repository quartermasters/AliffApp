"use client";

import { useState } from "react";

/**
 * Chatbot Widget - Priority 6
 * This is a placeholder/stub for future chatbot integration
 *
 * Integration options:
 * 1. Intercom - For full-featured live chat + bot
 * 2. Drift - For sales-focused conversational marketing
 * 3. Custom AI chatbot - Built on OpenAI API
 * 4. Tidio, Crisp, or other platforms
 *
 * Current implementation: Simple contact form trigger
 * TODO: Replace with actual chatbot when ready
 */

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition-all hover:scale-110 flex items-center justify-center z-50"
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* Chat Window Placeholder */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white rounded-lg shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-teal-600 text-white p-4 rounded-t-lg">
            <h3 className="font-bold text-lg">Chat with Aliff Services</h3>
            <p className="text-sm text-teal-100">We typically respond within 24 hours</p>
          </div>

          {/* Content */}
          <div className="flex-grow p-6 overflow-y-auto">
            <div className="space-y-4">
              {/* Welcome Message */}
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-gray-900 mb-3">
                  👋 Welcome! How can we help you today?
                </p>
                <div className="space-y-2">
                  <a
                    href="/services/govcon/proposal-development"
                    className="block p-3 bg-white hover:bg-teal-50 rounded border border-gray-200 hover:border-teal-300 transition-colors"
                  >
                    <div className="font-semibold text-teal-900">Federal Proposals</div>
                    <div className="text-sm text-gray-600">GOVCON RFP response services</div>
                  </a>
                  <a
                    href="/for-agencies"
                    className="block p-3 bg-white hover:bg-teal-50 rounded border border-gray-200 hover:border-teal-300 transition-colors"
                  >
                    <div className="font-semibold text-teal-900">Agency Partnerships</div>
                    <div className="text-sm text-gray-600">White-label delivery for agencies</div>
                  </a>
                  <a
                    href="/services/it/full-stack-development"
                    className="block p-3 bg-white hover:bg-teal-50 rounded border border-gray-200 hover:border-teal-300 transition-colors"
                  >
                    <div className="font-semibold text-teal-900">IT Development</div>
                    <div className="text-sm text-gray-600">Architecture-first software</div>
                  </a>
                  <a
                    href="/contact"
                    className="block p-3 bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors text-center font-semibold"
                  >
                    Schedule Consultation
                  </a>
                </div>
              </div>

              {/* Info Note */}
              <div className="text-xs text-gray-500 text-center">
                This is a quick navigation widget. For detailed inquiries, please use our{" "}
                <a href="/contact" className="text-teal-600 hover:underline">
                  contact form
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
