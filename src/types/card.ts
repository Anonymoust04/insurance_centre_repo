export type EnergyType = 'Fire' | 'Water' | 'Electric' | 'Grass' | 'Psychic' | 'Rock';

export type InsurancePlan =
  | 'Medical & Health'
  | 'Life Insurance'
  | 'Critical Illness'
  | 'Investment-Linked Plan';

export type IncomeRange = '<2k' | '2k-5k' | '5k-10k' | '>10k';
export type DependentsCount = 0 | 1 | 2 | '3+';
export type TopConcern = 'health' | 'family' | 'income' | 'wealth';
export type Gender = 'male' | 'female' | '';

export interface CardData {
  // Identity
  name: string;
  image: string | null;
  energyType: EnergyType;
  // Plan
  plan: InsurancePlan;
  currentAge: number;
  targetAge: number;
  // AI profile fields (collected in Image step)
  gender: Gender;
  occupation: string;
  incomeRange: IncomeRange;
  dependents: DependentsCount;
  hasExistingCoverage: boolean | null;
  topConcern: TopConcern;
}
