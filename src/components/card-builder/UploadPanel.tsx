import React, { useRef, useState, useEffect } from 'react';
import { IconUpload, IconWand, IconCamera, IconX } from '@tabler/icons-react';
import type {
  Gender,
  IncomeRange,
  DependentsCount,
  TopConcern,
} from '@/types/card';

interface UploadPanelProps {
  onImageChange: (imageUrl: string) => void;

  onPhotoFileChange: (file: File) => void;

  name: string;
  onNameChange: (name: string) => void;
  currentAge: number;
  onCurrentAgeChange: (age: number) => void;
  gender: Gender;
  onGenderChange: (g: Gender) => void;

  occupation: string;
  onOccupationChange: (o: string) => void;

  incomeRange: IncomeRange;
  onIncomeRangeChange: (r: IncomeRange) => void;

  dependents: DependentsCount;
  onDependentsChange: (d: DependentsCount) => void;

  hasExistingCoverage: boolean | null;
  onHasExistingCoverageChange: (v: boolean) => void;

  topConcern: TopConcern;
  onTopConcernChange: (c: TopConcern) => void;
}

function ButtonGroup<T extends string | number | boolean>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = value === opt.value;

        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`
              px-4 py-2 font-bold text-sm transition-all duration-200
              ${isActive
                ? 'border-sketch-sm bg-pastel-pink text-card-outline shadow-sm scale-105'
                : 'border-[3px] border-card-outline/20 rounded-xl bg-white hover:border-pastel-pink/60 hover:bg-pastel-pink/10'
              }
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function UploadPanel({
  onImageChange,
  onPhotoFileChange,

  name,
  onNameChange,
  currentAge,
  onCurrentAgeChange,
  gender,
  onGenderChange,

  occupation,
  onOccupationChange,

  incomeRange,
  onIncomeRangeChange,

  dependents,
  onDependentsChange,

  hasExistingCoverage,
  onHasExistingCoverageChange,

  topConcern,
  onTopConcernChange,
}: UploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check your permissions.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw the image
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
            setSelectedFile(file);
            const previewUrl = URL.createObjectURL(blob);
            onImageChange(previewUrl);
            onPhotoFileChange(file);
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  useEffect(() => {
    return () => {
      // Ensure camera is turned off if component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);

    onImageChange(previewUrl);
    onPhotoFileChange(file);
  };

  const handleGeneratePortrait = async () => {
    if (!selectedFile) {
      alert('Please upload a photo first.');
      return;
    }

    try {
      setIsGenerating(true);

      const formData = new FormData();
      formData.append('photo', selectedFile);

      const response = await fetch(
        '/api/generate-portrait',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate portrait');
      }

      const blob = await response.blob();

      const generatedImageUrl =
        URL.createObjectURL(blob);

      onImageChange(generatedImageUrl);
    } catch (error) {
      console.error(error);

      alert(
        'Failed to generate portrait. Check backend logs.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 bg-white/50 p-6 border-sketch-sm shadow-sm">
      <h2 className="font-handwriting text-3xl font-bold text-card-outline">
        1. Who is this card for?
      </h2>

      {/* Card Name + Age row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <label className="font-bold text-lg">Card Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Super Mom"
            className="border-sketch-sm px-4 py-2 font-sans text-lg focus:outline-none focus:ring-4 ring-pastel-pink/50 bg-white"
          />
        </div>
        <div className="flex flex-col gap-2 sm:w-28">
          <label className="font-bold text-lg">Your Age</label>
          <input
            type="number"
            min="18"
            max="99"
            value={currentAge || ''}
            onChange={(e) => onCurrentAgeChange(parseInt(e.target.value) || 0)}
            placeholder="30"
            className="border-sketch-sm px-4 py-2 font-sans text-lg focus:outline-none focus:ring-4 ring-pastel-pink/50 bg-white w-full text-center font-bold"
          />
        </div>
      </div>

      {/* Photo Upload */}
      <div className="flex flex-col gap-3">
        <label className="font-bold text-lg">
          Photo
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="flex-1 border-sketch-sm bg-pastel-pink hover:bg-pink-300 transition-colors px-4 py-3 flex items-center justify-center gap-2 font-bold shadow-sm"
          >
            <IconUpload size={20} />
            Upload your photo
          </button>

          <button
            type="button"
            onClick={startCamera}
            className="flex-1 border-sketch-sm bg-pastel-lavender hover:bg-purple-300 transition-colors px-4 py-3 flex items-center justify-center gap-2 font-bold shadow-sm"
          >
            <IconCamera size={20} />
            Take photo
          </button>

          <button
            type="button"
            onClick={handleGeneratePortrait}
            disabled={
              !selectedFile || isGenerating
            }
            className="flex-1 border-sketch-sm bg-pastel-yellow hover:bg-yellow-300 transition-colors px-4 py-3 flex items-center justify-center gap-2 font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconWand size={20} />

            {isGenerating
              ? 'Generating...'
              : 'Generate cute portrait'}
          </button>
        </div>

        {showCamera && (
          <div className="flex flex-col gap-3 mt-2 p-4 border-sketch-sm bg-white rounded-xl items-center relative shadow-sm">
            <button
              onClick={stopCamera}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors z-10"
              title="Close camera"
            >
              <IconX size={24} />
            </button>
            <video
              ref={videoRef}
              className="w-full max-w-sm bg-black rounded-lg transform scale-x-[-1] border-sketch-sm"
              autoPlay
              playsInline
            />
            <canvas ref={canvasRef} className="hidden" />
            <button
              onClick={capturePhoto}
              className="border-sketch-sm bg-pastel-pink hover:bg-pink-300 transition-colors px-6 py-2 font-bold flex items-center gap-2 rounded-full shadow-sm"
            >
              <IconCamera size={20} />
              Snap Photo
            </button>
          </div>
        )}
      </div>

      {/* AI Profile Questions */}
      <div className="border-t-[3px] border-dashed border-card-outline/20 pt-5 flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>

          <p className="font-bold text-base text-card-outline">
            Help the AI find your best match
          </p>
        </div>

        <p className="text-sm opacity-60 -mt-3 font-sans">
          These answers help suggest the most
          suitable protection plan for you.
        </p>

        {/* Gender */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-base">
            Gender
          </label>

          <ButtonGroup<Gender>
            options={[
              {
                label: 'Male',
                value: 'male',
              },
              {
                label: 'Female',
                value: 'female',
              },
            ]}
            value={gender}
            onChange={onGenderChange}
          />
        </div>

        {/* Occupation */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-base">
            Occupation
          </label>

          <input
            type="text"
            value={occupation}
            onChange={(e) =>
              onOccupationChange(e.target.value)
            }
            placeholder="Teacher, Engineer, Freelancer..."
            className="border-sketch-sm px-4 py-2 bg-white"
          />
        </div>

        {/* Income */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-base">
            Monthly Income (RM)
          </label>

          <ButtonGroup<IncomeRange>
            options={[
              { label: '< RM2k', value: '<2k' },
              {
                label: 'RM2k – 5k',
                value: '2k-5k',
              },
              {
                label: 'RM5k – 10k',
                value: '5k-10k',
              },
              {
                label: '> RM10k',
                value: '>10k',
              },
            ]}
            value={incomeRange}
            onChange={onIncomeRangeChange}
          />
        </div>

        {/* Dependents */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-base">
            Number of Dependents
          </label>

          <ButtonGroup<DependentsCount>
            options={[
              { label: '0', value: 0 },
              { label: '1', value: 1 },
              { label: '2', value: 2 },
              { label: '3+', value: '3+' },
            ]}
            value={dependents}
            onChange={onDependentsChange}
          />
        </div>

        {/* Existing Coverage */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-base">
            Existing Insurance Coverage?
          </label>

          <ButtonGroup<boolean>
            options={[
              {
                label: 'Yes',
                value: true,
              },
              {
                label: 'No',
                value: false,
              },
            ]}
            value={hasExistingCoverage}
            onChange={
              onHasExistingCoverageChange
            }
          />
        </div>

        {/* Top Concern */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-base">
            What matters most?
          </label>

          <ButtonGroup<TopConcern>
            options={[
              {
                label: '🏥 Health costs',
                value: 'health',
              },
              {
                label: '👨‍👩‍👧 Family security',
                value: 'family',
              },
              {
                label: '💼 Income loss',
                value: 'income',
              },
              {
                label: '📈 Wealth growth',
                value: 'wealth',
              },
            ]}
            value={topConcern}
            onChange={onTopConcernChange}
          />
        </div>
      </div>
    </div>
  );
}
