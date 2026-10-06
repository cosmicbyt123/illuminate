import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import EVENT_DATA from '../../data/event';
import Step1Details from './Step1Details';
import Step2Payment from './Step2Payment';
import Step3Proof from './Step3Proof';
import Step4StatusModal from './Step4StatusModal';
import { submitRegistration } from '../../services/registrationService';
import ScrollReveal from '../ui/ScrollReveal';

const STEPS = [
  { step: 1, title: 'Details', fullTitle: '01 Details' },
  { step: 2, title: 'Payment', fullTitle: '02 Payment' },
  { step: 3, title: 'Proof', fullTitle: '03 Proof' },
];

export const RegistrationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // Persistent Form State (Supports Individual & Fixed 4-member Squad)
  const [formData, setFormData] = useState({
    registrationType: 'individual', // 'individual' | 'group'
    teamName: '',
    // Individual fields:
    name: '',
    roll: '',
    college: '',
    branch: '',
    year: '',
    location: '',
    phone: '',
    email: '',
    // 4-member squad fields:
    members: [
      { name: '', roll: '', college: '', branch: '', year: '', phone: '', email: '' },
      { name: '', roll: '', college: '', branch: '', year: '', phone: '', email: '' },
      { name: '', roll: '', college: '', branch: '', year: '', phone: '', email: '' },
      { name: '', roll: '', college: '', branch: '', year: '', phone: '', email: '' },
    ],
  });

  // Persistent Proof State
  const [proofData, setProofData] = useState({
    utr: '',
    screenshot: null,
  });

  // Submission Status: 'idle' | 'submitting' | 'success' | 'error' | 'timeout'
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [summaryData, setSummaryData] = useState(null);

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const updateProofData = (updates) => {
    setProofData((prev) => ({ ...prev, ...updates }));
  };

  const handleFinalSubmit = async () => {
    setSubmissionStatus('submitting');
    setErrorMessage('');

    const fullPayload = {
      ...formData,
      ...proofData,
    };

    const result = await submitRegistration(fullPayload);

    if (result.success) {
      const isGroup = formData.registrationType === 'group';
      const leadName = isGroup ? (formData.members[0]?.name || 'Squad Lead') : formData.name;
      const primaryEmail = isGroup ? (formData.members[0]?.email || '') : formData.email;

      setSummaryData({
        name: leadName,
        teamName: isGroup ? formData.teamName : '',
        registrationType: isGroup ? 'Squad Pass (4 Members)' : 'Individual Pass',
        totalAmount: isGroup ? '₹2,796' : '₹799',
        membersCount: isGroup ? 4 : 1,
        utr: proofData.utr,
        email: primaryEmail,
        isDemo: result.data?.isDemo,
      });
      setSubmissionStatus('success');
    } else {
      setErrorMessage(result.error);
      setSubmissionStatus(result.code === 'TIMEOUT' ? 'timeout' : 'error');
    }
  };

  const handleReset = () => {
    setFormData({
      registrationType: 'individual',
      teamName: '',
      name: '',
      roll: '',
      college: '',
      branch: '',
      year: '',
      location: '',
      phone: '',
      email: '',
      members: [
        { name: '', roll: '', college: '', branch: '', year: '', phone: '', email: '' },
        { name: '', roll: '', college: '', branch: '', year: '', phone: '', email: '' },
        { name: '', roll: '', college: '', branch: '', year: '', phone: '', email: '' },
        { name: '', roll: '', college: '', branch: '', year: '', phone: '', email: '' },
      ],
    });
    setProofData({
      utr: '',
      screenshot: null,
    });
    setCurrentStep(1);
    setSubmissionStatus('idle');
  };

  return (
    <section
      id="register"
      className="relative py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10"
    >
      <ScrollReveal>
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{EVENT_DATA.offerBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Registration & <span className="gradient-text-electric">Verification</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-base mt-2 max-w-xl mx-auto">
            Reserve your delegate pass ({EVENT_DATA.pricing.individual.displayPrice} Solo • {EVENT_DATA.pricing.group.perHeadDisplay} Squad of 4). Follow the guided 3-step verification below.
          </p>
        </div>

        {/* Main Glassmorphic Wizard Container */}
        <div className="glass-panel rounded-3xl p-5 sm:p-8 lg:p-10 border-purple-500/30 shadow-glow-md relative overflow-hidden">
        {/* Step Progress Bar */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center justify-between relative max-w-md mx-auto">
            {/* Connecting Track */}
            <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-purple-950 -z-0" />
            <div
              className="absolute top-1/2 left-4 -translate-y-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500 -z-0"
              style={{
                width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
                maxWidth: 'calc(100% - 32px)',
              }}
            />

            {STEPS.map((s) => {
              const isCompleted = currentStep > s.step;
              const isCurrent = currentStep === s.step;

              return (
                <div key={s.step} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-sm'
                        : isCurrent
                        ? 'bg-[#150a36] border-2 border-purple-400 text-white shadow-glow-sm'
                        : 'bg-[#0a051c] border border-purple-900/60 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : s.step}
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs font-mono tracking-wider mt-1.5 uppercase ${
                      isCurrent
                        ? 'text-purple-300 font-bold'
                        : isCompleted
                        ? 'text-slate-300'
                        : 'text-slate-600'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content Render */}
        <div className="relative">
          {currentStep === 1 && (
            <Step1Details
              formData={formData}
              updateFormData={updateFormData}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <Step2Payment
              registrationType={formData.registrationType}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <Step3Proof
              registrationType={formData.registrationType}
              proofData={proofData}
              updateProofData={updateProofData}
              onSubmit={handleFinalSubmit}
              onBack={() => setCurrentStep(2)}
              isSubmitting={submissionStatus === 'submitting'}
            />
          )}
        </div>
      </div>
      </ScrollReveal>

      {/* Submission Status Modal */}
      <Step4StatusModal
        status={submissionStatus}
        errorMessage={errorMessage}
        summaryData={summaryData}
        onRetry={handleFinalSubmit}
        onClose={() => {
          if (submissionStatus === 'success') {
            handleReset();
          } else {
            setSubmissionStatus('idle');
          }
        }}
      />
    </section>
  );
};

export default RegistrationWizard;
