export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export interface FeatureProps {
  name: string;
  desc: string;
  stack: string[];
  links: string[][];
  images: string[];
}