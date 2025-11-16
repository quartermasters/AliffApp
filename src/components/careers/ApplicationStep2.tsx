/**
 * Application Step 2: Verify Info + Salary/Availability
 *
 * Features:
 * - Display AI-extracted data (editable)
 * - Salary input (current + expected)
 * - Availability inputs (hours/day, days/month, start date)
 * - Professional links
 * - Real-time validation
 */

'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle, Calendar, Banknote, Clock, Lightbulb } from 'lucide-react';

interface ApplicationStep2Props {
  onNext: (data: Step2Data) => void;
  onBack: () => void;
  initialData?: Partial<Step2Data>;
  parsedData?: ParsedResumeData;
}

export interface Step2Data {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  currentSalary?: number;
  expectedSalary: number;
  salaryType: 'HOURLY' | 'ANNUAL';
  hoursPerDay: number;
  daysPerMonth: number;
  startDate: string;
  employmentStatus: string;
}

interface ParsedResumeData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

export default function ApplicationStep2({
  onNext,
  onBack,
  initialData,
  parsedData,
}: ApplicationStep2Props) {
  const [formData, setFormData] = useState<Step2Data>({
    firstName: parsedData?.firstName || initialData?.firstName || '',
    lastName: parsedData?.lastName || initialData?.lastName || '',
    email: parsedData?.email || initialData?.email || '',
    phone: parsedData?.phone || initialData?.phone || '',
    linkedinUrl: parsedData?.linkedinUrl || initialData?.linkedinUrl || '',
    githubUrl: parsedData?.githubUrl || initialData?.githubUrl || '',
    portfolioUrl: parsedData?.portfolioUrl || initialData?.portfolioUrl || '',
    currentSalary: initialData?.currentSalary,
    expectedSalary: initialData?.expectedSalary || 0,
    salaryType: initialData?.salaryType || 'HOURLY',
    hoursPerDay: initialData?.hoursPerDay || 8,
    daysPerMonth: initialData?.daysPerMonth || 20,
    startDate: initialData?.startDate || '',
    employmentStatus: initialData?.employmentStatus || 'AVAILABLE',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [autoFilled, setAutoFilled] = useState<string[]>([]);

  // Track which fields were auto-filled
  useState(() => {
    const filled: string[] = [];
    if (parsedData?.firstName) filled.push('firstName');
    if (parsedData?.lastName) filled.push('lastName');
    if (parsedData?.email) filled.push('email');
    if (parsedData?.phone) filled.push('phone');
    if (parsedData?.linkedinUrl) filled.push('linkedinUrl');
    setAutoFilled(filled);
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleNumberChange = (
    name: keyof Step2Data,
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) || value === '') {
      setFormData({ ...formData, [name]: value === '' ? 0 : numValue });
      if (errors[name]) {
        setErrors({ ...errors, [name]: '' });
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.expectedSalary || formData.expectedSalary <= 0) {
      newErrors.expectedSalary = 'Expected salary is required';
    }
    if (!formData.hoursPerDay || formData.hoursPerDay < 1 || formData.hoursPerDay > 12) {
      newErrors.hoursPerDay = 'Hours per day must be between 1-12';
    }
    if (!formData.daysPerMonth || formData.daysPerMonth < 1 || formData.daysPerMonth > 30) {
      newErrors.daysPerMonth = 'Days per month must be between 1-30';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
            2
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Verify & Complete Your Profile
          </h2>
        </div>
        <p className="text-gray-600">
          {parsedData
            ? "I've pre-filled information from your resume. Please review and complete the remaining fields."
            : 'Please fill in your information and availability details.'}
        </p>
      </div>

      {/* AI Success Banner */}
      {parsedData && autoFilled.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Great! I found your information
              </h3>
              <p className="text-sm text-gray-700">
                Auto-filled {autoFilled.length} fields from your resume. Please verify everything is correct.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                First Name *
                {autoFilled.includes('firstName') && (
                  <span className="ml-2 text-xs text-green-600">✓ Auto-filled</span>
                )}
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.firstName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Last Name *
                {autoFilled.includes('lastName') && (
                  <span className="ml-2 text-xs text-green-600">✓ Auto-filled</span>
                )}
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.lastName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email Address *
              {autoFilled.includes('email') && (
                <span className="ml-2 text-xs text-green-600">✓ Auto-filled</span>
              )}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Phone Number
              {autoFilled.includes('phone') && (
                <span className="ml-2 text-xs text-green-600">✓ Auto-filled</span>
              )}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        {/* Professional Links */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Professional Links
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                LinkedIn Profile
                {autoFilled.includes('linkedinUrl') && (
                  <span className="ml-2 text-xs text-green-600">✓ Auto-filled</span>
                )}
              </label>
              <input
                type="url"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                GitHub Profile
              </label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://github.com/johndoe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Portfolio / Website
              </label>
              <input
                type="url"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://johndoe.com"
              />
            </div>
          </div>

          <div className="mt-3 bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-gray-700 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span><span className="font-semibold">Tip:</span> Adding your LinkedIn increases your match score!</span>
            </p>
          </div>
        </div>

        {/* Compensation Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Banknote className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">
              Compensation Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Current Salary (Optional)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2 text-gray-500">PKR</span>
                  <input
                    type="number"
                    name="currentSalary"
                    value={formData.currentSalary || ''}
                    onChange={(e) => handleNumberChange('currentSalary', e.target.value)}
                    className="w-full pl-14 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="200"
                  />
                </div>
                <select
                  name="salaryType"
                  value={formData.salaryType}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="HOURLY">/hour</option>
                  <option value="ANNUAL">/year</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Expected Salary *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">PKR</span>
                <input
                  type="number"
                  name="expectedSalary"
                  value={formData.expectedSalary || ''}
                  onChange={(e) => handleNumberChange('expectedSalary', e.target.value)}
                  className={`w-full pl-14 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.expectedSalary ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="250"
                />
              </div>
              {errors.expectedSalary && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.expectedSalary}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Availability</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Hours per Day *
              </label>
              <input
                type="number"
                name="hoursPerDay"
                value={formData.hoursPerDay}
                onChange={(e) => handleNumberChange('hoursPerDay', e.target.value)}
                min="1"
                max="12"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.hoursPerDay ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="8"
              />
              {errors.hoursPerDay && (
                <p className="mt-1 text-xs text-red-600">{errors.hoursPerDay}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Days per Month *
              </label>
              <input
                type="number"
                name="daysPerMonth"
                value={formData.daysPerMonth}
                onChange={(e) => handleNumberChange('daysPerMonth', e.target.value)}
                min="1"
                max="30"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.daysPerMonth ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="20"
              />
              {errors.daysPerMonth && (
                <p className="mt-1 text-xs text-red-600">{errors.daysPerMonth}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.startDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-xs text-red-600">{errors.startDate}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Employment Status
            </label>
            <select
              name="employmentStatus"
              value={formData.employmentStatus}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="AVAILABLE">Available Immediately</option>
              <option value="EMPLOYED">Currently Employed (2-4 weeks notice)</option>
              <option value="STUDENT">Student (Part-time availability)</option>
            </select>
          </div>

          <div className="mt-3 bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-700">
              Based on your inputs: <span className="font-semibold">{formData.hoursPerDay * formData.daysPerMonth} hours/month</span> capacity
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">Application Progress</span>
          <span className="text-gray-600">Step 2 of 3</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '66%' }}></div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleContinue}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          Continue to Step 3
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
