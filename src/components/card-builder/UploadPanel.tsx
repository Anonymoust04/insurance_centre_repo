import React, { useRef } from 'react';
import { IconUpload, IconWand } from '@tabler/icons-react';

interface UploadPanelProps {
  onImageChange: (imageUrl: string) => void;
  name: string;
  onNameChange: (name: string) => void;
}

export function UploadPanel({ onImageChange, name, onNameChange }: UploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageChange(url);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white/50 p-6 border-sketch-sm shadow-sm">
      <h2 className="font-handwriting text-3xl font-bold text-card-outline">1. Who is this card for?</h2>
      
      <div className="flex flex-col gap-2">
        <label className="font-bold text-lg">Card Name</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g. Super Mom" 
          className="border-sketch-sm px-4 py-2 font-sans text-lg focus:outline-none focus:ring-4 ring-pastel-pink/50 bg-white"
        />
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <label className="font-bold text-lg">Photo</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 border-sketch-sm bg-pastel-pink hover:bg-pink-300 transition-colors px-4 py-3 flex items-center justify-center gap-2 font-bold shadow-sm"
          >
            <IconUpload size={20} />
            Upload your photo
          </button>
          
          <button 
            disabled
            title="Coming soon!"
            className="flex-1 border-sketch-sm bg-gray-200 text-gray-500 px-4 py-3 flex items-center justify-center gap-2 font-bold cursor-not-allowed opacity-70"
          >
            <IconWand size={20} />
            Generate cute portrait
          </button>
        </div>
      </div>
    </div>
  );
}
