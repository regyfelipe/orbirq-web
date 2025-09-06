import { useRef } from "react";
import { Camera } from "lucide-react";
import { AvatarPreview } from "./AvatarPreview";

interface AvatarUploaderProps {
  value?: string;
  onChange: (url: string) => void;
}

export function AvatarUploader({ value, onChange }: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) onChange(reader.result.toString());
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative cursor-pointer" onClick={handleClick}>
        <AvatarPreview src={value} selected size={96} />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition">
          <Camera className="w-6 h-6 text-white" />
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
