import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TermsSection from '@/components/TermsSection';
import CalculatorSection from '@/components/CalculatorSection';
import AccountSection from '@/components/AccountSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';

export default function Index() {
  const [currentSection, setCurrentSection] = useState('home');

  useEffect(() => {
    const section = document.getElementById(currentSection);
    if (section) {
      const headerOffset = 80;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, [currentSection]);

  return (
    <div className="min-h-screen">
      <Header onNavigate={setCurrentSection} currentSection={currentSection} />
      
      <main className="pt-20">
        <div id="home">
          <HeroSection onNavigate={setCurrentSection} />
        </div>
        
        <div id="terms">
          <TermsSection />
        </div>
        
        <div id="calculator">
          <CalculatorSection onNavigate={setCurrentSection} />
        </div>
        
        <div id="account">
          <AccountSection />
        </div>
        
        <div id="faq">
          <FAQSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
