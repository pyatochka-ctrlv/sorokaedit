import { CoreRole, NewsItem, SegmentType, SentenceCard } from '../types';

// Типи речень приховані від дитини: їх бачить лише перевірка.
export const NEWS_LIST: NewsItem[] = [
  {
    id: 1,
    title: "Морозиво офіційно визнали сніданком",
    trapReplaceAs: 'reason',
    trapOptions: [
      { text: "Бо зранку тілу потрібно щось ситне, а від холодного солодкого швидко знову хочеться їсти.", correct: true },
      { text: "Бо сніданок дуже важливий, і його треба їсти щодня.", correct: false },
      { text: "Бо морозиво буває різних смаків і дуже гарно виглядає.", correct: false },
    ],
    segments: [
      { type: 'digression', text: "Наприклад, минулого літа на морі я куштував морозиво зі смаком кавуна." },
      { type: 'thought', text: "Я думаю, що сніданок із морозива — це погана ідея." },
      { type: 'trap', text: "Бо морозиво взагалі люблять усі діти." },
      { type: 'repeat', repeatOf: 'thought', text: "Я вважаю, що на сніданок морозиво не підходить." },
      { type: 'example', text: "Наприклад, у суботу мама дозволила з'їсти морозиво зранку, і вже на другому уроці в мене бурчало в животі." },
      { type: 'general', text: "Їжа ж буває дуже різна." },
      { type: 'digression', text: "Якось мій дідусь приготував найкращий пломбір у світі." },
      { type: 'hedge', text: "Хоча, можливо, комусь і сподобається." },
    ]
  },
  {
    id: 2,
    title: "У школах дозволили приходити в піжамах щоп'ятниці",
    trapReplaceAs: 'reason',
    trapOptions: [
      { text: "Бо в зручному одязі менше відволікаєшся і легше слухати вчителя.", correct: true },
      { text: "Бо школа — це місце, де кожен має почуватися добре.", correct: false },
      { text: "Бо п'ятниця — останній день тижня, і всі вже втомилися.", correct: false },
    ],
    segments: [
      { type: 'digression', text: "Наприклад, моя сестра має піжаму з єдинорогами й нікому її не показує." },
      { type: 'example', text: "Якось у таборі ми ночували в піжамах, і ніхто не нервував, усі жартували." },
      { type: 'thought', text: "Мені здається, що піжамні п'ятниці — чудова ідея." },
      { type: 'repeat', repeatOf: 'thought', text: "Я вважаю, що такі п'ятниці точно варто зробити." },
      { type: 'trap', text: "Бо піжами в магазинах продають дуже різні." },
      { type: 'general', text: "П'ятниця — особливий день, це відомо." },
      { type: 'digression', text: "А ще я зазвичай не хочу вставати в понеділок." },
      { type: 'hedge', text: "Хоча комусь це може здатися дивним." },
    ]
  },
  {
    id: 3,
    title: "Коти вимагають права голосу на виборах старости класу",
    trapReplaceAs: 'reason',
    trapOptions: [
      { text: "Бо вони живуть у нашій школі й теж впливають на те, що в ній відбувається.", correct: true },
      { text: "Бо коти — розумні тварини, їх навіть показують у цирку.", correct: false },
      { text: "Бо староста вирішує багато питань, тому голосувати важливо.", correct: false },
    ],
    segments: [
      { type: 'example', text: "Наприклад, наш шкільний кіт Мурзик щоразу приходить на збори й сидить на першій парті." },
      { type: 'digression', text: "Якось мій хом'як спробував утекти з клітки просто під час виборів." },
      { type: 'thought', text: "Я думаю, що котам варто дати право голосу." },
      { type: 'repeat', repeatOf: 'thought', text: "Я вважаю, що нехай і вони колись проголосують." },
      { type: 'trap', text: "Бо коти дуже пухнасті й чудово муркочуть." },
      { type: 'general', text: "Вибори — це завжди непроста справа." },
      { type: 'digression', text: "Наприклад, у моєї бабусі була кішка, яка вміла відкривати двері." },
      { type: 'hedge', text: "Хоча старостою кіт, мабуть, не стане." },
    ]
  },
  {
    id: 4,
    title: "Домашні завдання тепер задають батькам",
    trapReplaceAs: 'reason',
    trapOptions: [
      { text: "Бо дорослі побачать, як це — вчитися, і краще зрозуміють нас.", correct: true },
      { text: "Бо діти й так багато вчаться, тому їм потрібно більше відпочивати.", correct: false },
      { text: "Бо батьки старші, тому вони знають більше за дітей.", correct: false },
    ],
    segments: [
      { type: 'digression', text: "Наприклад, у мого друга тато водить тролейбус, а мама працює лікаркою." },
      { type: 'thought', text: "Мені здається, що домашка для батьків — це смішна й корисна ідея." },
      { type: 'trap', text: "Бо домашка буває і велика, і маленька." },
      { type: 'example', text: "Наприклад, вчора тато сам сів розв'язувати мою задачу й визнав, що давно забув, як це робиться." },
      { type: 'repeat', repeatOf: 'thought', text: "Я вважаю, що це непогана ідея для сімей." },
      { type: 'general', text: "Домашку не хоче робити жоден школяр." },
      { type: 'hedge', text: "Хоча батьки, напевно, будуть незадоволені." },
      { type: 'digression', text: "Якось на вихідні мені задали домашку на три сторінки — це було найгірше." },
    ]
  },
  {
    id: 5,
    title: "Уроки скоротили до 10 хвилин, а перерву подовжили до години",
    trapReplaceAs: 'example',
    trapOptions: [
      { text: "Наприклад, на малюванні я за десять хвилин встигаю лише дістати фарби, а вже дзвінок.", correct: true },
      { text: "Наприклад, на перерві я зазвичай граю з друзями у футбол.", correct: false },
      { text: "Наприклад, мій брат навчається в іншій школі, там уроки по сорок п'ять хвилин.", correct: false },
    ],
    segments: [
      { type: 'digression', text: "Наприклад, наш дзвоник такий гучний, що в сусідньому класі підстрибують." },
      { type: 'thought', text: "Я думаю, що такі короткі уроки — погана ідея." },
      { type: 'reason', text: "Бо десяти хвилин замало, щоб справді щось зрозуміти." },
      { type: 'repeat', repeatOf: 'thought', text: "Я проти того, щоб уроки були такими короткими." },
      { type: 'trap', text: "Наприклад, я взагалі люблю малювати, особливо фарбами." },
      { type: 'general', text: "Година — це ж дуже довго." },
      { type: 'digression', text: "Якось на перерві ми цілу годину грали у футбол." },
      { type: 'hedge', text: "Хоча довга перерва — теж непогано." },
    ]
  },
  {
    id: 6,
    title: "Телефони вимикатимуться самі, якщо граєш більше години",
    trapReplaceAs: 'reason',
    trapOptions: [
      { text: "Бо сам не завжди помічаєш, скільки минуло часу, а так телефон вчасно змусить зупинитися.", correct: true },
      { text: "Бо ігри бувають дуже різні — і веселі, і складні.", correct: false },
      { text: "Бо багато дорослих теж постійно сидять у телефонах.", correct: false },
    ],
    segments: [
      { type: 'digression', text: "Наприклад, у мене телефон із тріснутим екраном, бо я його вчора впустив." },
      { type: 'thought', text: "Мені здається, що така функція була б дуже корисною." },
      { type: 'example', text: "Наприклад, одного разу я грав до півночі, а зранку проспав школу." },
      { type: 'repeat', repeatOf: 'thought', text: "Я вважаю, що такому нововведенню варто радіти." },
      { type: 'trap', text: "Бо нові телефони коштують чимало грошей." },
      { type: 'general', text: "Зараз усі постійно сидять у телефонах." },
      { type: 'digression', text: "Якось мій брат сказав, що все одно вигадав би, як це обійти." },
      { type: 'hedge', text: "Хоча хтось, мабуть, образиться на такі правила." },
    ]
  },
  {
    id: 7,
    title: "Кожен клас отримає дракона-чергового",
    trapReplaceAs: 'thought',
    trapOptions: [
      { text: "Я думаю, що дракон-черговий — класна ідея для кожного класу.", correct: true },
      { text: "Я думаю, що я хотів би побачити справжнього дракона з крилами.", correct: false },
      { text: "Мені здається, що фантастичні історії про драконів дуже цікаві.", correct: false },
    ],
    segments: [
      { type: 'digression', text: "Якось я дивився мультик, де дракон дружив із хлопчиком." },
      { type: 'trap', text: "Я думаю, що дракони — дуже цікаві істоти." },
      { type: 'reason', text: "Бо він міг би робити роботу, яку ніхто в класі не любить." },
      { type: 'example', text: "Наприклад, у нас ніхто не хоче витирати дошку й поливати квіти." },
      { type: 'repeat', repeatOf: 'reason', text: "Тому що такий помічник у класі точно не завадив би." },
      { type: 'general', text: "Казкові істоти подобаються всім." },
      { type: 'digression', text: "Наприклад, квіти в нас у класі, до речі, давно засохли." },
      { type: 'hedge', text: "Хоча дракон, мабуть, спалив би дошку." },
    ]
  },
  {
    id: 8,
    title: "Понеділок переносять на неділю",
    trapReplaceAs: 'reason',
    trapOptions: [
      { text: "Бо тоді в нас лишиться лише один вихідний, і відпочити буде ніколи.", correct: true },
      { text: "Бо неділя — день, коли всі відпочивають.", correct: false },
      { text: "Бо понеділок важкий, адже після вихідних не хочеться вставати.", correct: false },
    ],
    segments: [
      { type: 'thought', text: "Мені здається, що ідея з понеділком у неділю — погана." },
      { type: 'digression', text: "Наприклад, з вишнями вареники в бабусі виходять смачніші, ніж із картоплею." },
      { type: 'trap', text: "Бо понеділок і так не найулюбленіший день тижня." },
      { type: 'example', text: "Наприклад, щонеділі ми всією родиною їдемо до бабусі, а в понеділок усі зайняті." },
      { type: 'repeat', repeatOf: 'thought', text: "Я вважаю, що понеділок має залишитися там, де був." },
      { type: 'general', text: "У тижні ж сім днів, це відомо кожному." },
      { type: 'digression', text: "Якось я вивчив усі дні тижня ще в першому класі." },
      { type: 'hedge', text: "Хоча, можливо, ми б швидко звикли." },
    ]
  },
  {
    id: 9,
    title: "Брокколі тепер на смак як шоколад",
    trapReplaceAs: 'example',
    trapOptions: [
      { text: "Наприклад, мій молодший брат ніколи не їсть брокколі, а шоколад — завжди, тож з'їв би все.", correct: true },
      { text: "Наприклад, моя бабуся щоліта вирощує брокколі на городі.", correct: false },
      { text: "Наприклад, на шкільному обіді мені давали брокколі з куркою.", correct: false },
    ],
    segments: [
      { type: 'digression', text: "Якось я думав, що брокколі — це маленькі дерева для ляльок." },
      { type: 'thought', text: "Я думаю, що це чудовий винахід, і я його підтримую." },
      { type: 'reason', text: "Бо діти почнуть їсти більше овочів і стануть здоровішими." },
      { type: 'trap', text: "Наприклад, брокколі зазвичай зелена й росте на грядках." },
      { type: 'repeat', repeatOf: 'thought', text: "Я вважаю, що така брокколі точно всім сподобається." },
      { type: 'general', text: "Овочі корисні для кожного." },
      { type: 'digression', text: "Наприклад, шоколад буває білий, чорний і з горіхами." },
      { type: 'hedge', text: "Хоча сам я більше люблю моркву." },
    ]
  },
  {
    id: 10,
    title: "Контрольні тепер пишуть учителі, а учні перевіряють",
    trapReplaceAs: 'reason',
    trapOptions: [
      { text: "Бо коли перевіряєш чужу роботу, сам краще розумієш тему.", correct: true },
      { text: "Бо вчителі втомлюються, коли перевіряють багато зошитів.", correct: false },
      { text: "Бо учні знають, які завдання здаються найскладнішими.", correct: false },
    ],
    segments: [
      { type: 'trap', text: "Бо вчителі — дорослі люди, які багато знають." },
      { type: 'thought', text: "Мені здається, що це цікава ідея." },
      { type: 'example', text: "Наприклад, коли я пояснював сестрі задачу, то сам зрозумів її краще." },
      { type: 'digression', text: "Якось у вівторок ми писали контрольну з математики." },
      { type: 'repeat', repeatOf: 'thought', text: "Я вважаю, що перевіряти такі роботи було б цікаво." },
      { type: 'general', text: "Контрольні не любить ніхто." },
      { type: 'digression', text: "Наприклад, мені дістався варіант із дуже довгою задачею про потяги." },
      { type: 'hedge', text: "Хоча вчителі, мабуть, усе напишуть на відмінно." },
    ]
  },
  {
    id: 11,
    title: "У місті запустили автобус, який їде туди, куди хочуть діти",
    trapReplaceAs: 'thought',
    trapOptions: [
      { text: "Я думаю, що це найкраща новина цього тижня.", correct: true },
      { text: "Я думаю, що двоповерхові автобуси — це дуже цікаво.", correct: false },
      { text: "Мені здається, що їздити містом приємно.", correct: false },
    ],
    segments: [
      { type: 'digression', text: "Якось я бачив двоповерховий автобус лише на картинці." },
      { type: 'trap', text: "Я думаю, що автобуси бувають жовті, червоні й сині." },
      { type: 'reason', text: "Бо діти рідко самі вирішують, куди поїхати." },
      { type: 'example', text: "Наприклад, мені б одразу захотілося поїхати в зоопарк подивитися на жирафів." },
      { type: 'repeat', repeatOf: 'reason', text: "Тому що вибір маршруту дітям зазвичай не довіряють." },
      { type: 'general', text: "Подорожі люблять усі." },
      { type: 'digression', text: "Наприклад, у нас нещодавно відкрили нову зупинку." },
      { type: 'hedge', text: "Хоча водієві, мабуть, буде нелегко." },
    ]
  },
  {
    id: 12,
    title: "Дітям дозволили приходити на уроки в костюмах супергероїв",
    trapReplaceAs: 'reason',
    trapOptions: [
      { text: "Бо в костюмі почуваєшся сміливішим і легше відповідаєш біля дошки.", correct: true },
      { text: "Бо супергерої завжди допомагають людям і захищають слабших.", correct: false },
      { text: "Бо костюми бувають різні: плащі, маски й навіть щити.", correct: false },
    ],
    segments: [
      { type: 'thought', text: "Я думаю, що це чудова новина для школи." },
      { type: 'digression', text: "Наприклад, мій костюм Людини-павука став малий, і мама хоче його віддати." },
      { type: 'trap', text: "Бо костюми продаються майже в кожному магазині." },
      { type: 'example', text: "Наприклад, на святі в костюмі я не боявся вийти на сцену." },
      { type: 'repeat', repeatOf: 'thought', text: "Я вважаю, що так було б чудово щодня." },
      { type: 'general', text: "Супергерої подобаються майже всім." },
      { type: 'digression', text: "Якось я мріяв, що вмію літати, як найкращий супергерой." },
      { type: 'hedge', text: "Хоча на фізкультурі в плащі, мабуть, незручно." },
    ]
  }
];

