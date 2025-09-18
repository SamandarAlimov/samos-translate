import { useState } from "react";
import { Header } from "@/components/Header";
import { TranslationInterface } from "@/components/TranslationInterface";
import { HistorySidebar } from "@/components/HistorySidebar";

export interface Translation {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: Date;
  isFavorite: boolean;
}

const Index = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [translations, setTranslations] = useState<Translation[]>([]);

  const handleNewTranslation = (translation: Translation) => {
    setTranslations(prev => [translation, ...prev.slice(0, 49)]); // Keep last 50
  };

  const toggleFavorite = (id: string) => {
    setTranslations(prev =>
      prev.map(t => 
        t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)} 
        historyCount={translations.length}
      />
      
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              SAMOS Translate
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional translation platform supporting English, Uzbek, and Russian with real-time results
            </p>
          </div>

          {/* Translation Interface */}
          <TranslationInterface onNewTranslation={handleNewTranslation} />
        </div>
      </main>

      {/* History Sidebar */}
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        translations={translations}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default Index;