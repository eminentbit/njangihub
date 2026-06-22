export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export interface TestimonialProps {
  content: string;
  author: string;
  role: string;
  image: string;
}

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface PricingTierProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
  ctaText: string;
}

export interface FAQItemProps {
  question: string;
  answer: string;
}