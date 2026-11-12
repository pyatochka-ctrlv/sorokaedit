export type CoreRole = 'thought' | 'reason' | 'example';

/** Приховані від дитини типи речень. */
export type SegmentType =
  | 'thought'
  | 'reason'
  | 'example'
  | 'digression' // відступ: цікаво, але про інше
  | 'repeat' // повтор потрібної репліки іншими словами
  | 'general' // «усі знають»
  | 'hedge' // вагання
  | 'trap'; // пастка: маркер є, а доказу немає

export type MarkerType = CoreRole | null;

export interface Segment {
  type: SegmentType;
  text: string;
  /** Для repeat: яку потрібну репліку дублює. */
  repeatOf?: CoreRole;
}

export interface TrapOption {
  text: string;
  correct: boolean;
}

export interface NewsItem {
  id: number;
  title: string;
  segments: Segment[];
  /** Яку частину формули підміняє пастка. */
  trapReplaceAs: CoreRole;
  trapOptions: TrapOption[];
}

export interface SentenceCard {
  id: string;
  text: string;
  originalType: SegmentType;
  currentType: SegmentType | 'custom';
  marker: MarkerType;
  repeatOf?: CoreRole;
  isCustom?: boolean;
  replacedType?: CoreRole;
  isReplaced?: boolean;
}

export type WizardStep = 1 | 2 | 3 | 4;

export interface WizardValidation {
  isValid: boolean;
  stepToReturn?: WizardStep;
  title: string;
  message: string;
}
