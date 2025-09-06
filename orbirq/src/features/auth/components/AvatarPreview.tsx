import React from "react";

interface AvatarPreviewProps {
  src?: string;
  selected?: boolean;
  size?: number;
}

export function AvatarPreview({ src, selected, size = 80 }: AvatarPreviewProps) {
  return (
    <div
      className={`relative rounded-full overflow-hidden border-2 shadow-md transition ${
        selected ? "border-teal-500 ring-2 ring-teal-300" : "border-gray-200"
      }`}
      style={{ width: size, height: size }}
    >
      <img
        src={
          src || "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
        }
        alt="avatar"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
