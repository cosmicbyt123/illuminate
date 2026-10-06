import React, { useState } from 'react';
import { QrCode, Copy, Check, ArrowRight, ArrowLeft, Smartphone, ShieldCheck, Users, User, Sparkles } from 'lucide-react';
import EVENT_DATA from '../../data/event';

export const Step2Payment = ({ registrationType = 'individual', onNext, onBack }) => {
  const [copied, setCopied] = useState(false);

  const isGroup = registrationType === 'group';

  // Specific QR code and amount based on registration type
  const qrImage = isGroup
    ? EVENT_DATA.payment.groupQrCodeImage
    : EVENT_DATA.payment.qrCodeImage;

  const amount = isGroup
    ? EVENT_DATA.pricing.group.totalPrice
    : EVENT_DATA.pricing.individual.price;

  const displayPrice = isGroup
    ? EVENT_DATA.pricing.group.displayPrice
    : EVENT_DATA.pricing.individual.displayPrice;

  const passLabel = isGroup
    ? 'Squad Pass (Fixed 4 Members)'
    : 'Individual Delegate Pass';

  const handleCopyUpi = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(EVENT_DATA.payment.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Direct UPI App Deep Link for Mobile (PhonePe/GPay/Paytm) with exact amount pre-filled!
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(
    EVENT_DATA.payment.upiId
  )}&pn=${encodeURIComponent(EVENT_DATA.payment.payeeName)}&am=${amount}&cu=INR`;

  return (
    <div className="space-y-6 text-center">
      {/* Price Summary Banner */}
      <div className="glass-panel p-4 rounded-2xl border-purple-500/30 flex items-center justify-between">
        <div className="text-left">
          <div className="flex items-center gap-1.5 text-xs text-purple-300 font-mono uppercase tracking-wider">
            {isGroup ? <Users className="w-3.5 h-3.5 text-emerald-400" /> : <User className="w-3.5 h-3.5" />}
            <span>{passLabel}</span>
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl sm:text-2xl font-extrabold text-amber-400">
              {displayPrice}
            </span>
            {isGroup && (
              <span className="text-xs text-emerald-400 font-medium">
                (₹699 per head)
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          {isGroup ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Squad Pass Verified</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Solo Pass Verified</span>
            </span>
          )}
        </div>
      </div>

      {/* High-Contrast Verified QR Code Frame */}
      <div className="relative p-3.5 bg-white rounded-2xl border-4 border-purple-600/60 shadow-xl max-w-[240px] sm:max-w-[260px] mx-auto">
        <img
          src={qrImage}
          alt={`Illuminate Registration UPI Payment QR - ${passLabel}`}
          className="w-full h-auto object-contain rounded-lg aspect-square"
        />
        <div className="mt-2 text-center text-slate-900 font-bold text-[10px] uppercase tracking-wider">
          Scan to Pay {displayPrice} via Any UPI App
        </div>
        {isGroup && (
          <div className="text-[9px] font-semibold text-purple-700 uppercase tracking-tight">
            Covers All 4 Squad Members
          </div>
        )}
      </div>

      {/* Copy UPI ID Box */}
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between bg-[#0b061d] border border-purple-500/30 rounded-xl p-2.5 sm:p-3">
          <div className="text-left px-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block">
              Official UPI ID
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-white select-all">
              {EVENT_DATA.payment.upiId}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyUpi}
            className="px-3 py-2 rounded-lg bg-purple-900/60 hover:bg-purple-800/70 text-purple-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[40px]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Direct 1-Click Pay on Mobile */}
      <div className="max-w-md mx-auto">
        <a
          href={upiDeepLink}
          className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#140b33] border border-purple-500/40 hover:bg-[#1d1047] text-purple-200 hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <Smartphone className="w-4 h-4 text-purple-400" />
          <span>Open Supported UPI App Directly ({displayPrice})</span>
        </a>
      </div>

      {/* Supported UPI Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-400">
        <span className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-800/40 text-[11px]">PhonePe</span>
        <span className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-800/40 text-[11px]">Google Pay</span>
        <span className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-800/40 text-[11px]">Paytm</span>
        <span className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-800/40 text-[11px]">BHIM UPI</span>
      </div>

      {/* Instruction Note */}
      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
        {isGroup
          ? 'Make a single payment of ₹2,796 for your 4 squad members. Take a screenshot of the receipt and note the 12-digit UPI UTR number.'
          : 'After completing payment of ₹799 in your UPI app, take a screenshot of the receipt and note the 12-digit UPI Ref / UTR number.'}
      </p>

      {/* Navigation Actions */}
      <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 max-w-md mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto min-h-[48px] px-5 py-2.5 rounded-xl border border-purple-500/30 hover:bg-purple-900/30 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Details</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-glow-sm transition-all"
        >
          <span>I've Paid — Upload Proof (Step 3)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Step2Payment;
