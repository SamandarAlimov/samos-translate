import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, Share2, Star, Check } from "lucide-react";
import { toast } from "sonner";

interface TranslationActionsProps {
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
}

export const TranslationActions = ({
  sourceText,
  translatedText,
  sourceLang,
  targetLang,
}: TranslationActionsProps) => {
  const [copied, setCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      toast.success("Translation copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy translation");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "SAMOS Translation",
      text: `${sourceText}\n→ ${translatedText}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Translation shared successfully!");
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(
          `Translation:\n"${sourceText}"\n→ "${translatedText}"\n\nVia SAMOS Translate`
        );
        toast.success("Translation copied for sharing!");
      }
    } catch (error) {
      toast.error("Failed to share translation");
    }
  };

  const handleDownload = () => {
    const content = `SAMOS Translation\n\nSource (${sourceLang}): ${sourceText}\nTranslation (${targetLang}): ${translatedText}\n\nGenerated on: ${new Date().toLocaleString()}`;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `translation-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Translation downloaded!");
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(
      isFavorited 
        ? "Removed from favorites" 
        : "Added to favorites!"
    );
  };

  return (
    <div className="flex items-center space-x-2 pt-2 border-t border-border">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="hover-glow flex items-center space-x-2"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
        <span>{copied ? "Copied!" : "Copy"}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleFavorite}
        className="hover-glow flex items-center space-x-2"
      >
        <Star 
          className={`w-4 h-4 ${
            isFavorited 
              ? "fill-yellow-400 text-yellow-400" 
              : "text-muted-foreground"
          }`} 
        />
        <span>Favorite</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="hover-glow flex items-center space-x-2"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleDownload}
        className="hover-glow flex items-center space-x-2"
      >
        <Download className="w-4 h-4" />
        <span>Download</span>
      </Button>
    </div>
  );
};