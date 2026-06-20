import React, { useRef } from 'react';
import { IconUpload, IconWand } from '@tabler/icons-react';
import type { Gender, IncomeRange, DependentsCount, TopConcern } from '@/types/card';

interface UploadPanelProps {
  onImageChange: (imageUrl: string) => void;
  name: string;
  onNameChange: (name: string) => void;
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
  name,
  onNameChange,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageChange(url);
    }
  };

  return (
    <div className="flex flex-col gap-5 bg-white/50 p-6 border-sketch-sm shadow-sm">
      <h2 className="font-handwriting text-3xl font-bold text-card-outline">
        1. Who is this card for?
      </h2>

      {/* Card Name */}
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

      {/* Photo */}
      <div className="flex flex-col gap-3">
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

      {/* ─── AI Profile Questions ─── */}
      <div className="border-t-[3px] border-dashed border-card-outline/20 pt-5 flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <p className="font-bold text-base text-card-outline">
            Help the AI find your best match
          </p>
        </div>
        <p className="text-sm opacity-60 -mt-3 font-sans">
          These answers help suggest the most suitable protection plan for you.
        </p>

        {/* Gender */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-base">Gender</label>
          <ButtonGroup<Gender>
            options={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Prefer not to say', value: 'prefer-not-to-say' },
            ]}
            value={gender}
            onChange={onGenderChange}
          />
        </div>

        {/* Occupation */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-base">Occupation</label>
          <input
            type="text"
            value={occupation}
            onChange={(e) => onOccupationChange(e.target.value)}
            placeholder="e.g. Teacher, Engineer, Self-employed…"
            className="border-sketch-sm px-4 py-2 font-sans text-base focus:outline-none focus:ring-4 ring-pastel-pink/50 bg-white"
          />
        </div>

        {/* Monthly Income */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-base">Monthly Income (RM)</label>
          <ButtonGroup<IncomeRange>
            options={[
              { label: '< RM2k', value: '<2k' },
              { label: 'RM2k – 5k', value: '2k-5k' },
              { label: 'RM5k – 10k', value: '5k-10k' },
              { label: '> RM10k', value: '>10k' },
            ]}
            value={incomeRange}
            onChange={onIncomeRangeChange}
          />
        </div>

        {/* Dependents */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-base">Number of Dependents</label>
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
          <label className="font-bold text-base">Do you have existing insurance coverage?</label>
          <ButtonGroup<boolean>
            options={[
              { label: 'Yes, I do', value: true },
              { label: "No, I don't", value: false },
            ]}
            value={hasExistingCoverage}
            onChange={onHasExistingCoverageChange}
          />
        </div>

        {/* Top Concern */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-base">What matters most to you right now?</label>
          <ButtonGroup<TopConcern>
            options={[
              { label: '🏥 Health costs', value: 'health' },
              { label: '👨‍👩‍👧 Family security', value: 'family' },
              { label: '💼 Income loss', value: 'income' },
              { label: '📈 Wealth growth', value: 'wealth' },
            ]}
            value={topConcern}
            onChange={onTopConcernChange}
          />
        </div>
      </div>
    </div>
  );
}
