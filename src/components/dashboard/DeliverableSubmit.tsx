/**
 * Deliverable Submit Component
 *
 * Form for team members to submit deliverables
 */

'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';

interface DeliverableSubmitProps {
  projectId: string;
  assignmentId: string;
  onSubmitComplete?: () => void;
}

export function DeliverableSubmit({
  projectId,
  assignmentId,
  onSubmitComplete,
}: DeliverableSubmitProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deliverableType: 'PROPOSAL_SECTION',
  });

  const utils = trpc.useUtils();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file');
      return;
    }

    if (!formData.title) {
      setError('Please provide a title');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Upload file
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('projectId', projectId);
      uploadFormData.append('assignmentId', assignmentId);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('deliverableType', formData.deliverableType);

      const response = await fetch('/api/deliverables/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      // Invalidate queries to refresh deliverable list
      await utils.deliverable.list.invalidate({ projectId, assignmentId });

      // Clear form
      setFile(null);
      setFormData({
        title: '',
        description: '',
        deliverableType: 'PROPOSAL_SECTION',
      });
      const fileInput = document.getElementById(
        'deliverable-file-input'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Call completion callback
      if (onSubmitComplete) {
        onSubmitComplete();
      }

      alert('Deliverable submitted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Deliverable Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Technical Volume - Section 1"
          disabled={uploading}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Deliverable Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type
        </label>
        <select
          value={formData.deliverableType}
          onChange={(e) =>
            setFormData({ ...formData, deliverableType: e.target.value })
          }
          disabled={uploading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="PROPOSAL_SECTION">Proposal Section</option>
          <option value="TECHNICAL_VOLUME">Technical Volume</option>
          <option value="MANAGEMENT_VOLUME">Management Volume</option>
          <option value="PAST_PERFORMANCE">Past Performance</option>
          <option value="PRICING">Pricing</option>
          <option value="EXECUTIVE_SUMMARY">Executive Summary</option>
          <option value="COMPLIANCE_MATRIX">Compliance Matrix</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe the deliverable and any important notes..."
          rows={3}
          disabled={uploading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* File Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          File <span className="text-red-500">*</span>
        </label>
        <input
          id="deliverable-file-input"
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
          accept=".pdf,.doc,.docx,.txt"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: PDF, DOC, DOCX, TXT (max 100MB)
        </p>
      </div>

      {/* Selected File Info */}
      {file && (
        <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">📄</span>
              <div>
                <p className="text-sm font-medium text-indigo-900">
                  {file.name}
                </p>
                <p className="text-xs text-indigo-700">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                const fileInput = document.getElementById(
                  'deliverable-file-input'
                ) as HTMLInputElement;
                if (fileInput) fileInput.value = '';
              }}
              disabled={uploading}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!file || !formData.title || uploading}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            Uploading...
          </span>
        ) : (
          'Submit Deliverable'
        )}
      </button>

      {/* Info Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          <span className="font-semibold">Note:</span> Once submitted, your
          deliverable will be automatically scored by AI and sent for review.
          You'll be notified of feedback and approval status.
        </p>
      </div>
    </form>
  );
}
