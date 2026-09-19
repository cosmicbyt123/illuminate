import React from 'react';
import { CheckCircle2, AlertTriangle, RefreshCw, X, Sparkles, Clock, ExternalLink } from 'lucide-react';
import Modal from '../ui/Modal';

/**
 * Real submission status handler:
 * States: 'idle' | 'submitting' | 'success' | 'error' | 'timeout'
 * Displays verification pending notice and official delegates WhatsApp group link.
 */
export const Step4StatusModal = ({
  status,
  errorMessage,
  summaryData,
  onRetry,
  onClose,
}) => {
  if (status === 'idle') return null;

  return (
    <Modal
      isOpen={status !== 'idle'}
      onClose={status === 'submitting' ? () => {} : onClose}
      maxWidth="max-w-md"
    >
      <div className="text-center py-3 px-2">
        {/* State: Submitting */}
        {status === 'submitting' && (
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
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
              <p className="text-xs text-purple-300/80 mt-1 max-w-xs mx-auto leading-relaxed">
                Encrypting payload and transmitting to Google Apps Script coordinator desk. Please hold on.
              </p>
            </div>
          </div>
        )}

        {/* State: Error or Timeout */}
        {(status === 'error' || status === 'timeout') && (
          <div className="flex flex-col items-center justify-center space-y-5 py-2">
            <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-glow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                Submission Could Not Be Completed
              </h3>
              <p className="text-xs text-rose-300/90 mt-1 max-w-xs mx-auto leading-relaxed">
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

        {/* State: Success */}
        {status === 'success' && (
          <div className="flex flex-col items-center justify-center space-y-3.5 py-1">
            {/* Status Badge */}
            <div className="w-13 h-13 sm:w-14 sm:h-14 p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                Submission Received
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1.5">
                Registration Submitted!
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 max-w-sm mx-auto">
                Your delegate details and payment reference have been logged.
              </p>
            </div>

            {/* Payment Verification Notice Banner */}
            <div className="w-full p-3 rounded-xl bg-amber-950/30 border border-amber-500/35 text-left flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 flex-shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-300">
                  Wait for Payment Verification
                </h4>
                <p className="text-[11px] text-amber-200/80 leading-relaxed mt-0.5">
                  Our coordinator team is cross-verifying your 12-digit UTR. You will receive an official confirmation ticket via email soon once verified.
                </p>
              </div>
            </div>

            {/* Verified Summary Box */}
            <div className="w-full bg-[#08031a] rounded-xl p-3 border border-purple-800/40 text-left space-y-1.5 text-xs">
              <div className="flex items-center justify-between border-b border-purple-900/30 pb-1.5">
                <span className="text-slate-400 text-[11px]">Delegate Name:</span>
                <span className="text-white font-bold truncate max-w-[190px]">{summaryData?.name || 'Registered Delegate'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-purple-900/30 pb-1.5">
                <span className="text-slate-400 text-[11px]">UTR / Reference:</span>
                <span className="text-purple-300 font-mono font-semibold">{summaryData?.utr || 'Verified'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Confirmation Sent To:</span>
                <span className="text-slate-200 font-medium truncate max-w-[190px]">{summaryData?.email || 'Your Email'}</span>
              </div>
            </div>

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
