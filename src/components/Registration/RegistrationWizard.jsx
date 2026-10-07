import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Check,
  Ticket,
  RefreshCw,
  Printer,
  ExternalLink,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Clock,
  PlusCircle,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import EVENT_DATA from '../../data/event';
import Step1Details from './Step1Details';
import Step2Payment from './Step2Payment';
import Step3Proof from './Step3Proof';
import Step4StatusModal from './Step4StatusModal';
import {
  submitRegistration,
  saveStoredTicket,
  getStoredTicket,
  checkTicketVerification,
} from '../../services/registrationService';
import ScrollReveal from '../ui/ScrollReveal';

const STEPS = [
  { step: 1, title: 'Details', fullTitle: '01 Details' },
  { step: 2, title: 'Payment', fullTitle: '02 Payment' },
  { step: 3, title: 'Proof', fullTitle: '03 Proof' },
];

export const RegistrationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [storedTicket, setStoredTicket] = useState(() => getStoredTicket());

  // In-page pass verification check state
  const [isCheckingPass, setIsCheckingPass] = useState(false);
  const [passFeedback, setPassFeedback] = useState('');

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

  // Sync stored ticket on mount & automatically verify in background
  useEffect(() => {
    const current = getStoredTicket();
    if (current) {
      setStoredTicket(current);

      // If still pending, auto-check against Google Sheet in background!
      if (current.status !== 'Verified' && (current.utr || current.ticketId || current.email)) {
        checkTicketVerification({
          utr: current.utr,
          ticketId: current.ticketId,
          email: current.email
        }).then((res) => {
          if (res && res.verified) {
            const updated = {
              ...current,
              status: 'Verified',
              ticketId: res.ticketId || res.data?.ticketId || current.ticketId,
            };
            saveStoredTicket(updated);
            setStoredTicket(updated);
          }
        }).catch((err) => {
          console.debug('Background verification check skipped:', err);
        });
      }
    }
  }, []);

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const updateProofData = (updates) => {
    setProofData((prev) => ({ ...prev, ...updates }));
  };

  const goToStep = (step) => {
    setCurrentStep(step);
    setTimeout(() => {
      const el = document.getElementById('register');
      if (el) {
        const yOffset = -85;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }, 40);
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
      const ticketId = result.data?.ticketId || (proofData.utr ? `REC-ILM-${proofData.utr.slice(-6).toUpperCase()}` : `REC-ILM-${Math.floor(100000 + Math.random() * 900000)}`);

      const ticketPayload = {
        name: leadName,
        teamName: isGroup ? formData.teamName : '',
        registrationType: isGroup ? 'Squad Pass (Fixed 4 Members)' : 'Individual Delegate Pass',
        totalAmount: isGroup ? '₹2,796' : '₹799',
        membersCount: isGroup ? 4 : 1,
        members: isGroup ? formData.members : [{ name: formData.name, email: formData.email, roll: formData.roll, college: formData.college, branch: formData.branch, year: formData.year }],
        roll: isGroup ? (formData.members[0]?.roll || '') : (formData.roll || ''),
        college: isGroup ? (formData.members[0]?.college || '') : (formData.college || ''),
        branch: isGroup ? (formData.members[0]?.branch || '') : (formData.branch || ''),
        year: isGroup ? (formData.members[0]?.year || '') : (formData.year || ''),
        utr: proofData.utr,
        email: primaryEmail,
        ticketId: ticketId,
        isDemo: result.data?.isDemo,
        status: 'Pending Verification',
      };

      setSummaryData(ticketPayload);
      saveStoredTicket(ticketPayload);
      setStoredTicket(ticketPayload);
      setSubmissionStatus('idle');

      // Scroll to ticket pass view
      setTimeout(() => {
        const el = document.getElementById('register');
        if (el) {
          const yOffset = -80;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }
      }, 50);

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

  // Check live verification status for the stored pass
  const handleCheckStoredPass = async () => {
    if (!storedTicket) return;
    setIsCheckingPass(true);
    setPassFeedback('');

    const res = await checkTicketVerification({
      utr: storedTicket.utr,
      ticketId: storedTicket.ticketId,
      email: storedTicket.email
    });
    setIsCheckingPass(false);

    if (res.verified) {
      const updated = {
        ...storedTicket,
        status: 'Verified',
        ticketId: res.ticketId || res.data?.ticketId || storedTicket.ticketId,
      };
      saveStoredTicket(updated);
      setStoredTicket(updated);
      setPassFeedback('🎉 Payment Verified! Your official event ticket and entry QR have been activated!');
    } else {
      setPassFeedback('⏳ Still pending coordinator verification. Check back within 24 hours.');
    }
  };

  const handlePrintPass = () => {
    window.print();
  };

  // Once registered/paid, this browser permanently displays the Pass View
  const showPassView = Boolean(storedTicket);

  const isStoredSquad = storedTicket?.membersCount === 4 ||
    (storedTicket?.members && storedTicket.members.length === 4) ||
    (storedTicket?.registrationType && storedTicket.registrationType.toLowerCase().includes('squad'));

  const ticketReference = storedTicket?.ticketId || (storedTicket?.utr ? `REC-ILM-${storedTicket.utr.slice(-6).toUpperCase()}` : 'REC-ILM-PASS');
  const isVerifiedPass = storedTicket?.status === 'Verified';

  return (
    <section
      id="register"
      className="relative py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10"
    >
      <ScrollReveal>
        {/* ================================================================= */}
        {/* VIEW 1: DIRECT PASS VIEW (Shown when user has registered previously) */}
        {/* ================================================================= */}
        {showPassView ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <Ticket className="w-3.5 h-3.5 text-amber-400" />
                <span>Your Registered Pass</span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Delegate <span className="gradient-text-electric">Pass & Ticket</span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-base mt-2 max-w-xl mx-auto">
                Official registration for ILLUMINATE 2026. Keep this pass accessible on event day.
              </p>
            </div>

            {/* Main Pass Container */}
            <div className={`glass-panel rounded-3xl p-5 sm:p-8 lg:p-10 border-2 ${isVerifiedPass ? 'border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.25)]' : 'border-purple-500/40 shadow-glow-md'} relative overflow-hidden`}>
              
              {/* Partner Logos */}
              <div className="flex items-center justify-center gap-2.5 pb-6 border-b border-purple-900/40">
                <div className="bg-white px-2.5 py-1 rounded-lg border border-purple-200/50 shadow-sm flex items-center justify-center">
                  <img
                    src="/assets/logos/rec-logo.png"
                    alt="Raghu Engineering College"
                    className="h-5 sm:h-6 w-auto object-contain"
                  />
                </div>
                <span className="text-purple-400/80 font-mono text-xs font-bold select-none">×</span>
                <div className="bg-white px-2.5 py-1 rounded-lg border border-purple-200/50 shadow-sm flex items-center justify-center">
                  <img
                    src="/assets/logos/ecell-logo.jpeg"
                    alt="E-Cell IIT Bombay"
                    className="h-5 sm:h-6 w-auto object-contain"
                  />
                </div>
                <span className="text-purple-400/80 font-mono text-xs font-bold select-none">×</span>
                <div className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-200 font-extrabold text-[11px] sm:text-xs tracking-wider">
                  ILLUMINATE
                </div>
              </div>

              {/* Status Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 block font-semibold">
                    Ticket Reference ID
                  </span>
                  <span className="text-lg sm:text-xl font-mono font-extrabold text-white">
                    {ticketReference}
                  </span>
                </div>

                {isVerifiedPass ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-mono uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Verified &bull; Active Pass</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-mono uppercase tracking-wider font-bold">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pending Verification</span>
                  </div>
                )}
              </div>

              {/* Pass Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4 bg-[#0a041a] rounded-2xl p-4 sm:p-5 border border-purple-900/40 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 text-xs block">Pass Category</span>
                  <span className="text-emerald-400 font-bold font-mono">{storedTicket.registrationType || 'Individual Pass'}</span>
                </div>

                {storedTicket.teamName && (
                  <div>
                    <span className="text-slate-400 text-xs block">Squad Name</span>
                    <span className="text-amber-300 font-bold">{storedTicket.teamName}</span>
                  </div>
                )}

                <div>
                  <span className="text-slate-400 text-xs block">{isStoredSquad ? 'Squad Lead (M1)' : 'Delegate Name'}</span>
                  <span className="text-white font-bold">{storedTicket.name}</span>
                </div>

                {storedTicket.roll && (
                  <div>
                    <span className="text-slate-400 text-xs block">Roll Number</span>
                    <span className="text-purple-300 font-mono">{storedTicket.roll}</span>
                  </div>
                )}

                {storedTicket.college && (
                  <div>
                    <span className="text-slate-400 text-xs block">College</span>
                    <span className="text-slate-200">{storedTicket.college}</span>
                  </div>
                )}

                <div>
                  <span className="text-slate-400 text-xs block">Total Fee Paid</span>
                  <span className="text-emerald-400 font-mono font-bold">{storedTicket.totalAmount}</span>
                </div>

                <div>
                  <span className="text-slate-400 text-xs block">UTR / Ref Number</span>
                  <span className="text-purple-300 font-mono">{storedTicket.utr}</span>
                </div>

                <div>
                  <span className="text-slate-400 text-xs block">Date & Venue</span>
                  <span className="text-slate-200 font-medium">Oct 13, 2026 &bull; Raghu Engg College</span>
                </div>
              </div>

              {/* If Squad, show all 4 members */}
              {isStoredSquad && storedTicket.members && storedTicket.members.length === 4 && (
                <div className="mt-4 p-4 rounded-2xl bg-[#090317] border border-purple-900/40 space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold block">
                    Registered Squad Members (4)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {storedTicket.members.map((m, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/30 flex items-center justify-between">
                        <div>
                          <span className="text-purple-400 font-bold block text-[11px]">Member {idx + 1}</span>
                          <span className="text-white font-semibold">{m.name || 'Member'}</span>
                        </div>
                        <span className="font-mono text-purple-300 text-xs">{m.roll || ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dashed Ticket Divider with Punch Notches */}
              <div className="relative my-6 sm:my-8">
                <div className="border-t-2 border-dashed border-purple-800/50" />
                <div className="absolute -left-7 sm:-left-12 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#05020c]" />
                <div className="absolute -right-7 sm:-right-12 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#05020c]" />
              </div>

              {/* Scannable QR Code Section */}
              <div className="relative p-5 sm:p-6 bg-[#070214] rounded-2xl border border-purple-800/50 flex flex-col items-center justify-center text-center">
                {isVerifiedPass ? (
                  /* UNLOCKED ACTIVE QR CODE */
                  <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white rounded-2xl shadow-2xl">
                    <img
                      src={`https://quickchart.io/qr?text=ILLUMINATE-2026-TICKET-${encodeURIComponent(ticketReference)}&size=240&ecLevel=H`}
                      alt="Verified Event Entry QR Code"
                      className="w-40 sm:w-48 h-40 sm:h-48 object-contain"
                    />
                    <span className="text-xs font-mono font-extrabold text-slate-900 mt-2 uppercase tracking-wider">
                      Scan at Entry Desk
                    </span>
                  </div>
                ) : (
                  /* LOCKED QR CODE WITH FROSTED OVERLAY */
                  <div className="relative flex flex-col items-center justify-center">
                    <div className="w-40 sm:w-48 h-40 sm:h-48 bg-white p-3 rounded-2xl opacity-20 filter blur-[2px]">
                      <img
                        src="/assets/payment/qr-code.png"
                        alt="Ticket QR Code Locked"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-black/50 backdrop-blur-[2px] rounded-2xl">
                      <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-500/60 flex items-center justify-center text-amber-400 shadow-glow-sm mb-2 animate-pulse">
                        <Lock className="w-6 h-6" />
                      </div>
                      <h5 className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider font-mono">
                        QR Code Locked
                      </h5>
                      <p className="text-[11px] sm:text-xs text-slate-300 max-w-[260px] mt-1 leading-snug">
                        You will receive your ticket within 24 hours.
                      </p>
                    </div>
                  </div>
                )}

                {/* Status Notice */}
                {isVerifiedPass ? (
                  <div className="mt-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/50 flex items-center justify-center gap-2 text-xs sm:text-sm text-emerald-200 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Ticket Verified! Present this digital pass on event day.</span>
                  </div>
                ) : (
                  <div className="mt-4 p-3 rounded-xl bg-purple-950/50 border border-purple-800/50 flex items-center justify-center gap-2 text-xs sm:text-sm text-purple-200 font-medium">
                    <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>You will receive your ticket within 24 hours.</span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Check Status or Print Pass */}
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                {!isVerifiedPass ? (
                  <button
                    type="button"
                    onClick={handleCheckStoredPass}
                    disabled={isCheckingPass}
                    className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 border border-purple-400/50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 text-emerald-400 ${isCheckingPass ? 'animate-spin' : ''}`} />
                    <span>{isCheckingPass ? 'Refreshing...' : 'Refresh Status'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePrintPass}
                    className="w-full py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Save / Print Ticket Pass</span>
                  </button>
                )}

                {/* WhatsApp Delegates Community Button */}
                <a
                  href="https://chat.whatsapp.com/LtSa3ftDjZT7jmwGwK4nUM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.126.557 4.122 1.533 5.867l-1.633 5.961 6.104-1.602c1.7 1.002 3.689 1.574 5.996 1.574 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>WhatsApp Group</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {passFeedback && (
                <p className="mt-3 text-xs text-center font-medium text-amber-300">
                  {passFeedback}
                </p>
              )}
            </div>
          </div>
        ) : (
          /* ================================================================= */
          /* VIEW 2: REGISTRATION FORM WIZARD (3 Steps)                        */
          /* ================================================================= */
          <div>
            {/* Header */}
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
                    onNext={() => goToStep(2)}
                  />
                )}

                {currentStep === 2 && (
                  <Step2Payment
                    registrationType={formData.registrationType}
                    onNext={() => goToStep(3)}
                    onBack={() => goToStep(1)}
                  />
                )}

                {currentStep === 3 && (
                  <Step3Proof
                    registrationType={formData.registrationType}
                    proofData={proofData}
                    updateProofData={updateProofData}
                    onSubmit={handleFinalSubmit}
                    onBack={() => goToStep(2)}
                    isSubmitting={submissionStatus === 'submitting'}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </ScrollReveal>

      {/* Submission Status Modal (For Submitting spinner and Retry on Error/Timeout) */}
      <Step4StatusModal
        status={submissionStatus}
        errorMessage={errorMessage}
        summaryData={summaryData}
        onRetry={handleFinalSubmit}
        onClose={() => {
          if (submissionStatus === 'success') {
            setIsRegisteringNew(false);
            setSubmissionStatus('idle');
          } else {
            setSubmissionStatus('idle');
          }
        }}
      />
    </section>
  );
};

export default RegistrationWizard;
