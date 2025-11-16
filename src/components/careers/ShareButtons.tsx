'use client';

/**
 * Share Buttons Component
 *
 * Client component for job sharing functionality
 * LinkedIn share and copy link to clipboard
 */

export default function ShareButtons({ jobUrl, jobTitle }: { jobUrl: string; jobTitle: string }) {
  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(jobUrl);
      // Could add a toast notification here in the future
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleLinkedInShare}
        className="flex-1 bg-teal-100 text-teal-700 px-4 py-2 rounded-lg hover:bg-teal-200 transition-colors text-sm font-medium"
      >
        LinkedIn
      </button>
      <button
        onClick={handleCopyLink}
        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
      >
        Copy Link
      </button>
    </div>
  );
}
