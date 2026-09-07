import { createContext, useContext, useState } from "react";
import { priorityLanguages } from "@/pages/landing/nllbLanguages";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(priorityLanguages[0]);
  const [translations, setTranslations] = useState({});
  const [translating, setTranslating] = useState(false);

  function t(text) {
    if (language.code === "eng_Latn") return text;
    return translations[text] ?? text;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translations,
        setTranslations,
        translating,
        setTranslating,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}