import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  languages: Language[];
  label: string;
}

export const LanguageSelector = ({
  value,
  onChange,
  languages,
  label,
}: LanguageSelectorProps) => {
  const selectedLanguage = languages.find((lang) => lang.code === value);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-48 hover-glow focus-glow">
          <SelectValue>
            <div className="flex items-center space-x-3">
              <span className="text-lg">{selectedLanguage?.flag}</span>
              <span>{selectedLanguage?.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="glass shadow-elegant">
          {languages.map((language) => (
            <SelectItem 
              key={language.code} 
              value={language.code}
              className="hover:bg-accent/50 focus:bg-accent/50"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};