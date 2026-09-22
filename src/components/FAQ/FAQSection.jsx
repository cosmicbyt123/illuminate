import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import FAQ_DATA from '../../data/faq';
import ScrollReveal from '../ui/ScrollReveal';

export const FAQSection = () => {
  // Allow multiple or single open; single open is cleaner on mobile
  const [openId, setOpenId] = useState('faq-1');

  const toggleFAQ = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="relative py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10"
    >
      <ScrollReveal>
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>Questions & Answers</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Frequently Asked <span className="gradient-text-electric">Questions</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-base mt-2 max-w-xl mx-auto">
            Clear answers regarding eligibility, credentials, workshop schedule, and event mechanics.
          </p>
        </div>
      </ScrollReveal>

      {/* Accordion List */}
      <div className="space-y-3.5">
        {FAQ_DATA.map((faq, index) => {
          const isOpen = openId === faq.id;

          return (
            <ScrollReveal key={faq.id} delay={index * 0.06}>
              <div
                className={`glass-panel rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-purple-500/50 bg-[#120a2e]/90 shadow-glow-sm'
                    : 'border-purple-500/20 hover:border-purple-500/40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full min-h-[56px] p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer select-none"
                >
                  <span className="font-bold text-sm sm:text-base text-white pr-2 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`p-1.5 rounded-lg bg-purple-950/60 border border-purple-800/40 text-purple-300 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180 bg-purple-900/60 text-white' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Collapsible Answer */}
                <div
                  id={`faq-answer-${faq.id}`}
                  className={`transition-all duration-300 ease-in-out px-5 sm:px-6 overflow-hidden ${
                    isOpen ? 'pb-5 sm:pb-6 opacity-100 max-h-96' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pt-2 border-t border-purple-900/30 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;
