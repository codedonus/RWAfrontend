export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export interface FeatureProps {
  name: string;
  desc: string;
  stack: string[];
  links: string[][];
  images: string[];
}

export interface AssetProps {
  tokenId: string;
}

export interface AssetPageProps {
  params: {
    tokenId: string;
  }
}
