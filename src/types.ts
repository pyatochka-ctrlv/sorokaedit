export type SegmentType = 'thought' | 'reason' | 'example' | 'water' | 'trap';

export type MarkerType = 'thought' | 'reason' | 'example' | null;

export interface Segment {
  type: SegmentType;
  text: string;
}

export interface TrapOption {
  text: string;
  correct: boolean;
}

export interface NewsItem {
  id: number;
  title: string;
  segments: Segment[];
  trapReplaceAs?: 'thought' | 'reason' | 'example';
  trapOptions?: TrapOption[];
}

export interface SentenceCard {
  id: string;
  text: string;
  originalType: SegmentType;
  currentType: SegmentType | 'custom';
  marker: MarkerType;
  isCustom?: boolean;
  replacedType?: 'thought' | 'reason' | 'example';
  isReplaced?: boolean;
}

export type WizardStep = 1 | 2 | 3 | 4;

export interface WizardValidation {
  isValid: boolean;
  stepToReturn?: WizardStep;
  title: string;
  message: string;
}
