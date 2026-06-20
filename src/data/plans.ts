import type { InsurancePlan } from '@/types/card';

export interface PlanAbility {
  title: string;
  text: string;
}

export interface PlanCardData {
  id: InsurancePlan;
  badge: string;
  tagline: string;
  description: string;
  helpsWith: string;
  bestFor: string;
  affordabilityNote: string;
  supportingFact?: string;
  abilities: [PlanAbility, PlanAbility];
  advisorNote: string;
  /** Tailwind color token for the card accent strip */
  accentClass: string;
  /** Tailwind text color for badge */
  badgeClass: string;
}

export const planCards: PlanCardData[] = [
  {
    id: 'Medical & Health',
    badge: 'Hospital Care',
    tagline: 'Helps you manage hospitalisation, treatment, and major medical costs.',
    description:
      'Supports coverage for hospital bills, surgery, and treatment-related expenses.',
    helpsWith: 'Hospital stays, surgery costs, and treatment-related medical expenses.',
    bestFor:
      'Anyone who wants practical day-to-day protection against rising medical costs.',
    affordabilityNote:
      'Contribution depends on age, plan level, and medical coverage selected.',
    supportingFact:
      'Example: some medical products are yearly renewable up to age 70.',
    abilities: [
      {
        title: 'Protection Boost',
        text: 'Helps cover sudden health costs and unexpected medical challenges.',
      },
      {
        title: 'Care Shield',
        text: 'Supports hospital and treatment protection so recovery feels less overwhelming.',
      },
    ],
    advisorNote:
      'Often one of the easiest and most relevant protection conversations for clients.',
    accentClass: 'bg-energy-water',
    badgeClass: 'text-blue-700',
  },
  {
    id: 'Life Insurance',
    badge: 'Core Protection',
    tagline: 'Protect the people who depend on you with a strong financial safety net.',
    description:
      'Provides financial support for your loved ones if life takes an unexpected turn.',
    helpsWith: 'Financial support for your loved ones if life takes an unexpected turn.',
    bestFor:
      'Young adults, parents, breadwinners, and anyone building long-term family security.',
    affordabilityNote:
      'Contribution depends on age, coverage amount, and protection term.',
    abilities: [
      {
        title: 'Protection Promise',
        text: 'Builds a strong foundation for long-term family protection and peace of mind.',
      },
      {
        title: 'Legacy Shield',
        text: 'Helps your loved ones stay financially supported when they need it most.',
      },
    ],
    advisorNote:
      'A good starting point for most clients before adding more specialised protection.',
    accentClass: 'bg-energy-fire',
    badgeClass: 'text-red-700',
  },
  {
    id: 'Critical Illness',
    badge: 'Income Support',
    tagline: 'Gives financial support if a serious illness disrupts your life or income.',
    description:
      'A critical illness plan can provide a lump-sum payout if you are diagnosed with a covered condition.',
    helpsWith: 'Lump-sum payout if diagnosed with a covered critical condition.',
    bestFor:
      'Clients worried about recovery costs, income disruption, or long treatment periods.',
    affordabilityNote: 'Contribution usually increases with age and coverage amount.',
    supportingFact:
      'CI cover can cover up to 39 critical illnesses, yearly renewable up to age 70, from RM50,000 to RM250,000.',
    abilities: [
      {
        title: 'Recovery Support',
        text: 'Creates financial breathing room when a serious illness changes your daily life.',
      },
      {
        title: 'Income Shield',
        text: 'Helps you stay focused on recovery instead of immediate financial pressure.',
      },
    ],
    advisorNote:
      'Best for AI explanation because coverage terms can be harder to understand.',
    accentClass: 'bg-energy-psychic',
    badgeClass: 'text-purple-700',
  },
  {
    id: 'Investment-Linked Plan',
    badge: 'Growth + Protection',
    tagline: 'Combines insurance protection with potential long-term investment value.',
    description:
      'An investment-linked plan combines the security of insurance protection with the potential growth of investments.',
    helpsWith: 'Security of insurance protection plus potential investment growth.',
    bestFor:
      'Clients who want protection plus a longer-term planning conversation with an advisor.',
    affordabilityNote:
      'Contribution depends on coverage level, riders, investment structure, and long-term goals.',
    supportingFact:
      'Coverage can go up to age 100 if the policy remains in force and the fund value is sufficient.',
    abilities: [
      {
        title: 'Growth Track',
        text: 'Combines protection with long-term planning in one flexible path.',
      },
      {
        title: 'Future Balance',
        text: 'Helps you track protection needs while building toward future financial goals.',
      },
    ],
    advisorNote:
      'Best presented with advisor guidance — involves suitability, risk understanding, and ongoing review.',
    accentClass: 'bg-energy-grass',
    badgeClass: 'text-green-700',
  },
];

export interface AiToolCard {
  id: string;
  title: string;
  shortText: string;
  expandedText: string;
  buttonText: string;
}

export const aiToolCards: AiToolCard[] = [
  {
    id: 'plan-match',
    title: 'Plan Match',
    shortText:
      'Find the best protection starting point based on your age, goals, and priorities.',
    expandedText:
      'AI compares your life stage and needs to suggest which protection category may fit you best.',
    buttonText: 'Find my match',
  },
  {
    id: 'simple-explain',
    title: 'Simple Explain',
    shortText: 'Turn complex insurance wording into clear, easy-to-understand language.',
    expandedText:
      'Useful for medical, critical illness, and investment-linked terms that feel too technical at first glance.',
    buttonText: 'Explain simply',
  },
  {
    id: 'gap-check',
    title: 'Gap Check',
    shortText: 'See which part of your protection setup may still be missing.',
    expandedText:
      'AI highlights possible gaps such as hospital costs, critical illness support, family protection, or long-term planning.',
    buttonText: 'Check my gaps',
  },
  {
    id: 'ask-advisor-prep',
    title: 'Ask Advisor Prep',
    shortText: 'Generate a short summary of what to ask your advisor next.',
    expandedText:
      'Turn your selected plan and concerns into a clear discussion starter before your appointment.',
    buttonText: 'Prepare my questions',
  },
];
