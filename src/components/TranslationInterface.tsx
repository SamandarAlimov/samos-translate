import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { LanguageSelector } from "@/components/LanguageSelector";
import { TranslationActions } from "@/components/TranslationActions";
import { ArrowUpDown, Loader2, Mic, Volume2, X } from "lucide-react";
import { Translation } from "@/pages/Index";

interface TranslationInterfaceProps {
  onNewTranslation: (translation: Translation) => void;
}

const languages = [
  { code: "auto", name: "Auto-detect", flag: "🌐" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "uz", name: "Uzbek", flag: "🇺🇿" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
];

export const TranslationInterface = ({ onNewTranslation }: TranslationInterfaceProps) => {
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("en");
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const sourceTextareaRef = useRef<HTMLTextAreaElement>(null);
  const translatedTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = sourceTextareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [sourceText]);

  // Mock translation function (replace with real API when backend is connected)
  const performTranslation = async (text: string, from: string, to: string) => {
    if (!text.trim()) {
      setTranslatedText("");
      return;
    }

    setIsTranslating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    // Mock translation responses
    const mockTranslations: Record<string, Record<string, string>> = {
      "hello": {
        "uz": "Salom",
        "ru": "Привет",
        "en": "Hello"
      },
      "how are you": {
        "uz": "Qalaysiz?",
        "ru": "Как дела?",
        "en": "How are you?"
      },
      "good morning": {
        "uz": "Xayrli tong",
        "ru": "Доброе утро",
        "en": "Good morning"
      },
      "thank you": {
        "uz": "Rahmat",
        "ru": "Спасибо",
        "en": "Thank you"
      }
    };

    const lowerText = text.toLowerCase().trim();
    const translated = mockTranslations[lowerText]?.[to] || 
                     `[Translation: ${text} → ${languages.find(l => l.code === to)?.name || to}]`;

    setTranslatedText(translated);

    // Add to history
    const translation: Translation = {
      id: Date.now().toString(),
      sourceText: text,
      translatedText: translated,
      sourceLang: from === "auto" ? "auto" : from,
      targetLang: to,
      timestamp: new Date(),
      isFavorite: false
    };

    onNewTranslation(translation);
    setIsTranslating(false);
  };

  // Handle text input
  const handleSourceTextChange = (value: string) => {
    setSourceText(value);
    
    // Debounce translation
    const timeoutId = setTimeout(() => {
      performTranslation(value, sourceLang, targetLang);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  // Swap languages
  const handleSwapLanguages = () => {
    if (sourceLang !== "auto") {
      setSourceLang(targetLang);
      setTargetLang(sourceLang);
      setSourceText(translatedText);
      setTranslatedText(sourceText);
    }
  };

  // Clear text
  const handleClear = () => {
    setSourceText("");
    setTranslatedText("");
  };

  // Mock speech recognition
  const handleMicClick = () => {
    setIsListening(true);
    // Mock speech input
    setTimeout(() => {
      setSourceText("Hello, this is a speech input test.");
      setIsListening(false);
    }, 2000);
  };

  // Mock text-to-speech
  const handleSpeakSource = () => {
    if ('speechSynthesis' in window && sourceText) {
      const utterance = new SpeechSynthesisUtterance(sourceText);
      utterance.lang = sourceLang === 'auto' ? 'en-US' : `${sourceLang}-${sourceLang.toUpperCase()}`;
      speechSynthesis.speak(utterance);
    }
  };

  const handleSpeakTranslated = () => {
    if ('speechSynthesis' in window && translatedText) {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = `${targetLang}-${targetLang.toUpperCase()}`;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Language Selectors */}
      <div className="flex items-center justify-center space-x-4">
        <LanguageSelector
          value={sourceLang}
          onChange={setSourceLang}
          languages={languages}
          label="From"
        />
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleSwapLanguages}
          disabled={sourceLang === "auto"}
          className="hover-glow animate-flip-h"
        >
          <ArrowUpDown className="w-4 h-4" />
        </Button>
        
        <LanguageSelector
          value={targetLang}
          onChange={setTargetLang}
          languages={languages.filter(lang => lang.code !== "auto")}
          label="To"
        />
      </div>

      {/* Translation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Text */}
        <Card className="p-6 glass shadow-elegant hover-glow">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">
                {languages.find(l => l.code === sourceLang)?.name || "Source"}
              </h3>
              <div className="flex items-center space-x-2">
                {sourceText && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSpeakSource}
                    className="hover-glow"
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMicClick}
                  disabled={isListening}
                  className="hover-glow"
                >
                  {isListening ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
                {sourceText && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="hover-glow"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <Textarea
              ref={sourceTextareaRef}
              value={sourceText}
              onChange={(e) => handleSourceTextChange(e.target.value)}
              placeholder="Enter text to translate..."
              className="min-h-[120px] resize-none focus-glow border-border"
              maxLength={5000}
            />
            
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>{sourceText.length}/5000</span>
              {isListening && (
                <span className="text-primary animate-pulse">🎤 Listening...</span>
              )}
            </div>
          </div>
        </Card>

        {/* Translated Text */}
        <Card className="p-6 glass shadow-elegant hover-glow">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">
                {languages.find(l => l.code === targetLang)?.name || "Translation"}
              </h3>
              <div className="flex items-center space-x-2">
                {translatedText && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSpeakTranslated}
                    className="hover-glow"
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                )}
                {isTranslating && (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                )}
              </div>
            </div>
            
            <Textarea
              ref={translatedTextareaRef}
              value={translatedText}
              readOnly
              placeholder="Translation will appear here..."
              className="min-h-[120px] resize-none bg-muted/30 focus-glow border-border"
            />
            
            {translatedText && (
              <TranslationActions
                sourceText={sourceText}
                translatedText={translatedText}
                sourceLang={sourceLang}
                targetLang={targetLang}
              />
            )}
          </div>
        </Card>
      </div>

      {/* Quick Suggestions */}
      {!sourceText && (
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-muted-foreground">Try these examples:</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Hello",
              "How are you?",
              "Good morning", 
              "Thank you",
              "Where is the airport?",
              "I need help"
            ].map((example) => (
              <Button
                key={example}
                variant="outline"
                size="sm"
                onClick={() => handleSourceTextChange(example)}
                className="hover-glow"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};