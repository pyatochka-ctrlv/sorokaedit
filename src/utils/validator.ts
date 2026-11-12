import { NewsItem, SentenceCard, WizardValidation } from '../types';
import {
  calculateCardsDuration,
  getCardRole,
  getMissingRoles,
  hasDuplicatePair,
  isWaterCard
} from '../data/newsData';

/**
 * Змістова перевірка перед ефіром — за прихованими типами речень, а не за першим словом.
 * Повертає ОДНУ підказку за пріоритетом:
 * дві схожі репліки → важливе вирізано → лишилась вода → лишилась пастка → порядок → маркери → тривалість.
 */
export function validateWizard(
  news: NewsItem,
  feedCards: SentenceCard[],
  _binCards: SentenceCard[]
): WizardValidation {
  // 0. Лишились і оригінал, і повтор (тоді одна з частин неминуче в кошику)
  if (hasDuplicatePair(feedCards)) {
    return {
      isValid: false,
      stepToReturn: 1,
      title: 'Лишилось дві схожі репліки, обери одну',
      message: 'Дві репліки кажуть те саме різними словами. Залиш ту, що подобається більше, а іншу виріж.'
    };
  }

  // 1. Важливе вирізано: бракує думки, причини чи прикладу (або їхніх замін/повторів)
  if (getMissingRoles(feedCards, news).length > 0) {
    return {
      isValid: false,
      stepToReturn: 1,
      title: 'Одна важлива репліка в кошику',
      message:
        'Здається, у кошику лежить репліка, без якої формула не складеться. Зазирни в кошик і поверни її в стрічку!'
    };
  }

  // 2. Лишилась «вода»
  if (feedCards.some(isWaterCard)) {
    return {
      isValid: false,
      stepToReturn: 1,
      title: 'У сюжеті ще є «вода»',
      message:
        'Одне речення не відповідає ні на «що я думаю?», ні на «чому?», ні на «як це буває?». Знайди його й виріж ✂️'
    };
  }

  // 3. Лишилась пастка
  if (feedCards.some((c) => c.currentType === 'trap' && !c.isReplaced)) {
    return {
      isValid: false,
      stepToReturn: 2,
      title: 'Пастка ще в ефірі',
      message:
        'Одне речення звучить так, ніби воно до теми, але нічого не доводить. Заміни його на кроці 2 🔁'
    };
  }

  // 4. Порядок: думка → причина → приклад
  const roles = feedCards.map((c) => getCardRole(c, news));
  if (roles.length !== 3 || roles[0] !== 'thought' || roles[1] !== 'reason' || roles[2] !== 'example') {
    return {
      isValid: false,
      stepToReturn: 3,
      title: 'Переставимо репліки?',
      message:
        'Золоте правило Сорока ТВ: спочатку що я думаю 💡, потім чому 🔑, а наприкінці — приклад 📸. Перестав картки стрілочками ⬆ ⬇'
    };
  }

  // 5. Маркери мають збігатися з тим, на яке питання відповідає репліка
  if (feedCards.some((c) => !c.marker)) {
    return {
      isValid: false,
      stepToReturn: 4,
      title: 'Постав маркери',
      message: 'Познач кожну репліку значком: 💡 Думка, 🔑 Чому, 📸 Приклад.'
    };
  }
  if (feedCards.some((c, i) => c.marker !== roles[i])) {
    return {
      isValid: false,
      stepToReturn: 4,
      title: 'Перевір маркери',
      message:
        'Один значок стоїть не на своєму місці. Подивись не на перше слово, а на питання, на яке відповідає речення.'
    };
  }

  // 6. Тривалість ≤ 30 с
  const duration = calculateCardsDuration(feedCards);
  if (duration > 30) {
    return {
      isValid: false,
      stepToReturn: 1,
      title: 'Ще трохи довгувато',
      message: `Зараз виходить ${Math.round(duration)} с, а в ефір вміщається 30 с. Спробуй сказати коротше.`
    };
  }

  return {
    isValid: true,
    title: 'Чудово!',
    message: 'Сюжет готовий до ефіру!'
  };
}
