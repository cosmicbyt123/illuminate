import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { validatePaymentProof } from '../../services/registrationService';

export const Step3Proof = ({
  registrationType = 'individual',
  proofData,
  updateProofData,
  onSubmit,
  onBack,
  isSubmitting,
}) => {
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const isGroup = registrationType === 'group';

  const handleUtrChange = (e) => {
    updateProofData({ utr: e.target.value });
    if (errors.utr) {
      setErrors((prev) => ({ ...prev, utr: null }));
    }
  };

  const handleFileChange = (file) => {
    if (!file) return;

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        screenshot: 'File size exceeds 5 MB. Please upload a smaller screenshot.',
      }));
      return;
    }

    // Check type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        screenshot: 'Invalid format. Accepted types: PNG, JPG, JPEG.',
      }));
      return;
    }

    updateProofData({ screenshot: file });
    setErrors((prev) => ({ ...prev, screenshot: null }));

    // Generate local preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleRemoveFile = () => {
    updateProofData({ screenshot: null });
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validatePaymentProof(proofData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {/* Tier Confirmation Banner */}
      <div className="glass-panel p-3.5 rounded-xl border-purple-500/30 bg-[#0c0620]/60 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 block">
            Payment Verification For
          </span>
          <span className="text-xs sm:text-sm font-bold text-white">
            {isGroup ? 'Squad Pass (Fixed 4 Members)' : 'Individual Delegate Pass'}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs sm:text-sm font-extrabold text-amber-400 font-mono">
            {isGroup ? '₹2,796' : '₹799'}
          </span>
        </div>
      </div>
      {/* 12-Digit UTR Field */}
      <div>
        <label
          htmlFor="utr"
          className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold mb-1.5"
        >
          UPI Ref / UTR / Transaction ID (12 Digits) <span className="text-amber-400">*</span>
        </label>
        <input
          id="utr"
          type="text"
          required
          value={proofData.utr || ''}
          onChange={handleUtrChange}
          placeholder="e.g. 423987123456"
          className={`w-full min-h-[48px] bg-[#0d0724] border rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 font-mono tracking-wider focus:outline-none focus:ring-1 transition-all ${
            errors.utr
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
              : 'border-purple-500/30 focus:border-purple-400 focus:ring-purple-400'
          }`}
        />
        {errors.utr && (
          <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.utr}</span>
          </p>
        )}
        <p className="text-[11px] text-slate-400 mt-1">
          Found in your UPI payment receipt details (Google Pay, PhonePe, Paytm, or BHIM).
        </p>
      </div>

      {/* Payment Proof File Upload (Touch-Friendly Dropzone) */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold mb-1.5">
          Attach Payment Screenshot <span className="text-amber-400">*</span>
        </label>

        <input
          ref={fileInputRef}
          id="screenshot"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileChange(e.target.files[0]);
            }
          }}
        />

        {!proofData.screenshot ? (
          /* Empty Upload Dropzone */
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
            }}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] ${
              isDragging
                ? 'border-purple-400 bg-purple-900/30 scale-[1.01]'
                : errors.screenshot
                ? 'border-rose-500/80 bg-rose-950/10'
                : 'border-purple-500/40 bg-[#0c0620]/60 hover:bg-[#130a30]/80 hover:border-purple-400/80'
            }`}
          >
            <div className="p-3 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300 mb-3 shadow-glow-sm">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white">
              {isDragging ? 'Drop payment screenshot here' : 'Tap to browse or drop payment screenshot'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports PNG, JPG or JPEG • Maximum file size: 5 MB
            </p>
          </div>
        ) : (
          /* File Attached / Preview Card */
          <div className="glass-panel p-4 rounded-2xl border-emerald-500/40 bg-emerald-950/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Receipt Preview"
                  className="w-14 h-14 object-cover rounded-xl border border-emerald-500/40 flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-purple-950 flex items-center justify-center text-purple-300 flex-shrink-0">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <p className="text-xs sm:text-sm font-semibold text-white truncate">
                    {proofData.screenshot.name}
                  </p>
                </div>
                <p className="text-[11px] text-emerald-300/80 font-mono mt-0.5">
                  {(proofData.screenshot.size / 1024).toFixed(1)} KB • Screenshot Attached
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveFile}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center flex-shrink-0"
              aria-label="Remove screenshot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {errors.screenshot && (
          <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.screenshot}</span>
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="pt-3 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full sm:w-auto min-h-[48px] px-5 py-2.5 rounded-xl border border-purple-500/30 hover:bg-purple-900/30 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to QR</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto min-h-[52px] px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-glow-md active:scale-[0.99] disabled:opacity-60 transition-all"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>Verifying & Submitting...</span>
            </span>
          ) : (
            <>
              <span>Complete Registration</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default Step3Proof;
