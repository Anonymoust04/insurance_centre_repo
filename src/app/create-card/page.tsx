'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CardData } from '@/types/card';
import { UploadPanel } from '@/components/card-builder/UploadPanel';
import { EnergyTypePicker } from '@/components/card-builder/EnergyTypePicker';
import { PlanPicker } from '@/components/card-builder/PlanPicker';
import { PaymentPanel } from '@/components/card-builder/PaymentPanel';
import { StepTabs } from '@/components/card-builder/StepTabs';
import { CardPreview } from '@/components/card-builder/CardPreview';

// localStorage key shared with the dashboard
export const CARD_STORAGE_KEY = 'insurequest_card';

export default function CreateCardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaying, setIsPaying] = useState(false);
  const [data, setData] = useState<CardData>({
    name: '',
    image: null,
    energyType: 'Water',
    plan: 'Medical & Health',
    currentAge: 30,
    targetAge: 80,
    // AI profile fields
    gender: 'prefer-not-to-say',
    occupation: '',
    incomeRange: '2k-5k',
    dependents: 0,
    hasExistingCoverage: null,
    topConcern: 'health',
  });

  const updateData = (updates: Partial<CardData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  /** Called when user clicks "Confirm Purchase" on step 2 */
  const handleConfirmPayment = () => {
    setIsPaying(true);
    // Save card to localStorage so the dashboard can read it
    try {
      localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // localStorage not available (SSR safety)
    }
    // Simulate brief payment processing then redirect
    setTimeout(() => {
      router.push('/user-dashboard');
    }, 1200);
  };

  const buttonText = ['Continue to Plan', 'Continue to Payment', 'Confirm Purchase'][currentStep];

  return (
    <div className="min-h-screen bg-pastel-yellow p-4 sm:p-8 font-sans text-card-text">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 text-center sm:text-left">
        <h1 className="font-handwriting text-5xl sm:text-6xl font-bold text-card-outline mb-2">
          Create Your Protection Card
        </h1>
        <p className="font-bold text-lg opacity-80 max-w-2xl">
          Upload your photo, pick your energy type, and build a cute card that shows your protection journey.
        </p>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col-reverse lg:flex-row gap-8 lg:gap-12">

        {/* Left Panel: Controls */}
        <div className="flex-1 flex flex-col gap-8">

          {/* Step 0 — Image + Energy + AI Profile */}
          {currentStep === 0 && (
            <>
              <UploadPanel
                name={data.name}
                onNameChange={(name) => updateData({ name })}
                onImageChange={(image) => updateData({ image })}
                currentAge={data.currentAge}
                onCurrentAgeChange={(currentAge) => updateData({ currentAge })}
                gender={data.gender}
                onGenderChange={(gender) => updateData({ gender })}
                occupation={data.occupation}
                onOccupationChange={(occupation) => updateData({ occupation })}
                incomeRange={data.incomeRange}
                onIncomeRangeChange={(incomeRange) => updateData({ incomeRange })}
                dependents={data.dependents}
                onDependentsChange={(dependents) => updateData({ dependents })}
                hasExistingCoverage={data.hasExistingCoverage}
                onHasExistingCoverageChange={(hasExistingCoverage) => updateData({ hasExistingCoverage })}
                topConcern={data.topConcern}
                onTopConcernChange={(topConcern) => updateData({ topConcern })}
              />
              <EnergyTypePicker
                selected={data.energyType}
                onSelect={(energyType) => updateData({ energyType })}
              />
            </>
          )}

          {/* Step 1 — Plan */}
          {currentStep === 1 && (
            <PlanPicker
              selectedPlan={data.plan}
              onPlanSelect={(plan) => updateData({ plan })}
              currentAge={data.currentAge}
              onCurrentAgeChange={(currentAge) => updateData({ currentAge })}
              targetAge={data.targetAge}
              onTargetAgeChange={(targetAge) => updateData({ targetAge })}
              cardData={data}
            />
          )}

          {/* Step 2 — Payment (final step) */}
          {currentStep === 2 && (
            <PaymentPanel />
          )}

          {/* Navigation */}
          <div className="flex gap-4">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                disabled={isPaying}
                className="px-6 bg-white border-sketch hover:bg-gray-50 transition-colors py-4 text-xl font-bold font-handwriting text-card-outline shadow-sm transform hover:-translate-y-1 disabled:opacity-50"
              >
                Back
              </button>
            )}
            <button
              onClick={currentStep === 2 ? handleConfirmPayment : handleNext}
              disabled={isPaying}
              className={`flex-1 border-sketch transition-all py-4 text-xl font-bold font-handwriting text-card-outline shadow-md transform hover:-translate-y-1 active:scale-[0.98] disabled:cursor-not-allowed ${
                currentStep === 2
                  ? 'bg-energy-grass hover:bg-green-300'
                  : 'bg-pastel-pink hover:bg-pink-300'
              }`}
            >
              {isPaying ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-5 h-5 border-[3px] border-card-outline border-t-transparent rounded-full animate-spin" />
                  Processing…
                </span>
              ) : (
                buttonText
              )}
            </button>
          </div>
        </div>

        {/* Right Panel: Preview & Tabs */}
        <div className="lg:w-[500px] flex flex-col items-center sticky top-8 self-start">
          <CardPreview data={data} />
          <StepTabs currentStep={currentStep} />
        </div>

      </div>
    </div>
  );
}
