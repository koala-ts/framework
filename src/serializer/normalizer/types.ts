export interface NormalizedRecord {
  [key: string]: NormalizedValue;
}

export type NormalizedArray = NormalizedValue[];

export type NormalizedValue = string | number | boolean | null | NormalizedRecord | NormalizedArray;

export interface PropertyMetadata {
  ignore?: boolean;
  groups?: string[];
  serializedName?: string;
  metadata?: Metadata;
}

export type Metadata = Record<string, PropertyMetadata>;

export interface NormalizerContext {
  groups?: string[];
  metadata?: Metadata;
}

export type Normalizer<From = unknown, To = NormalizedValue> = (input: From, context?: NormalizerContext) => To;
