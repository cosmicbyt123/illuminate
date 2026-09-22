import React, { useState } from 'react';
import { User, ChevronDown, Sparkles } from 'lucide-react';

export const SpeakerCard = ({ speaker }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="glass-panel glass-panel-interactive rounded-2xl p-5 sm:p-6 border-purple-500/20 text-left flex flex-col justify-between h-full group">
      <div>
        {/* Speaker Avatar / Monogram Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-purple-950 to-indigo-900 border border-purple-500/40 p-1 flex items-center justify-center flex-shrink-0 shadow-glow-sm group-hover:border-purple-400 transition-colors overflow-hidden">
            {speaker.photo && !speaker.photo.includes('placeholder') ? (
              <img
                src={speaker.photo}
                alt={speaker.name}
                className="w-full h-full object-cover rounded-xl"
                loading="lazy"
              />
            ) : (
              <User className="w-7 h-7 text-purple-300" />
            )}
          </div>

          <div>
            <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider font-semibold block">
              {speaker.organization}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-200 transition-colors leading-snug">
              {speaker.name}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {speaker.role}
            </p>
          </div>
        </div>

        {/* Topic Tag */}
        {speaker.topic && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/60 border border-purple-800/40 text-[11px] font-medium text-purple-300 mb-3">
            <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span className="truncate">{speaker.topic}</span>
          </div>
        )}

        {/* Bio (Collapsible on Mobile / Always readable) */}
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p className={`${isExpanded ? '' : 'line-clamp-3 sm:line-clamp-none'}`}>
            {speaker.bio}
          </p>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="sm:hidden text-xs text-purple-400 font-semibold mt-1.5 flex items-center gap-1 focus:outline-none"
          >
            <span>{isExpanded ? 'Show less' : 'Read more'}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-3 border-t border-purple-900/40 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-mono">
          E-Cell Mentor
        </span>
        <span className="text-[11px] text-purple-400 font-medium">
          Keynote Speaker
        </span>
      </div>
    </div>
  );
};

export default SpeakerCard;
