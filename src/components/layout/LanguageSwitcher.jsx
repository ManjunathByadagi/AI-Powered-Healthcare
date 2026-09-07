import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { priorityLanguages, allNllbLanguages } from "@/pages/landing/nllbLanguages";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateText } from "@/services/translate";
import { translatableStrings } from "@/pages/landing/translatableText";

const translationCache = {};

export function LanguageSwitcher() {
  const { language, setLanguage, setTranslations, setTranslating } = useLanguage();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredLanguages = search
    ? allNllbLanguages.filter((lang) =>
        lang.label.toLowerCase().includes(search.toLowerCase())
      )
    : priorityLanguages;

  async function handleSelect(option) {
    setLanguage(option);
    setOpen(false);
    setSearch("");

    if (option.code === "eng_Latn") {
      setTranslations({});
      return;
    }

    if (translationCache[option.code]) {
      setTranslations(translationCache[option.code]);
      return;
    }

    setTranslating(true);
    try {
      const map = {};
      for (const text of translatableStrings) {
        const translated = await translateText(text, option.code);
        map[text] = translated;
      }
      translationCache[option.code] = map;
      setTranslations(map);
    } catch (err) {
      console.error("Translation failed:", err);
    } finally {
      setTranslating(false);
    }
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="border-[#1F2933]/15 text-[#1F2933] bg-white"
        onClick={() => setOpen(!open)}
      >
        <Languages className="h-4 w-4 mr-2" />
        {language.label}
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-[#1F2933]/10 rounded-md shadow-lg overflow-hidden z-50">
          <div className="p-2 border-b border-[#1F2933]/10">
            <input
              type="text"
              placeholder="Search language..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#1F2933]/15 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F6F5E]/40"
              autoFocus
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredLanguages.length === 0 && (
              <p className="px-4 py-3 text-sm text-[#9CA3AF]">No languages found</p>
            )}
            {filteredLanguages.map((option) => (
              <button
                key={option.code}
                onClick={() => handleSelect(option)}
                className="block w-full text-left px-4 py-2 text-sm text-[#1F2933] hover:bg-[#EFF3EC]"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}