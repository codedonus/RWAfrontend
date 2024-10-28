
import { AssetType, type RWAType } from "@/types";
import { CairoCustomEnum } from "starknet";

export const defaultRWAMetadata: RWAType = {
  name: '',
  description: '',
  image: '',
  external_url: '',
  asset_id: '',
  issuer: {
    name: '',
    contact: '',
    certification: ''
  },
  asset_type: new CairoCustomEnum({ [AssetType.Art]: {} }),
  asset_details: {
    location: '',
    legal_status: '',
    valuation: {
      currency: '',
      amount: 0
    },
    issued_date: '',
    expiry_date: '',
    condition: '',
    dimensions: '',
    material: '',
    color: '',
    historical_significance: '',
    document: {
      document_name: '',
      document_type: '',
      document_url: ''
    }
  },
  current_owner: {
    name: '',
    contact: ''
  },
  royalty_info: {
    recipient: 'none',
    percentage: 0
  },
  legal_jurisdiction: '',
  disclaimer: ''
};