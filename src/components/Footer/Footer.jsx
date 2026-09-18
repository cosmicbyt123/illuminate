import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import SITE_DATA from '../../data/site';
import CONTACT_DATA from '../../data/contact';
import Modal from '../ui/Modal';

export const Footer = () => {
  const [legalModal, setLegalModal] = useState(null); // 'terms' | 'privacy' | 'conduct' | null

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <footer className="relative bg-[#05020c] border-t border-purple-900/40 text-slate-400 text-xs pt-8 pb-8 sm:pt-12 sm:pb-10 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-8 border-b border-purple-900/30">
            {/* Col 1: Brand & Institution Info (5 cols) */}
            <div className="md:col-span-5 space-y-4 text-left">
              <div className="flex items-center gap-3">
                <a
                  href="https://raghuenggcollege.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/95 px-2.5 py-1 rounded-lg border border-purple-300/40 hover:shadow-glow-sm transition-all inline-block"
                  title="Raghu Engineering College"
                >
                  <img
                    src="/assets/logos/rec-logo.png"
                    alt="Raghu Engineering College"
                    className="h-6 w-auto object-contain"
                  />
                </a>
                <span className="text-purple-500 font-mono text-xs">×</span>
                <a
                  href="https://www.ecell.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/95 px-2.5 py-1 rounded-lg border border-purple-300/40 hover:shadow-glow-sm transition-all inline-block"
                  title="E-Cell IIT Bombay"
                >
                  <img
                    src="/assets/logos/ecell-logo.jpeg"
                    alt="E-Cell IIT Bombay"
                    className="h-6 w-auto object-contain"
                  />
                </a>
              </div>

              <p className="text-white font-bold text-sm tracking-wide uppercase">
                Creating Future Entrepreneurs & Innovators
              </p>
              <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
                {CONTACT_DATA.institution.address}
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed max-w-sm">
                Organized in academic collaboration with The Entrepreneurship Cell, Student Activity Centre, IIT Bombay, Powai, Mumbai 400076.
              </p>
            </div>

            {/* Col 2: Quick Links (3 cols) */}
            <div className="md:col-span-3 text-left">
              <h4 className="text-xs font-mono uppercase tracking-widest text-purple-300 font-bold mb-4">
                Navigation
              </h4>
              <ul className="space-y-2.5">
                {SITE_DATA.navLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleScrollTo(e, link.href)}
                      className="text-slate-300 hover:text-white transition-colors block py-0.5"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#register"
                    onClick={(e) => handleScrollTo(e, '#register')}
                    className="text-amber-400 hover:text-amber-300 font-semibold transition-colors block py-0.5"
                  >
                    Register Seat
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Reach Out & Socials (4 cols) */}
            <div className="md:col-span-4 text-left space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-purple-300 font-bold mb-4">
                Reach Out
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Direct Helpline: <span className="text-white font-medium">{CONTACT_DATA.institution.helpline}</span>
              </p>
              <p className="text-slate-300 text-xs leading-relaxed">
                Official Email: <a href={`mailto:${CONTACT_DATA.institution.email}`} className="text-purple-300 hover:underline">{CONTACT_DATA.institution.email}</a>
              </p>

              <div className="pt-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  Social Channels
                </span>
                <div className="flex items-center gap-2.5">
                  {SITE_DATA.socials.map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-800/40 text-slate-300 hover:text-white hover:border-purple-500 transition-colors text-xs font-medium"
                    >
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Legal & Copyright Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-400">
            <p>{SITE_DATA.legal.copyright}</p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setLegalModal('privacy')}
                className="hover:text-purple-300 transition-colors focus:outline-none"
              >
                Privacy Policy
              </button>
              <span className="text-slate-700">|</span>
              <button
                type="button"
                onClick={() => setLegalModal('terms')}
                className="hover:text-purple-300 transition-colors focus:outline-none"
              >
                Terms & Conditions
              </button>
              <span className="text-slate-700">|</span>
              <button
                type="button"
                onClick={() => setLegalModal('conduct')}
                className="hover:text-purple-300 transition-colors focus:outline-none"
              >
                Code of Conduct
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <Modal
        isOpen={legalModal === 'privacy'}
        onClose={() => setLegalModal(null)}
        title="Privacy Policy"
        subtitle="Illuminate 2026 Attendee Data Handling"
      >
        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Your student information (Name, Roll Number, Branch, Email, Phone, and Transaction Reference) is collected strictly for delegate badge generation, payment verification, and issuing co-certified completion credentials.
          </p>
          <p>
            We do not sell, license, or share your data with unauthorized third parties. All registration payloads are secured directly through authorized institutional channels.
          </p>
        </div>
      </Modal>

      {/* Terms & Conditions Modal */}
      <Modal
        isOpen={legalModal === 'terms'}
        onClose={() => setLegalModal(null)}
        title="Terms & Conditions"
        subtitle="Workshop Registration Guidelines"
      >
        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            1. Registration is confirmed only upon successful verification of the 12-digit UPI UTR and accompanying transaction receipt.
          </p>
          <p>
            2. Each registration pass admits one eligible delegate to all workshop keynotes, hands-on breakout sessions, and networking tracks.
          </p>
          <p>
            3. In case of unexpected institutional schedule changes, registered delegates will receive formal notice via their registered email address.
          </p>
        </div>
      </Modal>

      {/* Code of Conduct Modal */}
      <Modal
        isOpen={legalModal === 'conduct'}
        onClose={() => setLegalModal(null)}
        title="Code of Conduct"
        subtitle="Inclusive & Professional Workshop Environment"
      >
        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Illuminate 2026 is dedicated to providing a harassment-free, professional, and collaborative learning experience for all participants regardless of background, gender, or college year.
          </p>
          <p>
            Participants are expected to treat peers, mentors, and event volunteers with respect during discussions, pitching sessions, and campus facilities access.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default Footer;
