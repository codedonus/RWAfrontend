import { BigNumberish, CairoCustomEnum } from "starknet";

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

type Issuer = {
  name: string,
  contact: string,
  certification: string,
}

export enum AssetType {
  Cash = "Cash",
  Commodity = "Commodity",
  Stock = "Stock",
  Bond = "Bond",
  Credit = "Credit",
  Art = "Art",
  IntellectualProperty = "IntellectualProperty",
}

type Valuation = {
  currency: string,
  amount: BigNumberish,
}

type Document = {
  document_name: string,
  document_type: string,
  document_url: string,
}

type AssetDetails = {
  location: string,
  legal_status: string,
  valuation: Valuation,
  issued_date: string,
  expiry_date: string,
  condition: string,
  dimensions: string,
  material: string,
  color: string,
  historical_significance: string,
  document: Document,
}

type Owner = {
  name: string,
  contact: string,
}

type RoyaltyInfo = {
  recipient: BigNumberish,
  percentage: BigNumberish,
}
export type RWAType = {
  name: string,
  description: string,
  image: string,
  external_url: string,
  asset_id: string,
  issuer: Issuer,
  asset_type: CairoCustomEnum,
  asset_details: AssetDetails,
  current_owner: Owner,
  royalty_info: RoyaltyInfo,
  legal_jurisdiction: string,
  disclaimer: string,
}

export type FieldType = {
  name: string,
  description: string,
  image: string,
  external_url: string,
  asset_id: string,
  issuer: Issuer,
  asset_type: string,
  asset_details: AssetDetails,
  current_owner: Owner,
  royalty_info: RoyaltyInfo,
  legal_jurisdiction: string,
  disclaimer: string,
}
