export type MetalKey = 'gold_18k' | 'rose_gold' | 'platinum_950' | 'noir_bronze';
export type GemstoneKey = 'diamond_flawless' | 'emerald_muzo' | 'sapphire_ceylon' | 'ruby_pigeon' | 'onyx_stellar';

export interface BespokeConfig {
  ringId: string;
  metal: MetalKey;
  gemstone: GemstoneKey;
  carats: number;
  ringSize: number;
  engravingText?: string;
  previewThumbnailUrl?: string;
}

export interface CartItemDTO {
  id: string;
  title: string;
  priceCOP: number;
  quantity: number;
  isBespoke: boolean;
  bespokeConfig?: BespokeConfig;
}

export interface WompiCheckoutPayload {
  orderId: string;
  amountInCents: number;
  currency: 'COP';
  customerEmail: string;
  customerName?: string;
}

export interface WompiInitResponse {
  publicKey: string;
  currency: 'COP';
  amountInCents: number;
  reference: string;
  signatureHex: string;
  redirectUrl: string;
}