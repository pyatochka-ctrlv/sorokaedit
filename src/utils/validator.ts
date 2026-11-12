import { NewsItem, SentenceCard, WizardValidation } from '../types';
import { calculateCardsDuration } from '../data/newsData';

export function validateWizard(
  news: NewsItem,
  feedCards: SentenceCard[],
  binCards: SentenceCard[]
): WizardValidation {
  // 1. Priority 1: Important cut (важливе вирізано)
  const nonTrapCoreTypes: ('thought' | 'reason' | 'example')[] = ['thought', 'reason', 'example'];
  const vitalTypes = nonTrapCoreTypes.filter((t) => t !== news.trapReplaceAs);

  // Check if any vital type was put into bin
  const hasVitalInBin = binCards.some((c) => vitalTypes.includes(c.originalType as 'thought' | 'reason' | 'example'));
  if (hasVitalInBin || feedCards.length < 3) {
    return {
      isValid: false,
      stepToReturn: 1,
      title: 'Ой, це важливе!',
      message: 'Здається, у кошику лежить важлива частина думки чи прикладу. Поверни її назад у стрічку.'
    };
  }

  // 2. Priority 2: Water remaining (лишилася вода)
  const hasWater = feedCards.some((c) => c.currentType === 'water');
  if (hasWater) {
    return {
      isValid: false,
      stepToReturn: 1,
      title: 'У сюжеті ще є зайве',
      message: 'Тут залишилося балакуче речення («вода»), яке нічого не пояснює. Виріж його!'
    };
  }

  // 3. Priority 3: Trap remaining (лишилася пастка)
  const hasTrap = feedCards.some((c) => c.currentType === 'trap' && !c.isReplaced);
  if (hasTrap) {
    return {
      isValid: false,
      stepToReturn: 2,
      title: 'Залишилася пастка',
      message: 'Це речення звучить схоже на тему, але не доводить думку. Заміни його на кроці 2!'
    };
  }

  // Helper to determine effective type of each card
  const getCardType = (c: SentenceCard): 'thought' | 'reason' | 'example' | 'other' => {
    if (c.replacedType) return c.replacedType;
    if (c.currentType === 'thought' || c.currentType === 'reason' || c.currentType === 'example') {
      return c.currentType;
    }
    return 'other';
  };

  // 4. Priority 4: Order (порядок: думка -> причина -> приклад)
  const cardTypes = feedCards.map(getCardType);
  if (
    cardTypes.length !== 3 ||
    cardTypes[0] !== 'thought' ||
    cardTypes[1] !== 'reason' ||
    cardTypes[2] !== 'example'
  ) {
    return {
      isValid: false,
      stepToReturn: 3,
      title: 'Порядок частин',
      message: 'Золоте правило Сорока ТВ: спочатку Що я думаю 💡, потім Чому 🔑, а наприкінці — Приклад 📸. Перестав картки стрілочками ⬆ ⬇!'
    };
  }

  // 5. Priority 5: Markers (маркери)
  const hasMissingMarker = feedCards.some((c) => !c.marker);
  if (hasMissingMarker) {
    return {
      isValid: false,
      stepToReturn: 4,
      title: 'Постав маркери',
      message: 'Познач кожен кадр значком телеканалу: 💡 Думка, 🔑 Чому, 📸 Приклад.'
    };
  }

  if (
    feedCards[0].marker !== 'thought' ||
    feedCards[1].marker !== 'reason' ||
    feedCards[2].marker !== 'example'
  ) {
    return {
      isValid: false,
      stepToReturn: 4,
      title: 'Перевір маркери',
      message: 'Перша картка має бути 💡 Думка, друга — 🔑 Чому, третя — 📸 Приклад.'
    };
  }

  // 6. Priority 6: Duration <= 30s
  const duration = calculateCardsDuration(feedCards);
  if (duration > 30) {
    return {
      isValid: false,
      stepToReturn: 1,
      title: 'Ще трохи довгувато',
      message: `Зараз тривалість ${duration} с (ціль: до 30 с). Перевір, чи немає зайвих слів.`
    };
  }

  return {
    isValid: true,
    title: 'Чудово!',
    message: 'Сюжет готовий до ефіру!'
  };
}
