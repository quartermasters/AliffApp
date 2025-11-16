'use client';

/**
 * Scroll to Chat Button
 *
 * Client component wrapper for button with onClick handler
 * Scrolls page to bottom to reveal AI chat widget
 */

import { MessageCircle } from 'lucide-react';

interface ScrollToChatButtonProps {
  variant?: 'default' | 'compact';
  fullWidth?: boolean;
  subtitle?: string;
}

export default function ScrollToChatButton({
  variant = 'default',
  fullWidth = false,
  subtitle
}: ScrollToChatButtonProps) {
  const handleClick = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const baseClasses = "flex items-center justify-center gap-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors";
  const variantClasses = variant === 'compact'
    ? "px-4 py-2 text-sm"
    : "px-6 py-3 font-semibold shadow-lg hover:shadow-xl";
  const widthClasses = fullWidth ? "w-full" : "inline-flex";

  return (
    <div className={fullWidth ? "w-full" : ""}>
      <button
        onClick={handleClick}
        className={`${baseClasses} ${variantClasses} ${widthClasses}`}
      >
        <MessageCircle className={variant === 'compact' ? "w-4 h-4" : "w-5 h-5"} />
        <span>Chat with AI Recruiter</span>
      </button>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-3 text-center">
          {subtitle}
        </p>
      )}
    </div>
  );
}
