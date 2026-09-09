import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface Translations {
  portalName: string;
  portalTagline: string;
  govIndia: string;
  mospiTitle: string;
  mpladsFullName: string;
  home: string;
  projects: string;
  funds: string;
  alerts: string;
  verification: string;
  reports: string;
  help: string;
  officerLogin: string;
  publicView: string;
  verified: string;
  underReview: string;
  flagged: string;
  sanctioned: string;
  utilized: string;
  backTo: string;
  whatDoesThisMean: string;
}

const translations: Record<Language, Translations> = {
  en: {
    portalName: 'MPLADS Transparency Portal',
    portalTagline: 'Members of Parliament Local Area Development Scheme',
    govIndia: 'Government of India',
    mospiTitle: 'Ministry of Statistics & Programme Implementation',
    mpladsFullName: 'Members of Parliament Local Area Development Scheme (MPLADS) — Central plan scheme for local developmental assets',
    home: 'Home / Overview',
    projects: 'Projects',
    funds: 'Fund Tracking',
    alerts: 'Alerts & Reviews',
    verification: 'Verification Status',
    reports: 'Reports',
    help: 'Help & Assistant',
    officerLogin: 'Officer Login',
    publicView: 'Public Transparency View',
    verified: 'Verified',
    underReview: 'Under Review',
    flagged: 'Flagged for Inspection',
    sanctioned: 'Sanctioned Allocation',
    utilized: 'Funds Utilized',
    backTo: 'Back to',
    whatDoesThisMean: 'What does this mean?'
  },
  hi: {
    portalName: 'सांसद निधि पारदर्शिता पोर्टल',
    portalTagline: 'सांसद स्थानीय क्षेत्र विकास योजना (MPLADS)',
    govIndia: 'भारत सरकार',
    mospiTitle: 'सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)',
    mpladsFullName: 'सांसद स्थानीय क्षेत्र विकास योजना (MPLADS) — स्थानीय विकास कार्यों हेतु केंद्रीय योजना',
    home: 'होम / डैशबोर्ड',
    projects: 'परियोजनाएं',
    funds: 'निधि ट्रैकिंग',
    alerts: 'समीक्षा व अलर्ट',
    verification: 'सत्यापन स्थिति',
    reports: 'रिपोर्ट एवं विवरण',
    help: 'सहायता व चैटबॉट',
    officerLogin: 'अधिकारी लॉगिन',
    publicView: 'नागरिक पारदर्शिता दृश्य',
    verified: 'सत्यापित',
    underReview: 'समीक्षाधीन',
    flagged: 'जांच हेतु चिह्नित',
    sanctioned: 'स्वीकृत राशि',
    utilized: 'उपयोग की गई राशि',
    backTo: 'वापस जाएं',
    whatDoesThisMean: 'इसका क्या अर्थ है?'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: translations.en
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('mplads_portal_lang');
      return saved === 'hi' ? 'hi' : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mplads_portal_lang', language);
    } catch (e) {
      console.warn(e);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
