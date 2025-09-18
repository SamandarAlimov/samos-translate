import { Button } from "@/components/ui/button";
import { History, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";

interface HeaderProps {
  onToggleHistory: () => void;
  historyCount: number;
}

export const Header = ({ onToggleHistory, historyCount }: HeaderProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">SAMOS Translate</h1>
                <p className="text-xs text-muted-foreground">Global Technologies Inc.</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onToggleHistory}
              className="relative hover-glow"
            >
              <History className="w-4 h-4 mr-2" />
              History
              {historyCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {historyCount > 9 ? '9+' : historyCount}
                </span>
              )}
            </Button>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover-glow"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            <Button variant="ghost" size="sm" className="hover-glow">
              <User className="w-4 h-4" />
            </Button>

            {/* Mobile History Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden relative hover-glow"
              onClick={onToggleHistory}
            >
              <History className="w-4 h-4" />
              {historyCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {historyCount > 9 ? '9+' : historyCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};