// Перетворює новину на 8 сирих карток (без злиття — кожне речення окремо).
export function createInitialSentenceCards(news: NewsItem): SentenceCard[] {
  return news.segments.map((seg, idx) => ({
    id: `card_${news.id}_${idx}_${Math.random().toString(36).substring(2, 7)}`,
    text: seg.text,
    originalType: seg.type,
    currentType: seg.type,
    repeatOf: seg.repeatOf,
    marker: null,
    isCustom: false
  }));
}

/** Типи «води»: відступ, «усі знають», вагання. */
export const WATER_TYPES: SegmentType[] = ['digression', 'general', 'hedge'];

export function isWaterCard(card: SentenceCard): boolean {
  return !card.isReplaced && WATER_TYPES.includes(card.currentType as SegmentType);
}

/**
 * Яку частину формули реально «закриває» картка:
 * - думка/причина/приклад — саму себе;
 * - повтор — ту частину, яку дублює;
 * - пастка (ще не замінена) — частину, яку підміняє;
 * - замінена пастка або свій варіант — replacedType;
 * - «вода» — нічого.
 */
export function getCardRole(card: SentenceCard, news: NewsItem): CoreRole | null {
  if (card.isReplaced && card.replacedType) return card.replacedType;
  switch (card.currentType) {
    case 'thought':
    case 'reason':
    case 'example':
      return card.currentType;
    case 'repeat':
      return card.repeatOf ?? null;
    case 'trap':
      return news.trapReplaceAs;
    default:
      return null;
  }
}

