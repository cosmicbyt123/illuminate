import React, { useState } from 'react';
import { User, Users, Check, ArrowRight, ArrowLeft, Copy, Sparkles, AlertCircle } from 'lucide-react';
import EVENT_DATA from '../../data/event';
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
  const [activeMemberTab, setActiveMemberTab] = useState(0); // 0 to 3 for group members

  const isGroup = formData.registrationType === 'group';

  // Handler for registration type change
  const handleTypeChange = (type) => {
    updateFormData({ registrationType: type });
    setErrors({});
  };

  // Handler for individual fields
  const handleIndividualChange = (field, value) => {
    updateFormData({ [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Handler for squad member fields
  const handleMemberChange = (index, field, value) => {
    const currentMembers = formData.members && formData.members.length === 4
      ? [...formData.members]
      : [
          { name: '', roll: '', college: '', branch: '', year: '', phone: '', email: '' },
          { name: '', roll: '', college: '', branch: '', year: '', phone: '', email: '' },
          { name: '', roll: '', college: '', branch: '', year: '', phone: '', email: '' },
          { name: '', roll: '', college: '', branch: '', year: '', phone: '', email: '' },
        ];

    currentMembers[index] = {
      ...currentMembers[index],
      [field]: value,
    };

    updateFormData({ members: currentMembers });

    if (errors.members && errors.members[index] && errors.members[index][field]) {
      setErrors((prev) => {
        const nextMembersErrors = [...(prev.members || [])];
        if (nextMembersErrors[index]) {
          nextMembersErrors[index] = { ...nextMembersErrors[index], [field]: null };
        }
        return { ...prev, members: nextMembersErrors };
      });
    }
  };

  // Helper to copy lead's college and location to all other members
  const handleCopyLeadInfo = () => {
    const members = formData.members || [];
    const lead = members[0] || {};
    if (!lead.college) return;

    const updated = members.map((m, idx) => {
      if (idx === 0) return m;
      return {
        ...m,
        college: lead.college || m.college,
      };
    });

    updateFormData({ members: updated });
  };

  const handleProceed = (e) => {
    e.preventDefault();
    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);

      if (isGroup && validation.errors.members) {
        // Find first member with error and switch tab to that member
        const firstErrIdx = validation.errors.members.findIndex(
          (mErr) => mErr && Object.keys(mErr).length > 0
        );
        if (firstErrIdx !== -1) {
          setActiveMemberTab(firstErrIdx);
        }
      }
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleProceed} className="space-y-6 text-left">
      {/* Registration Type Selector Segment */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold mb-2">
          Select Registration Pass <span className="text-amber-400">*</span>
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Individual Pass Option */}
          <button
            type="button"
            onClick={() => handleTypeChange('individual')}
            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
              !isGroup
                ? 'bg-purple-900/30 border-purple-400 shadow-glow-sm ring-1 ring-purple-400'
                : 'bg-[#0c0620]/60 border-purple-900/50 hover:border-purple-600/60 hover:bg-[#120a30]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${!isGroup ? 'bg-purple-600 text-white' : 'bg-purple-950 text-purple-300'}`}>
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Individual Pass</h4>
                  <span className="text-[11px] text-slate-400">1 Delegate</span>
                </div>
              </div>
              {!isGroup && (
                <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <div className="mt-2 pt-2 border-t border-purple-800/30 flex items-baseline justify-between">
              <span className="text-xs text-slate-300 font-mono">Standard Fee</span>
              <span className="text-base font-extrabold text-amber-400">
                {EVENT_DATA.pricing.individual.displayPrice}
              </span>
            </div>
          </button>

          {/* Squad Pass Option (Fixed 4 Members) */}
          <button
            type="button"
            onClick={() => handleTypeChange('group')}
            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
              isGroup
                ? 'bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-purple-950/40 border-purple-400 shadow-glow-sm ring-1 ring-purple-400'
                : 'bg-[#0c0620]/60 border-purple-900/50 hover:border-purple-600/60 hover:bg-[#120a30]'
            }`}
          >
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5" />
                Save ₹400
              </span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${isGroup ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'bg-purple-950 text-purple-300'}`}>
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Squad Pass (Fixed 4)</h4>
                  <span className="text-[11px] text-purple-300">₹699 / head • 4 Members</span>
                </div>
              </div>
              {isGroup && (
                <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs mr-20 sm:mr-0">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            <div className="mt-2 pt-2 border-t border-purple-800/30 flex items-baseline justify-between">
              <span className="text-xs text-slate-300 font-mono">Total Squad Fee</span>
              <span className="text-base font-extrabold text-emerald-400">
                {EVENT_DATA.pricing.group.displayPrice}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* INDIVIDUAL REGISTRATION FORM                             */}
      {/* ======================================================== */}
      {!isGroup && (
        <div className="space-y-4 sm:space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold mb-1.5"
            >
              Full Name <span className="text-amber-400">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => handleIndividualChange('name', e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className={`w-full min-h-[48px] bg-[#0d0724] border rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                errors.name
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                  : 'border-purple-500/30 focus:border-purple-400 focus:ring-purple-400'
              }`}
            />
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
                onChange={(e) => handleIndividualChange('roll', e.target.value)}
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
                onChange={(e) => handleIndividualChange('college', e.target.value)}
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
            {/* Branch */}
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
                onChange={(e) => handleIndividualChange('branch', e.target.value)}
                className={`w-full min-h-[48px] bg-[#0d0724] border rounded-xl px-4 py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-1 transition-all ${
                  errors.branch
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-purple-500/30 focus:border-purple-400 focus:ring-purple-400'
                }`}
              >
                <option value="" disabled className="bg-[#0d0724] text-slate-400">
                  Select Branch
                </option>
                {BRANCH_OPTIONS.map((b) => (
                  <option key={b} value={b} className="bg-[#0d0724] text-white">
                    {b}
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
                onChange={(e) => handleIndividualChange('year', e.target.value)}
                className={`w-full min-h-[48px] bg-[#0d0724] border rounded-xl px-4 py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-1 transition-all ${
                  errors.year
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-purple-500/30 focus:border-purple-400 focus:ring-purple-400'
                }`}
              >
                <option value="" disabled className="bg-[#0d0724] text-slate-400">
                  Select Year
                </option>
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y} className="bg-[#0d0724] text-white">
                    {y}
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
              City / Location
            </label>
            <input
              id="location"
              type="text"
              value={formData.location || ''}
              onChange={(e) => handleIndividualChange('location', e.target.value)}
              placeholder="e.g. Visakhapatnam, Vijayawada"
              className="w-full min-h-[48px] bg-[#0d0724] border border-purple-500/30 rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
            />
          </div>

          {/* Mobile & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                onChange={(e) => handleIndividualChange('phone', e.target.value)}
                placeholder="10-digit mobile number"
                className={`w-full min-h-[48px] bg-[#0d0724] border rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                  errors.phone
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-purple-500/30 focus:border-purple-400 focus:ring-purple-400'
                }`}
              />
              {errors.phone && <p className="text-xs text-rose-400 mt-1">{errors.phone}</p>}
            </div>

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
                onChange={(e) => handleIndividualChange('email', e.target.value)}
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
        </div>
      )}

      {/* ======================================================== */}
      {/* SQUAD REGISTRATION FORM (4 FIXED MEMBERS)                */}
      {/* ======================================================== */}
      {isGroup && (
        <div className="space-y-5">
          {/* Optional Team Name */}
          <div className="glass-panel p-4 rounded-2xl border-purple-500/30">
            <label
              htmlFor="teamName"
              className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold mb-1.5"
            >
              Squad / Venture Name (Optional)
            </label>
            <input
              id="teamName"
              type="text"
              value={formData.teamName || ''}
              onChange={(e) => updateFormData({ teamName: e.target.value })}
              placeholder="e.g. NextGen Innovators"
              className="w-full min-h-[44px] bg-[#0d0724] border border-purple-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
            />
          </div>

          {/* Member Navigation Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold">
                Squad Members (4 Required)
              </span>
              {formData.members?.[0]?.college && (
                <button
                  type="button"
                  onClick={handleCopyLeadInfo}
                  className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-white bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700/40 px-2.5 py-1 rounded-lg transition-all"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Lead's College to All</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((idx) => {
                const member = formData.members?.[idx] || {};
                const isTabActive = activeMemberTab === idx;
                const hasError = errors.members?.[idx] && Object.keys(errors.members[idx]).length > 0;
                const isFilled = member.name && member.roll && member.college && member.branch && member.year && member.phone && member.email;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveMemberTab(idx)}
                    className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isTabActive
                        ? 'bg-purple-900/50 border-purple-400 shadow-glow-sm ring-1 ring-purple-400'
                        : hasError
                        ? 'bg-rose-950/30 border-rose-500/60'
                        : isFilled
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-[#0d0724] border-purple-900/50 hover:border-purple-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300">
                        {idx === 0 ? 'Leader' : `Member ${idx + 1}`}
                      </span>
                      {hasError ? (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                      ) : isFilled ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : null}
                    </div>
                    <p className="text-xs font-bold text-white truncate mt-1">
                      {member.name || `Member ${idx + 1}`}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Active Member Form Card */}
          <div className="glass-panel p-4 sm:p-6 rounded-2xl border-purple-500/40 bg-[#0a041f]/70 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-800/40">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-purple-600/60 text-white font-bold flex items-center justify-center text-xs">
                  {activeMemberTab + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {activeMemberTab === 0 ? 'Member 1 — Squad Leader / Point of Contact' : `Member ${activeMemberTab + 1} Details`}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {activeMemberTab === 0 ? 'Primary contact for workshop updates & credentials' : 'Will receive individual accredited certificate'}
                  </p>
                </div>
              </div>
            </div>

            {/* Member Name */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold mb-1">
                Full Name <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.members?.[activeMemberTab]?.name || ''}
                onChange={(e) => handleMemberChange(activeMemberTab, 'name', e.target.value)}
                placeholder="e.g. Ananya Rao"
                className={`w-full min-h-[46px] bg-[#0d0724] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                  errors.members?.[activeMemberTab]?.name
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-purple-500/30 focus:border-purple-400'
                }`}
              />
              {errors.members?.[activeMemberTab]?.name && (
                <p className="text-xs text-rose-400 mt-1">{errors.members[activeMemberTab].name}</p>
              )}
            </div>

            {/* Roll & College in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold mb-1">
                  Roll Number / Reg ID <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.members?.[activeMemberTab]?.roll || ''}
                  onChange={(e) => handleMemberChange(activeMemberTab, 'roll', e.target.value)}
                  placeholder="e.g. 21981A0512"
                  className={`w-full min-h-[46px] bg-[#0d0724] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                    errors.members?.[activeMemberTab]?.roll
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-purple-500/30 focus:border-purple-400'
                  }`}
                />
                {errors.members?.[activeMemberTab]?.roll && (
                  <p className="text-xs text-rose-400 mt-1">{errors.members[activeMemberTab].roll}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold mb-1">
                  College / University <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.members?.[activeMemberTab]?.college || ''}
                  onChange={(e) => handleMemberChange(activeMemberTab, 'college', e.target.value)}
                  placeholder="College Name"
                  className={`w-full min-h-[46px] bg-[#0d0724] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                    errors.members?.[activeMemberTab]?.college
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-purple-500/30 focus:border-purple-400'
                  }`}
                />
                {errors.members?.[activeMemberTab]?.college && (
                  <p className="text-xs text-rose-400 mt-1">{errors.members[activeMemberTab].college}</p>
                )}
              </div>
            </div>

            {/* Branch & Year in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold mb-1">
                  Branch / Department <span className="text-amber-400">*</span>
                </label>
                <select
                  required
                  value={formData.members?.[activeMemberTab]?.branch || ''}
                  onChange={(e) => handleMemberChange(activeMemberTab, 'branch', e.target.value)}
                  className={`w-full min-h-[46px] bg-[#0d0724] border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 transition-all ${
                    errors.members?.[activeMemberTab]?.branch
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-purple-500/30 focus:border-purple-400'
                  }`}
                >
                  <option value="" disabled className="bg-[#0d0724] text-slate-400">
                    Select Branch
                  </option>
                  {BRANCH_OPTIONS.map((b) => (
                    <option key={b} value={b} className="bg-[#0d0724] text-white">
                      {b}
                    </option>
                  ))}
                </select>
                {errors.members?.[activeMemberTab]?.branch && (
                  <p className="text-xs text-rose-400 mt-1">{errors.members[activeMemberTab].branch}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold mb-1">
                  Year of Study <span className="text-amber-400">*</span>
                </label>
                <select
                  required
                  value={formData.members?.[activeMemberTab]?.year || ''}
                  onChange={(e) => handleMemberChange(activeMemberTab, 'year', e.target.value)}
                  className={`w-full min-h-[46px] bg-[#0d0724] border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 transition-all ${
                    errors.members?.[activeMemberTab]?.year
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-purple-500/30 focus:border-purple-400'
                  }`}
                >
                  <option value="" disabled className="bg-[#0d0724] text-slate-400">
                    Select Year
                  </option>
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y} className="bg-[#0d0724] text-white">
                      {y}
                    </option>
                  ))}
                </select>
                {errors.members?.[activeMemberTab]?.year && (
                  <p className="text-xs text-rose-400 mt-1">{errors.members[activeMemberTab].year}</p>
                )}
              </div>
            </div>

            {/* Phone & Email in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold mb-1">
                  Mobile / WhatsApp <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                  value={formData.members?.[activeMemberTab]?.phone || ''}
                  onChange={(e) => handleMemberChange(activeMemberTab, 'phone', e.target.value)}
                  placeholder="10-digit number"
                  className={`w-full min-h-[46px] bg-[#0d0724] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                    errors.members?.[activeMemberTab]?.phone
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-purple-500/30 focus:border-purple-400'
                  }`}
                />
                {errors.members?.[activeMemberTab]?.phone && (
                  <p className="text-xs text-rose-400 mt-1">{errors.members[activeMemberTab].phone}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold mb-1">
                  Email Address <span className="text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  inputMode="email"
                  value={formData.members?.[activeMemberTab]?.email || ''}
                  onChange={(e) => handleMemberChange(activeMemberTab, 'email', e.target.value)}
                  placeholder="name@domain.com"
                  className={`w-full min-h-[46px] bg-[#0d0724] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                    errors.members?.[activeMemberTab]?.email
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-purple-500/30 focus:border-purple-400'
                  }`}
                />
                {errors.members?.[activeMemberTab]?.email && (
                  <p className="text-xs text-rose-400 mt-1">{errors.members[activeMemberTab].email}</p>
                )}
              </div>
            </div>

            {/* Quick Member Prev / Next Controls */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                type="button"
                disabled={activeMemberTab === 0}
                onClick={() => setActiveMemberTab((prev) => Math.max(0, prev - 1))}
                className="text-purple-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Member</span>
              </button>

              <span className="text-[11px] text-slate-400 font-mono">
                Member {activeMemberTab + 1} of 4
              </span>

              <button
                type="button"
                disabled={activeMemberTab === 3}
                onClick={() => setActiveMemberTab((prev) => Math.min(3, prev + 1))}
                className="text-purple-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 font-semibold"
              >
                <span>Next Member</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advance to Step 2 Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full min-h-[52px] py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-glow-sm hover:shadow-glow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <span>
            Continue to Payment ({isGroup ? 'Squad Fee: ₹2,796' : 'Solo Fee: ₹799'})
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

export default Step1Details;
