import { RWAType } from "@/types";

export const formatBigNumber = (value: any): string => {
  try {
    return BigInt(value.toString()).toString();
  } catch (error) {
    return 'Invalid BigNumber';
  }
}

export const formatAddress = (address: any): string => {
  try {
    return `0x${BigInt(address.toString()).toString(16)}`;
  } catch (error) {
    return 'Invalid Address';
  }
}

export const formatMetadataValue = (value: any): string => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'object' && 'activeVariant' in value) {
    return value.activeVariant();
  }
  if (typeof value === 'object' && 'type' in value && value.type === 'BigInt') {
    return formatBigNumber(value);
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
};