/** Яких частин формули бракує серед карток. */
export function getMissingRoles(cards: SentenceCard[], news: NewsItem): CoreRole[] {
  const present = new Set(cards.map((c) => getCardRole(c, news)));
  return (['thought', 'reason', 'example'] as CoreRole[]).filter((r) => !present.has(r));
}

/** Чи лишились і оригінал, і його повтор одночасно. */
export function hasDuplicatePair(cards: SentenceCard[]): boolean {
  return cards.some(
    (rep) =>
      rep.currentType === 'repeat' &&
      cards.some((orig) => orig.currentType === rep.repeatOf && !orig.isReplaced)
  );
}

/** Перемішує масив (Фішер — Єйтс), не змінюючи оригінал. */
export function shuffled<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Швидкість читання вголос: 2 слова на секунду. */
export const WORDS_PER_SECOND = 2;

// Рахуємо лише слова з літерами чи цифрами (тире «—» не слово).
export function getWordCount(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

export function calculateTextDuration(text: string): number {
  return Number((getWordCount(text) / WORDS_PER_SECOND).toFixed(1));
}

export function calculateCardsDuration(cards: SentenceCard[]): number {
  const totalWords = cards.reduce((sum, c) => sum + getWordCount(c.text), 0);
  return Number((totalWords / WORDS_PER_SECOND).toFixed(1));
}

export function formatTimecode(seconds: number): string {
  const rounded = Math.round(seconds);
  const m = Math.floor(rounded / 60);
  const s = rounded % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
