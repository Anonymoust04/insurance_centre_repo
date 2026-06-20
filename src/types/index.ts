import type { ComponentType, ReactNode } from 'react';

export type TablerIcon = ComponentType<{
  size?: number;
  className?: string;
  stroke?: number | string;
  color?: string;
}>;

export interface NavItem {
  label: string;
  href: string;
}

export interface InsurancePlan {
  id: string;
  icon: TablerIcon;
  title: string;
  description: string;
}

export interface WhyChooseItem {
  icon: TablerIcon;
  title: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
  icon: TablerIcon;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
  endAdornment?: ReactNode;
  required?: boolean;
}
