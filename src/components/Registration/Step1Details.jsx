import React, { useState } from 'react';
import { User, IdCard, Building2, BookOpen, Calendar, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { validateRegistrationForm } from '../../services/registrationService';

const BRANCH_OPTIONS = [
  'CSE (Computer Science & Engineering)',
  'CSD (Computer Science & Data Science)',
  'CSM (Computer Science & AI/ML)',
  'CSC (Computer Science & Cyber Security)',
  'ECE (Electronics & Communication Engineering)',
  'EEE (Electrical & Electronics Engineering)',
  'Mech (Mechanical Engineering)',
  'Civil (Civil Engineering)',
  'Other',
];

const YEAR_OPTIONS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
];

export const Step1Details = ({ formData, updateFormData, onNext }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleProceed = (e) => {
    e.preventDefault();
    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      // Focus first error element
      const firstErrorField = Object.keys(validation.errors)[0];
      const el = document.getElementById(firstErrorField);
      if (el) el.focus();
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleProceed} className="space-y-4 sm:space-y-5 text-left">
      {/* Full Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold mb-1.5"
        >
          Full Name <span className="text-amber-400">*</span>
        </label>
        <div className="relative">
          <input
            id="name"
            type="text"
            required
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className={`w-full min-h-[48px] bg-[#0d0724] border rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
              errors.name
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                : 'border-purple-500/30 focus:border-purple-400 focus:ring-purple-400'
            }`}
          />
        </div>
        {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
      </div>

      {/* Roll Number & College in 2-col Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Roll Number */}
        <div>
          <label
            htmlFor="roll"
            className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold mb-1.5"
          >
            Roll Number / Reg ID <span className="text-amber-400">*</span>
          </label>
          <input
            id="roll"
            type="text"
            required
            value={formData.roll || ''}
            onChange={(e) => handleChange('roll', e.target.value)}
            placeholder="e.g. 21981A05XX"
            className={`w-full min-h-[48px] bg-[#0d0724] border rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
              errors.roll
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                : 'border-purple-500/30 focus:border-purple-400 focus:ring-purple-400'
            }`}
          />
          {errors.roll && <p className="text-xs text-rose-400 mt-1">{errors.roll}</p>}
        </div>

        {/* College Name */}
        <div>
          <label
            htmlFor="college"
            className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold mb-1.5"
          >
            College / University <span className="text-amber-400">*</span>
          </label>
          <input
            id="college"
            type="text"
            required
            value={formData.college || ''}
            onChange={(e) => handleChange('college', e.target.value)}
            placeholder="College Name"
            className={`w-full min-h-[48px] bg-[#0d0724] border rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
              errors.college
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                : 'border-purple-500/30 focus:border-purple-400 focus:ring-purple-400'
            }`}
          />
          {errors.college && <p className="text-xs text-rose-400 mt-1">{errors.college}</p>}
        </div>
      </div>

      {/* Branch & Year in 2-col Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Branch / Department */}
        <div>
          <label
            htmlFor="branch"
            className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold mb-1.5"
          >
            Branch / Department <span className="text-amber-400">*</span>
          </label>
          <select
            id="branch"
            required
            value={formData.branch || ''}
            onChange={(e) => handleChange('branch', e.target.value)}
            className={`w-full min-h-[48px] bg-[#0d0724] border rounded-xl px-4 py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-1 transition-all ${
              errors.branch
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                : 'border-purple-500/30 focus:border-purple-400 focus:ring-purple-400'
            }`}
          >
            <option value="" disabled className="bg-[#0d0724] text-slate-400">
              Select Branch
            </option>
            {BRANCH_OPTIONS.map((branch) => (
              <option key={branch} value={branch} className="bg-[#0d0724] text-white">
                {branch}
              </option>
            ))}
          </select>
          {errors.branch && <p className="text-xs text-rose-400 mt-1">{errors.branch}</p>}
        </div>

        {/* Year of Study */}
        <div>
          <label
            htmlFor="year"
            className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold mb-1.5"
          >
            Year of Study <span className="text-amber-400">*</span>
          </label>
          <select
            id="year"
            required
            value={formData.year || ''}
            onChange={(e) => handleChange('year', e.target.value)}
            className={`w-full min-h-[48px] bg-[#0d0724] border rounded-xl px-4 py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-1 transition-all ${
              errors.year
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                : 'border-purple-500/30 focus:border-purple-400 focus:ring-purple-400'
            }`}
          >
            <option value="" disabled className="bg-[#0d0724] text-slate-400">
              Select Year
            </option>
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year} className="bg-[#0d0724] text-white">
                {year}
              </option>
            ))}
          </select>
          {errors.year && <p className="text-xs text-rose-400 mt-1">{errors.year}</p>}
        </div>
      </div>

      {/* Location */}
      <div>
        <label
          htmlFor="location"
          className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold mb-1.5"
        >
          Your Location / City
        </label>
        <input
          id="location"
          type="text"
          value={formData.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Where are you coming from?"
          className="w-full min-h-[48px] bg-[#0d0724] border border-purple-500/30 rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
        />
      </div>

      {/* Contact: Mobile & Email in 2-col Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Mobile Number */}
        <div>
          <label
            htmlFor="phone"
            className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold mb-1.5"
          >
            Mobile / WhatsApp Number <span className="text-amber-400">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            required
            pattern="[0-9]{10}"
            inputMode="numeric"
            value={formData.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="10-digit mobile number"
            className={`w-full min-h-[48px] bg-[#0d0724] border rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
              errors.phone
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                : 'border-purple-500/30 focus:border-purple-400 focus:ring-purple-400'
            }`}
          />
          {errors.phone && <p className="text-xs text-rose-400 mt-1">{errors.phone}</p>}
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold mb-1.5"
          >
            Email Address <span className="text-amber-400">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            inputMode="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="name@college.edu / domain.com"
            className={`w-full min-h-[48px] bg-[#0d0724] border rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
              errors.email
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                : 'border-purple-500/30 focus:border-purple-400 focus:ring-purple-400'
            }`}
          />
          {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* Advance to Step 2 Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full min-h-[52px] py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-glow-sm hover:shadow-glow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <span>Continue to Payment (Step 2)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

export default Step1Details;
