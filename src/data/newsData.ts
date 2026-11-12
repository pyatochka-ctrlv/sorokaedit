import { NewsItem, SentenceCard } from '../types';

export const NEWS_LIST: NewsItem[] = [
  {
    id: 1,
    title: 'Морозиво офіційно визнали сніданком',
    trapReplaceAs: 'reason',
    trapOptions: [
      { text: 'Бо зранку треба поїсти щось ситне, щоб мати сили до обіду.', correct: true },
      { text: 'Бо я люблю пломбір.', correct: false },
      { text: 'Бо в магазині багато морозива.', correct: false }
    ],
    segments: [
      { type: 'water', text: 'Ну от, значить, сьогодні Сорока принесла новину, і я тут подумав, ну, про морозиво, бо я взагалі люблю думати про їжу.' },
      { type: 'example', text: "Якось я з'їв на сніданок тільки печиво, і на математиці думав лише про обід." },
      { type: 'water', text: 'А ще в нас у холодильнику завжди є морозиво, ванільне і шоколадне, і ще якесь фісташкове, але його ніхто не їсть.' },
      { type: 'thought', text: 'Я думаю, що це погана ідея.' },
      { type: 'trap', text: 'Бо морозиво дуже смачне.' },
      { type: 'water', text: 'Ну, загалом, от так, коротше, морозиво — це морозиво.' }
    ]
  },
  {
    id: 2,
    title: "У школах дозволили приходити в піжамах щоп'ятниці",
    trapReplaceAs: 'example',
    trapOptions: [
      { text: 'Наприклад, на піжамній вечірці в таборі всі були веселіші й спокійніші.', correct: true },
      { text: 'Наприклад, піжами бувають з котиками.', correct: false },
      { text: 'Наприклад, я сплю в піжамі.', correct: false }
    ],
    segments: [
      { type: 'water', text: 'Слухайте, ну, піжами, вони такі, ну, піжами, у кожного є піжама, у мене навіть дві.' },
      { type: 'reason', text: 'Бо в зручному одязі легше зосередитися на уроці, і ніщо не тисне.' },
      { type: 'water', text: 'А моя сестра каже, що піжами — це для малих, але сама спить у піжамі з єдинорогами, я бачив.' },
      { type: 'thought', text: 'Я за таку ідею.' },
      { type: 'trap', text: 'У мене піжама з динозаврами, зелена.' },
      { type: 'water', text: 'Ну от, загалом, усе, що я хотів сказати, ну, майже все.' }
    ]
  },
  {
    id: 3,
    title: 'Коти вимагають права голосу на виборах старости класу',
    trapReplaceAs: 'reason',
    trapOptions: [
      { text: 'Бо вони теж живуть у школі й знають, що там відбувається.', correct: true },
      { text: 'Бо коти люблять рибу.', correct: false },
      { text: 'Бо котів багато.', correct: false }
    ],
    segments: [
      { type: 'thought', text: 'Я думаю, котам можна дати голос на виборах старости.' },
      { type: 'water', text: 'Ну, коти, вони, знаєте, такі пухнасті, і от у бабусі був кіт Мурчик, але це було давно, я тоді ще в садочок ходив.' },
      { type: 'trap', text: 'Бо коти бувають руді й сірі.' },
      { type: 'water', text: "А ще в мене є хом'як, але він не кіт, тому він, мабуть, не голосуватиме, хоча хто знає." },
      { type: 'example', text: 'Наприклад, наш шкільний кіт завжди приходить на збори класу й уважно слухає.' },
      { type: 'water', text: 'Ну от, коротше, коти.' }
    ]
  },
  {
    id: 4,
    title: 'Домашні завдання тепер задають батькам',
    trapReplaceAs: 'thought',
    trapOptions: [
      { text: 'Я думаю, що це смішна, але корисна ідея.', correct: true },
      { text: 'Я думаю, що в мене є батьки.', correct: false },
      { text: 'Я думаю, що домашка буває.', correct: false }
    ],
    segments: [
      { type: 'water', text: 'Ну от домашка, вона така, ну, буває велика, буває маленька, а буває взагалі на вихідні, це найгірше.' },
      { type: 'example', text: 'Наприклад, тато вчора сам захотів розв\'язати мою задачу і сказав, що забув, як це робиться.' },
      { type: 'trap', text: 'Батьки бувають різні.' },
      { type: 'water', text: 'У мого друга мама — лікарка, а тато водить тролейбус, і от вони, ну, дуже зайняті.' },
      { type: 'reason', text: 'Бо батьки теж можуть дізнатися щось нове.' },
      { type: 'water', text: 'Ну, загалом, я все сказав, мабуть.' }
    ]
  },
  {
    id: 5,
    title: 'Уроки скоротили до 10 хвилин, а перерву подовжили до години',
    trapReplaceAs: 'example',
    trapOptions: [
      { text: 'Наприклад, на малюванні я тільки встигаю дістати фарби, а вже дзвоник.', correct: true },
      { text: 'Наприклад, перерва буває велика і мала.', correct: false },
      { text: 'Наприклад, урок — це урок.', correct: false }
    ],
    segments: [
      { type: 'reason', text: 'Бо за десять хвилин нічого не встигнеш зрозуміти.' },
      { type: 'water', text: 'Ну от, перерва — це перерва, а урок — це урок, і от вони, ну, різні, і в нас ще дзвоник дуже гучний.' },
      { type: 'thought', text: 'Я проти такої зміни.' },
      { type: 'water', text: 'Хоча годину гратися — теж нічого, ми б у футбол пограли, якщо не дощ, а якщо дощ, то в коридорі.' },
      { type: 'trap', text: 'Наприклад, я люблю перерви.' },
      { type: 'water', text: 'Ну от, такі справи.' }
    ]
  },
  {
    id: 6,
    title: 'Телефони вимикатимуться самі, якщо граєш більше години',
    trapReplaceAs: 'reason',
    trapOptions: [
      { text: 'Бо так легше вчасно зупинитися і не втомлювати очі.', correct: true },
      { text: 'Бо в телефоні є ігри.', correct: false },
      { text: 'Бо телефон треба заряджати.', correct: false }
    ],
    segments: [
      { type: 'water', text: 'Ну телефони, вони, знаєте, різні бувають, у когось айфон, у когось інший, у мене от з тріснутим екраном, бо я його впустив.' },
      { type: 'thought', text: 'Мені здається, це корисна функція.' },
      { type: 'water', text: 'Хоча мій брат казав, що він би все одно щось придумав, він у мене хитрий.' },
      { type: 'example', text: 'Наприклад, я якось грав до ночі і зранку проспав школу.' },
      { type: 'trap', text: 'Бо телефони дорогі.' },
      { type: 'water', text: 'Ну от, коротше, телефони.' }
    ]
  },
  {
    id: 7,
    title: 'Кожен клас отримає дракона-чергового',
    trapReplaceAs: 'thought',
    trapOptions: [
      { text: 'Я думаю, дракон-черговий — класна ідея.', correct: true },
      { text: 'Я думаю, дракони великі.', correct: false },
      { text: 'Я думаю, дракони живуть у печерах.', correct: false }
    ],
    segments: [
      { type: 'trap', text: 'Дракони бувають зелені.' },
      { type: 'water', text: 'Ну, в одному мультику був дракон, і він там літав, і ще в нього був друг, хлопчик, вони дружили, це довга історія.' },
      { type: 'example', text: 'Наприклад, у нас у класі ніхто не хоче витирати дошку й поливати квіти.' },
      { type: 'water', text: 'А квіти в нас, до речі, вже всохли, ну, майже.' },
      { type: 'reason', text: 'Бо дракон зможе робити роботу, яку ніхто не любить.' },
      { type: 'water', text: 'Ну от, драконів я люблю.' }
    ]
  },
  {
    id: 8,
    title: 'Понеділок переносять на неділю',
    trapReplaceAs: 'reason',
    trapOptions: [
      { text: 'Бо тоді в нас залишиться лише один вихідний.', correct: true },
      { text: 'Бо в неділю сонце.', correct: false },
      { text: 'Бо понеділок — перший день.', correct: false }
    ],
    segments: [
      { type: 'thought', text: 'Як на мене, це погана ідея.' },
      { type: 'water', text: 'Ну, днів тижня сім, ну, ви знаєте: понеділок, вівторок і так далі, я їх усі знаю ще з першого класу.' },
      { type: 'example', text: 'Наприклад, у неділю я завжди їжджу до бабусі на вареники.' },
      { type: 'water', text: 'Вареники в неї з вишнями, а ще з картоплею, але з вишнями кращі, ну, мені так здається.' },
      { type: 'trap', text: 'Бо понеділок починається на літеру «П».' },
      { type: 'water', text: 'Ну, от і все.' }
    ]
  },
  {
    id: 9,
    title: 'Брокколі тепер на смак як шоколад',
    trapReplaceAs: 'example',
    trapOptions: [
      { text: 'Наприклад, мій брат ніколи не їсть брокколі, а шоколад — завжди.', correct: true },
      { text: 'Наприклад, брокколі росте на городі.', correct: false },
      { text: 'Наприклад, шоколад солодкий.', correct: false }
    ],
    segments: [
      { type: 'water', text: 'Ну, брокколі, вона така, ну, як маленьке дерево, я колись думав, що це справжнє дерево, тільки маленьке.' },
      { type: 'reason', text: 'Бо тоді діти їстимуть більше овочів і будуть здоровішими.' },
      { type: 'trap', text: 'Наприклад, брокколі зелена.' },
      { type: 'water', text: 'Хоча шоколад теж буває різний: білий, чорний, з горіхами, ну, всякий.' },
      { type: 'thought', text: 'Я за такий винахід.' },
      { type: 'water', text: 'Ну от, загалом, так.' }
    ]
  },
  {
    id: 10,
    title: 'Контрольні тепер пишуть учителі, а учні перевіряють',
    trapReplaceAs: 'reason',
    trapOptions: [
      { text: 'Бо коли перевіряєш інших, сам краще розумієш тему.', correct: true },
      { text: 'Бо в учителів є ручки.', correct: false },
      { text: 'Бо контрольні бувають у п\'ятницю.', correct: false }
    ],
    segments: [
      { type: 'water', text: 'Ну, контрольні, вони бувають з математики, з мови, з усього, і от ми якраз у вівторок писали, ну, не скажу як.' },
      { type: 'example', text: 'Наприклад, коли я пояснював сестрі задачу, то сам її краще зрозумів.' },
      { type: 'thought', text: 'Я думаю, що це цікава ідея.' },
      { type: 'water', text: 'Хоча вчителі, мабуть, усе напишуть на відмінно, вони ж усе знають, ну, майже все.' },
      { type: 'trap', text: 'Бо вчителі дорослі.' },
      { type: 'water', text: 'Ну от.' }
    ]
  },
  {
    id: 11,
    title: 'У місті запустили автобус, який їде туди, куди хочуть діти',
    trapReplaceAs: 'thought',
    trapOptions: [
      { text: 'Я думаю, це найкраща новина тижня.', correct: true },
      { text: 'Я думаю, автобус їде.', correct: false },
      { text: 'Я думаю, що є автобуси.', correct: false }
    ],
    segments: [
      { type: 'water', text: 'Автобуси бувають жовті, червоні, ну, і двоповерхові ще, я такий бачив, ну, на картинці.' },
      { type: 'reason', text: 'Бо діти рідко самі обирають, куди поїхати.' },
      { type: 'water', text: 'Зазвичай ми їдемо туди, куди треба дорослим: у магазин, на пошту, ну, в усякі нудні місця.' },
      { type: 'trap', text: 'Автобус має колеса.' },
      { type: 'example', text: 'Наприклад, я б одразу поїхала в зоопарк до жирафів.' },
      { type: 'water', text: 'Ну от, такі думки.' }
    ]
  },
  {
    id: 12,
    title: 'Дітям дозволили приходити на уроки в костюмах супергероїв',
    trapReplaceAs: 'reason',
    trapOptions: [
      { text: 'Бо в костюмі почуваєшся сміливішим.', correct: true },
      { text: 'Бо костюми бувають сині.', correct: false },
      { text: 'Бо супергерої літають.', correct: false }
    ],
    segments: [
      { type: 'thought', text: 'Мені здається, це чудова новина.' },
      { type: 'water', text: 'Ну, супергерої, їх багато, є там усякі, ну, хтось літає, хтось швидко бігає, а хтось просто багатий.' },
      { type: 'trap', text: 'Бо костюми продаються в магазині.' },
      { type: 'water', text: 'У мене, до речі, є костюм, але він уже малий, мама каже, що його треба віддати.' },
      { type: 'example', text: 'Наприклад, на святі в костюмі я не боявся виступати.' },
      { type: 'water', text: 'Ну от, коротше, супергерої.' }
    ]
  }
];

// Helper to convert news item into initial raw sentence cards
export function createInitialSentenceCards(news: NewsItem): SentenceCard[] {
  const cards: SentenceCard[] = [];
  news.segments.forEach((seg, idx) => {
    // If previous card has same type, merge them
    if (cards.length > 0 && cards[cards.length - 1].originalType === seg.type) {
      cards[cards.length - 1].text += ' ' + seg.text;
    } else {
      cards.push({
        id: `card_${news.id}_${idx}_${Math.random().toString(36).substring(2, 7)}`,
        text: seg.text,
        originalType: seg.type,
        currentType: seg.type,
        marker: null,
        isCustom: false
      });
    }
  });
  return cards;
}

export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Calculate duration in seconds (words / 2.5)
export function calculateCardsDuration(cards: SentenceCard[]): number {
  const totalWords = cards.reduce((sum, c) => sum + getWordCount(c.text), 0);
  return Number((totalWords / 2.5).toFixed(1));
}

export function formatTimecode(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
