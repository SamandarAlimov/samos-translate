import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  Search, 
  Star, 
  Clock, 
  Copy,
  Filter,
  ChevronRight
} from "lucide-react";
import { Translation } from "@/pages/Index";
import { toast } from "sonner";

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  translations: Translation[];
  onToggleFavorite: (id: string) => void;
}

export const HistorySidebar = ({
  isOpen,
  onClose,
  translations,
  onToggleFavorite,
}: HistorySidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "favorites">("all");

  const filteredTranslations = translations.filter((translation) => {
    const matchesSearch =
      translation.sourceText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      translation.translatedText.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter =
      filterMode === "all" || 
      (filterMode === "favorites" && translation.isFavorite);

    return matchesSearch && matchesFilter;
  });

  const handleCopyTranslation = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy text");
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getLanguageFlag = (langCode: string) => {
    const flags: Record<string, string> = {
      "auto": "🌐",
      "en": "🇺🇸",
      "uz": "🇺🇿", 
      "ru": "🇷🇺"
    };
    return flags[langCode] || "🌍";
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 right-0 h-full w-96 z-50 
          bg-card border-l border-border shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Translation History
              </h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="hover-glow"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search translations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 focus-glow"
              />
            </div>

            {/* Filters */}
            <div className="flex space-x-2">
              <Button
                variant={filterMode === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterMode("all")}
                className="hover-glow flex-1"
              >
                <Clock className="w-4 h-4 mr-2" />
                All ({translations.length})
              </Button>
              <Button
                variant={filterMode === "favorites" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterMode("favorites")}
                className="hover-glow flex-1"
              >
                <Star className="w-4 h-4 mr-2" />
                Favorites ({translations.filter(t => t.isFavorite).length})
              </Button>
            </div>
          </div>

          {/* Translation List */}
          <ScrollArea className="flex-1 p-4">
            {filteredTranslations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? (
                  <>
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No translations found</p>
                    <p className="text-sm">Try adjusting your search</p>
                  </>
                ) : filterMode === "favorites" ? (
                  <>
                    <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No favorites yet</p>
                    <p className="text-sm">Star translations to save them</p>
                  </>
                ) : (
                  <>
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No translations yet</p>
                    <p className="text-sm">Start translating to see history</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTranslations.map((translation) => (
                  <Card 
                    key={translation.id} 
                    className="p-4 glass hover-glow cursor-pointer transition-all duration-200"
                  >
                    {/* Header with languages and time */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{getLanguageFlag(translation.sourceLang)}</span>
                        <ChevronRight className="w-3 h-3" />
                        <span>{getLanguageFlag(translation.targetLang)}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(translation.timestamp)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onToggleFavorite(translation.id)}
                          className="w-6 h-6 hover-glow"
                        >
                          <Star 
                            className={`w-3 h-3 ${
                              translation.isFavorite 
                                ? "fill-yellow-400 text-yellow-400" 
                                : "text-muted-foreground"
                            }`} 
                          />
                        </Button>
                      </div>
                    </div>

                    {/* Translation Text */}
                    <div className="space-y-2">
                      <div 
                        className="text-sm text-foreground cursor-pointer hover:bg-accent/10 p-2 rounded"
                        onClick={() => handleCopyTranslation(translation.sourceText)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{translation.sourceText}</span>
                          <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 ml-2 flex-shrink-0" />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div 
                        className="text-sm text-muted-foreground cursor-pointer hover:bg-accent/10 p-2 rounded"
                        onClick={() => handleCopyTranslation(translation.translatedText)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{translation.translatedText}</span>
                          <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 ml-2 flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {translations.length > 0 && (
            <div className="p-4 border-t border-border">
              <div className="text-xs text-muted-foreground text-center">
                {translations.length} translation{translations.length !== 1 ? 's' : ''} stored locally
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};