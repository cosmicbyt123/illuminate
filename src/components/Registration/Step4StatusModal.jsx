import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, RefreshCw, X, Sparkles, Clock, ExternalLink, Lock, ShieldCheck, Users, User, Ticket, Printer } from 'lucide-react';
import Modal from '../ui/Modal';
import { checkTicketVerification, saveStoredTicket, getStoredTicket } from '../../services/registrationService';

/**
 * Real submission status & ticket viewer:
 * States: 'idle' | 'submitting' | 'success' | 'error' | 'timeout'
 * Automatically persists registration in localStorage.
 * When verified, unlocks and displays the active delegate ticket & entry QR code.
 */
export const Step4StatusModal = ({
  status,
  errorMessage,
  summaryData,
  onRetry,
  onClose,
}) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [checkFeedback, setCheckFeedback] = useState('');

  const ticketId = summaryData?.utr
    ? `REC-ILM-${summaryData.utr.slice(-6).toUpperCase()}`
    : `REC-ILM-${Math.floor(100000 + Math.random() * 900000)}`;

  const isSquad = summaryData?.membersCount === 4 || (summaryData?.members && summaryData.members.length === 4);

  // Sync verification status from summaryData or localStorage
  useEffect(() => {
    if (summaryData) {
      const stored = getStoredTicket();
      if (
        summaryData.status === 'Verified' ||
        (stored && stored.utr === summaryData.utr && stored.status === 'Verified')
      ) {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }
    }
  }, [summaryData]);

  const handleCheckVerification = async () => {
    if (!summaryData?.utr) return;
    setIsChecking(true);
    setCheckFeedback('');

    const res = await checkTicketVerification(summaryData.utr);
    setIsChecking(false);

    if (res.verified) {
      setIsVerified(true);
      saveStoredTicket({
        ...summaryData,
        status: 'Verified',
        ticketId: res.ticketId || ticketId,
      });
      setCheckFeedback('🎉 Payment Verified! Your official event ticket has been unlocked!');
    } else {
      setCheckFeedback('⏳ Still pending coordinator verification. Check back within 24 hours.');
    }
  };

  const handlePrintTicket = () => {
    window.print();
  };

  if (status === 'idle') return null;

  return (
    <Modal
      isOpen={status !== 'idle'}
      onClose={status === 'submitting' ? () => {} : onClose}
      maxWidth="max-w-lg"
    >
      <div className="text-center py-2 px-1 sm:px-2">
        {/* State: Submitting */}
        {status === 'submitting' && (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-300 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Submitting Registration...
              </h3>
              <p className="text-xs text-purple-300/80 mt-1.5 max-w-xs mx-auto leading-relaxed">
                Compressing receipt proof & transmitting payload to Google Sheets desk. Please hold on.
              </p>
            </div>
          </div>
        )}

        {/* State: Error or Timeout */}
        {(status === 'error' || status === 'timeout') && (
          <div className="flex flex-col items-center justify-center space-y-5 py-3">
            <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-glow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                Submission Could Not Be Completed
              </h3>
              <p className="text-xs text-rose-300/90 mt-1.5 max-w-xs mx-auto leading-relaxed">
                {errorMessage || 'A network error occurred while communicating with the registration server.'}
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                Your entered details and attached screenshot have been preserved. You do not need to retype anything.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
              <button
                type="button"
                onClick={onRetry}
                className="w-full min-h-[48px] py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Submission</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto min-h-[48px] py-2.5 px-4 rounded-xl border border-purple-500/30 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Close & Review
              </button>
            </div>
          </div>
        )}

        {/* State: Success / Ticket Viewer */}
        {status === 'success' && (
          <div className="flex flex-col items-center justify-center space-y-4 py-1">
            
            {/* Header: Official Account & Partner Logos */}
            <div className="flex items-center justify-center gap-2.5 pt-1">
              <div className="bg-white px-2 py-1 rounded-lg border border-purple-200/50 shadow-sm flex items-center justify-center">
                <img
                  src="/assets/logos/rec-logo.png"
                  alt="Raghu Engineering College"
                  className="h-5 sm:h-6 w-auto object-contain"
                />
              </div>
              <span className="text-purple-400/80 font-mono text-xs font-bold select-none">×</span>
              <div className="bg-white px-2 py-1 rounded-lg border border-purple-200/50 shadow-sm flex items-center justify-center">
                <img
                  src="/assets/logos/ecell-logo.jpeg"
                  alt="E-Cell IIT Bombay"
                  className="h-5 sm:h-6 w-auto object-contain"
                />
              </div>
              <span className="text-purple-400/80 font-mono text-xs font-bold select-none">×</span>
              <div className="px-2 py-0.5 rounded-lg bg-purple-950/70 border border-purple-500/40 text-purple-200 font-extrabold text-[11px] sm:text-xs tracking-wider">
                ILLUMINATE
              </div>
            </div>

            {/* Submission Status Title */}
            <div>
              {isVerified ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-mono uppercase tracking-wider font-bold mb-1 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Payment Verified &bull; Active Pass</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono uppercase tracking-wider font-bold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Registration Saved</span>
                </div>
              )}

              <h3 className="text-xl font-extrabold text-white">
                {isVerified ? 'Official Delegate Ticket' : 'Payment Verification Pending'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 max-w-sm mx-auto">
                {isVerified
                  ? 'Your payment is confirmed! Present the active QR code below at campus entry on Oct 13, 2026.'
                  : 'Your details have been recorded. You will receive your ticket within 24 hours.'}
              </p>
            </div>

            {/* TICKET PASS CARD */}
            <div className={`w-full rounded-2xl bg-gradient-to-b from-[#140b2e] via-[#0d0622] to-[#070214] border-2 ${isVerified ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'border-purple-500/40 shadow-glow-md'} p-4 text-left relative overflow-hidden`}>
              {/* Top Accent Bar */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${isVerified ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500' : 'bg-gradient-to-r from-purple-500 via-amber-400 to-indigo-500'}`} />

              {/* Ticket Top Meta */}
              <div className="flex items-center justify-between border-b border-purple-900/40 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${isVerified ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40' : 'bg-purple-900/50 text-purple-300'}`}>
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 block">
                      Ticket Reference
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-extrabold text-white">
                      {ticketId}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                {isVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold font-mono uppercase">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Active</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-bold font-mono uppercase">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Locked</span>
                  </span>
                )}
              </div>

              {/* Ticket Body: Pass & Delegate Info */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Pass Category:</span>
                  <span className="text-emerald-400 font-bold">{summaryData?.registrationType}</span>
                </div>

                {summaryData?.teamName && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Squad Name:</span>
                    <span className="text-white font-bold truncate max-w-[200px]">{summaryData.teamName}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">{isSquad ? 'Squad Lead:' : 'Delegate Name:'}</span>
                  <span className="text-white font-bold truncate max-w-[200px]">{summaryData?.name}</span>
                </div>

                {/* If squad, show all member names */}
                {isSquad && summaryData?.members && summaryData.members.length === 4 && (
                  <div className="bg-[#0b051c] rounded-xl p-2.5 border border-purple-900/30 my-2 space-y-1">
                    <span className="text-[10px] font-mono text-purple-300 uppercase tracking-wider block font-semibold">
                      Registered Squad Members (4):
                    </span>
                    {summaryData.members.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] text-slate-300">
                        <span className="text-slate-400">M{idx + 1}: {m.name || 'Member'}</span>
                        <span className="font-mono text-purple-300 text-[10px]">{m.roll || ''}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Total Fee:</span>
                  <span className="text-amber-400 font-bold font-mono">{summaryData?.totalAmount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">UTR / Ref:</span>
                  <span className="text-purple-300 font-mono font-semibold">{summaryData?.utr}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Event Date & Venue:</span>
                  <span className="text-slate-200 text-[11px] font-medium text-right">Oct 13, 2026 &bull; REC Vizag</span>
                </div>
              </div>

              {/* DASHED TICKET DIVIDER */}
              <div className="relative my-4">
                <div className="border-t-2 border-dashed border-purple-800/40" />
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#0a051d]" />
                <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#0a051d]" />
              </div>

              {/* TICKET QR CODE SECTION */}
              <div className="relative p-3 bg-[#080315] rounded-xl border border-purple-800/50 flex flex-col items-center justify-center">
                {isVerified ? (
                  /* UNLOCKED ACTIVE QR CODE */
                  <div className="flex flex-col items-center justify-center p-2 bg-white rounded-xl shadow-lg">
                    <img
                      src={`https://quickchart.io/qr?text=ILLUMINATE-2026-TICKET-${encodeURIComponent(ticketId)}&size=240&ecLevel=H`}
                      alt="Verified Event Entry QR Code"
                      className="w-36 h-36 object-contain"
                    />
                    <span className="text-[10px] font-mono font-extrabold text-slate-900 mt-1.5 uppercase tracking-wider">
                      Scan at Entry Desk
                    </span>
                  </div>
                ) : (
                  /* LOCKED QR CODE WITH FROSTED OVERLAY */
                  <>
                    <div className="w-36 h-36 bg-white p-2 rounded-lg opacity-25 filter blur-[1.5px]">
                      <img
                        src="/assets/payment/qr-code.png"
                        alt="Ticket QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-black/40 backdrop-blur-[2px] rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-amber-950/80 border border-amber-500/60 flex items-center justify-center text-amber-400 shadow-glow-sm mb-1.5 animate-pulse">
                        <Lock className="w-5 h-5" />
                      </div>
                      <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                        QR Code Locked
                      </h5>
                      <p className="text-[10px] text-slate-300 max-w-[240px] mt-0.5 leading-snug">
                        You will receive your ticket within 24 hours.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Status Notice / Feedback Banner */}
              {isVerified ? (
                <div className="mt-3.5 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center gap-2 text-xs text-emerald-200 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Ticket Verified! Present this digital pass on event day.</span>
                </div>
              ) : (
                <div className="mt-3.5 p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-center gap-2 text-xs text-purple-200/90 font-medium">
                  <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>You will receive your ticket within 24 hours.</span>
                </div>
              )}
            </div>

            {/* Check Live Verification Button (When Locked) */}
            {!isVerified && (
              <div className="w-full space-y-2">
                <button
                  type="button"
                  onClick={handleCheckVerification}
                  disabled={isChecking}
                  className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 border border-purple-400/40 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 text-emerald-400 ${isChecking ? 'animate-spin' : ''}`} />
                  <span>{isChecking ? 'Refreshing...' : 'Refresh Status'}</span>
                </button>

                {checkFeedback && (
                  <p className="text-[11px] text-amber-300 font-medium text-center">
                    {checkFeedback}
                  </p>
                )}
              </div>
            )}

            {/* Print / Save Ticket Button (When Verified) */}
            {isVerified && (
              <button
                type="button"
                onClick={handlePrintTicket}
                className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Save / Print Ticket Pass</span>
              </button>
            )}

            {/* Official Delegates WhatsApp Group Chat Card */}
            <div className="w-full rounded-2xl bg-gradient-to-br from-[#0c2419] via-[#091c13] to-[#05120c] border border-emerald-500/45 p-3.5 text-left shadow-[0_0_25px_rgba(16,185,129,0.15)]">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300">
                    Official Delegates Group
                  </span>
                </div>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Join Group
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug mb-3">
                Join the official WhatsApp group for live workshop updates, schedule, mentor sessions, and campus entry alerts:
              </p>
              <a
                href="https://chat.whatsapp.com/LtSa3ftDjZT7jmwGwK4nUM"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.126.557 4.122 1.533 5.867l-1.633 5.961 6.104-1.602c1.7 1.002 3.689 1.574 5.996 1.574 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>Join WhatsApp Group</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[44px] py-2 px-6 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 border border-purple-500/30 text-purple-200 hover:text-white font-bold text-xs sm:text-sm transition-all"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default Step4StatusModal;
