import {
  IconHeart,
  IconActivity,
  IconUsers,
  IconTrendingUp,
  IconPigMoney,
  IconFileCheck,
  IconCertificate,
  IconEye,
  IconBolt,
  IconAdjustments,
  IconStar,
  IconHeadset,
  IconAward,
  IconMail,
  IconPhone,
  IconMapPin,
} from '@tabler/icons-react';
import type {
  NavItem,
  InsurancePlan,
  WhyChooseItem,
  Stat,
  Testimonial,
  FooterSection,
} from '@/types';

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Plans', href: '#plans' },
  { label: 'Claims', href: '#claims' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const insurancePlans: InsurancePlan[] = [
  {
    id: 'life',
    icon: IconHeart,
    title: 'Life Insurance',
    description:
      "Protect your family's financial future with a comprehensive life coverage plan tailored to your income and long-term needs.",
  },
  {
    id: 'health',
    icon: IconActivity,
    title: 'Health Insurance',
    description:
      'Stay covered for medical expenses, hospitalisation, and preventive care with flexible, affordable health plans.',
  },
  {
    id: 'family',
    icon: IconUsers,
    title: 'Family Protection',
    description:
      'One plan for your entire household — cover every family member with a unified protection package that grows with you.',
  },
  {
    id: 'retirement',
    icon: IconTrendingUp,
    title: 'Retirement Planning',
    description:
      'Build a secure retirement with our savings-linked insurance products designed for steady, long-term financial growth.',
  },
  {
    id: 'savings',
    icon: IconPigMoney,
    title: 'Savings Plan',
    description:
      'Grow your wealth safely with insurance-backed savings products that offer guaranteed returns and capital protection.',
  },
  {
    id: 'claims',
    icon: IconFileCheck,
    title: 'Claims Support',
    description:
      'Fast, transparent, and hassle-free claims processing with a dedicated support team at every step of the way.',
  },
];

export const whyChooseItems: WhyChooseItem[] = [
  {
    icon: IconCertificate,
    title: 'Licensed Insurance Advisors',
    description:
      'Every advisor on our team is fully licensed, regulated, and trained to provide you with compliant, trustworthy guidance.',
  },
  {
    icon: IconEye,
    title: 'Transparent Policy Guidance',
    description:
      'No jargon, no hidden clauses. We walk you through every term of your policy so you know exactly what you are covered for.',
  },
  {
    icon: IconBolt,
    title: 'Fast Claims Assistance',
    description:
      'We process claims efficiently with real-time updates, dedicated case managers, and a commitment to quick resolution.',
  },
  {
    icon: IconAdjustments,
    title: 'Flexible Protection Plans',
    description:
      'Mix and match coverage across life, health, savings, and family plans to build the protection package that fits your life.',
  },
];

export const stats: Stat[] = [
  { value: '15K+', label: 'Protected Clients', icon: IconUsers },
  { value: '98%', label: 'Claim Support Satisfaction', icon: IconStar },
  { value: '24/7', label: 'Customer Assistance', icon: IconHeadset },
  { value: '10+', label: 'Years of Advisory Experience', icon: IconAward },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Linda Thornton',
    role: 'Mother of Two, Health Plan Client',
    content:
      'Switching to SecureLife was the best decision I made for my family. The health plan covers everything we need and the advisor was patient and incredibly clear.',
    rating: 5,
  },
  {
    id: 2,
    name: 'David Osei',
    role: 'Self-Employed, Life & Savings Client',
    content:
      'As a freelancer without an employer plan, I was worried about coverage. SecureLife helped me build a custom bundle that covers life, retirement, and savings in one policy.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Margaret Lim',
    role: 'Retiree, Retirement Planning Client',
    content:
      "I started my retirement plan late but SecureLife's advisors helped me maximise what I had. I feel genuinely secure about the years ahead — and that means everything.",
    rating: 5,
  },
];

export const footerSections: FooterSection[] = [
  {
    title: 'Insurance',
    links: [
      { label: 'Life Insurance', href: '#plans' },
      { label: 'Health Insurance', href: '#plans' },
      { label: 'Family Protection', href: '#plans' },
      { label: 'Retirement Planning', href: '#plans' },
      { label: 'Savings Plan', href: '#plans' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Our Advisors', href: '#about' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'File a Claim', href: '#claims' },
      { label: 'Help Centre', href: '#' },
      { label: 'Contact Us', href: '#contact' },
      { label: 'Privacy Policy', href: '#' },
    ],
  },
];

export const contactDetails = [
  { icon: IconPhone, text: '+1 (800) 555-0199' },
  { icon: IconMail, text: 'support@securelife.com' },
  { icon: IconMapPin, text: '123 Finance Ave, New York, NY 10001' },
] as const;
