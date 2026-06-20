export type EnergyType = 'Fire' | 'Water' | 'Electric' | 'Grass' | 'Psychic' | 'Rock';

export type InsurancePlan = 
  | 'Medical Shield' 
  | 'Critical Illness Guard' 
  | 'Life Protection' 
  | 'Family Secure';

export interface CardData {
  name: string;
  image: string | null;
  energyType: EnergyType;
  plan: InsurancePlan;
  currentAge: number;
  targetAge: number;
}
