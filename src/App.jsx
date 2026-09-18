import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import CinematicPreloader from './components/Preloader/CinematicPreloader';
import AnimatedBackground from './components/ui/AnimatedBackground';
import ScrollToTop from './components/ui/ScrollToTop';
import Navbar from './components/Navbar/Navbar';
import MobileBottomDock from './components/Navbar/MobileBottomDock';
import Hero from './components/Hero/Hero';
import ScrollMarquee from './components/ui/ScrollMarquee';
import EventIntro from './components/EventIntro/EventIntro';
import SpeakerSection from './components/Speaker/SpeakerSection';
import RegistrationWizard from './components/Registration/RegistrationWizard';
import FAQSection from './components/FAQ/FAQSection';
import ContactSection from './components/Contact/ContactSection';
import Footer from './components/Footer/Footer';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 }
};

const pageTransition = {
  duration: 0.22,
  ease: 'easeOut'
};

export function App() {
  const [showPreloader, setShowPreloader] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // On page refresh / initial mount, return to the Hero section
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (window.location.pathname !== '/') {
      navigate('/', { replace: true });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-[#05020c] text-slate-100 selection:bg-purple-600 selection:text-white relative flex flex-col justify-between overflow-x-hidden">
      <ScrollToTop />
      {/* Global Animated Cosmic Background */}
      <AnimatedBackground />

      <AnimatePresence>
        {showPreloader && (
          <CinematicPreloader onComplete={handlePreloaderComplete} />
        )}
      </AnimatePresence>

      {/* Floating Global Navbar */}
      <Navbar onRegisterClick={handleRegisterClick} />

      {/* Floating Mobile Bottom Thumb Dock (iOS / Threads Style) */}
      <MobileBottomDock />

      {/* Main Page Content with Animated Transitions */}
      <main className="relative z-10 flex-1 flex flex-col pt-20 pb-8 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
            className="flex-1 flex flex-col"
          >
            <Routes location={location}>
              <Route path="/" element={
                <>
                  <Hero onRegisterClick={handleRegisterClick} isReady={!showPreloader} />
                  <ScrollMarquee />
                </>
              } />
              <Route path="/about" element={<EventIntro />} />
              <Route path="/speaker" element={<SpeakerSection />} />
              <Route path="/register" element={<RegistrationWizard />} />
              <Route path="/faq" element={<FAQSection />} />
              <Route path="/contact" element={<ContactSection />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
