import React, { useEffect, useMemo, useState } from 'react';
import {
  Scissors,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
  PenLine,
  X,
  Volume2,
  VolumeX,
  Radio,
  Sliders
} from 'lucide-react';
import { NewsItem, SentenceCard, WizardStep, MarkerType, TrapOption } from '../types';
import {
  calculateCardsDuration,
  getCardRole,
  getMissingRoles,
  getWordCount,
  hasDuplicatePair,
  shuffled
} from '../data/newsData';
import { soundManager } from '../utils/audio';

interface WizardScreenProps {
  news: NewsItem;
  cards: SentenceCard[];
  binCards: SentenceCard[];
  currentStep: WizardStep;
  originalDuration: number;
  isHarderMode: boolean;
  hasSeenSuccess: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleHarderMode: () => void;
  onSetStep: (step: WizardStep) => void;
  onCutCard: (cardId: string) => void;
  onRestoreCard: (cardId: string) => void;
  onMoveCard: (cardIndex: number, direction: 'up' | 'down') => void;
  onReplaceCard: (cardId: string, newText: string, isCustom: boolean) => void;
  onSetMarker: (cardId: string, marker: MarkerType) => void;
  onTrimCardTail: (cardId: string, wordIndex: number) => void;
  onFinishWizard: () => void;
  onBackToNews: () => void;
  onResetAll: () => void;
}

export const WizardScreen: React.FC<WizardScreenProps> = ({
  news,
  cards,
  binCards,
  currentStep,
  originalDuration,
  isHarderMode,
  hasSeenSuccess,
  isMuted,
  onToggleMute,
  onToggleHarderMode,
  onSetStep,
  onCutCard,
  onRestoreCard,
  onMoveCard,
  onReplaceCard,
  onSetMarker,
  onTrimCardTail,
  onFinishWizard,
  onBackToNews,
  onResetAll
}) => {
  // Selected card for cutting/replacing
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Replacement modal state
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState<boolean>(false);
  const [replaceCustomText, setReplaceCustomText] = useState<string>('');
  const [replaceErrorTip, setReplaceErrorTip] = useState<string | null>(null);

  // Згорнута картка-підказка («Підказка» в нижній панелі)
  const [isHintOpen, setIsHintOpen] = useState<boolean>(false);

  // Крок 1: Сорока підказує, що в кошику лежить важлива репліка
  const [step1Tip, setStep1Tip] = useState<'missing' | 'duplicate' | null>(null);

  // Варіанти заміни пастки — у випадковому порядку (перемішуємо раз на новину)
  const trapOptions = useMemo(() => shuffled(news.trapOptions), [news.id]);

  // Закриваємо підказки при зміні кроку чи складу стрічки
  useEffect(() => {
    setIsHintOpen(false);
  }, [currentStep]);
  useEffect(() => {
    setStep1Tip(null);
  }, [cards.length, currentStep]);

  // Step 3 order warning modal state
  const [showOrderWarning, setShowOrderWarning] = useState<boolean>(false);

  // Word selection for "Harder" mode trimming
  const [selectedWordCutIndex, setSelectedWordCutIndex] = useState<{ cardId: string; wordIdx: number } | null>(null);

  // Calculate current duration
  const currentDuration = calculateCardsDuration(cards);
  const isDurationGood = currentDuration <= 30;

  // Selected card
  const selectedCard = cards.find((c) => c.id === selectedCardId) || null;

  // Крок 1: скільки реплік лишилось у стрічці
  const REQUIRED_COUNT = 3;
  const feedCount = cards.length;
  const hasExactCount = feedCount === REQUIRED_COUNT;

  // Бульбашка «загоряється», коли Сорока помітила проблему
  const isSorokaAlert = (currentStep === 1 && step1Tip !== null) || (currentStep === 2 && !!replaceErrorTip);

  // Текст у бульбашці Сороки залежно від кроку
  const getSorokaMessage = (): string => {
    if (replaceErrorTip && currentStep === 2) {
      return replaceErrorTip;
    }

    switch (currentStep) {
      case 1:
        if (step1Tip === 'duplicate') return 'Лишилось дві схожі репліки, обери одну.';
        if (step1Tip === 'missing') return 'Здається, одна важлива репліка в кошику. Перевір!';
        return 'Залиш рівно 3 репліки: думку, причину й приклад. Усе інше виріж. Одна з трьох може бути слизькою — її виправимо на кроці 2.';
      case 2:
        return 'Одне речення звучить так, ніби воно до теми, але нічого не доводить. Спробуй замінити!';
      case 3:
        return 'Тепер порядок: спочатку що я думаю, потім чому, потім приклад.';
      case 4:
        return 'Допоможи глядачам: познач, де думка, де причина, а де приклад.';
      default:
        return 'Монтуємо сюжет разом!';
    }
  };

  // Handle Step progression
  const handleNextStep = () => {
    soundManager.playClick();
    if (currentStep === 1) {
      if (!hasExactCount) return;
      if (hasDuplicatePair(cards)) {
        soundManager.playHint();
        setStep1Tip('duplicate');
        return;
      }
      if (getMissingRoles(cards, news).length > 0) {
        soundManager.playHint();
        setStep1Tip('missing');
        return;
      }
      onSetStep(2);
      setSelectedCardId(null);
    } else if (currentStep === 2) {
      // Check if trap is replaced
      const hasUnreplacedTrap = cards.some((c) => c.currentType === 'trap' && !c.isReplaced);
      if (hasUnreplacedTrap) {
        setReplaceErrorTip('Спочатку торкнись речення-пастки й обери заміну!');
        return;
      }
      onSetStep(3);
      setSelectedCardId(null);
    } else if (currentStep === 3) {
      // Check if order is correct: thought -> reason -> example
      const roles = cards.map((c) => getCardRole(c, news));
      const isCorrectOrder = roles[0] === 'thought' && roles[1] === 'reason' && roles[2] === 'example';

      if (!isCorrectOrder && !showOrderWarning) {
        setShowOrderWarning(true);
        return;
      }
      setShowOrderWarning(false);
      onSetStep(4);
      setSelectedCardId(null);
    } else if (currentStep === 4) {
      onFinishWizard();
    }
  };

  const handlePrevStep = () => {
    soundManager.playClick();
    if (currentStep > 1) {
      onSetStep((currentStep - 1) as WizardStep);
      setSelectedCardId(null);
    } else {
      onBackToNews();
    }
  };

  // Replacement selection
  const handleSelectReplacementOption = (option: TrapOption) => {
    if (!selectedCardId) return;
    if (!option.correct) {
      soundManager.playHint();
      setReplaceErrorTip('Хм, цей варіант теж нічого не доводить. Спробуй інший або вигадай свій!');
      return;
    }
    soundManager.playClick();
    onReplaceCard(selectedCardId, option.text, false);
    setIsReplaceModalOpen(false);
    setReplaceErrorTip(null);
  };

  const handleCustomReplacementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCardId || !replaceCustomText.trim()) return;
    const wordCount = getWordCount(replaceCustomText);
    if (wordCount > 15) return;

    soundManager.playClick();
    onReplaceCard(selectedCardId, replaceCustomText.trim(), true);
    setReplaceCustomText('');
    setIsReplaceModalOpen(false);
    setReplaceErrorTip(null);
  };

  // Крок 1 — ширший (картки у 2 колонки), кроки 2–4 — вужчі (лише 3 картки)
  const wrap = currentStep === 1 ? 'max-w-6xl' : 'max-w-4xl';

  const renderCounter = (testId: string) => (
    <div
      aria-live="polite"
      data-testid={testId}
      className={`rounded-2xl border-2 px-4 py-1.5 lg:py-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-0.5 transition-colors ${
        hasExactCount
          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
          : 'bg-[#1C2332] border-amber-500/50 text-amber-200'
      }`}
    >
      <span className="text-lg sm:text-2xl font-black tabular-nums">
        Реплік: {feedCount} → потрібно {REQUIRED_COUNT}
      </span>
      <span className="text-base sm:text-xl font-extrabold">
        {hasExactCount
          ? 'Саме стільки! ✓'
          : feedCount > REQUIRED_COUNT
          ? `Ще ${feedCount - REQUIRED_COUNT} ${pluralExtra(feedCount - REQUIRED_COUNT)}`
          : 'Ой, забагато вирізано. Поверни щось із кошика'}
      </span>
    </div>
  );

  // Is "Next" active on Step 4?
  const allMarked = cards.length === 3 && cards.every((c) => c.marker !== null);

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#15181F] text-slate-100 flex flex-col select-none">
      {/* 1. TOP BAR */}
      <header className="shrink-0 bg-[#1C2230] border-b border-[#2C3549] px-4 py-2 sm:px-6">
        <div className={`${wrap} mx-auto flex items-center justify-between gap-2 sm:gap-3`}>
          {/* Logo & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="hidden sm:flex w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl shadow-md shadow-amber-500/20 shrink-0">
              🦅
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black uppercase tracking-wider text-amber-400 truncate">
                Сорока ТВ — Монтажна
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white truncate sm:max-w-md">
                {news.title}
              </h1>
            </div>
          </div>

          {/* Right Controls: Duration Bar, Mute, Harder Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* 30s Air Duration Bar */}
            <div className="flex flex-col items-end">
              <div className="text-xs font-mono font-bold flex items-center gap-1.5 mb-1">
                <span>Ефір:</span>
                <span className={`tabular-nums ${isDurationGood ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {currentDuration} с / 30 с
                </span>
              </div>
              <div className="w-24 sm:w-36 h-3 bg-[#131720] rounded-full overflow-hidden border border-[#2C3549]">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isDurationGood ? 'bg-emerald-500 shadow-sm' : 'bg-amber-400 shadow-sm'
                  }`}
                  style={{ width: `${Math.min(100, (currentDuration / 30) * 100)}%` }}
                />
              </div>
              {!isDurationGood && (
                <span className="text-[10px] text-amber-300 font-bold mt-0.5">
                  Ще трохи довгувато
                </span>
              )}
            </div>

            {/* Sound Toggle */}
            <button
              onClick={onToggleMute}
              className="p-2 sm:p-2.5 rounded-xl bg-[#242C3E] hover:bg-[#2F3A52] text-slate-300 transition-colors"
              title={isMuted ? 'Увімкнути звук' : 'Вимкнути звук'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Optional Harder Mode Toggle */}
            {hasSeenSuccess && (
              <button
                onClick={onToggleHarderMode}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  isHarderMode
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-[#242C3E] border-[#2F3A52] text-slate-300 hover:text-white'
                }`}
                title="Режим з обрізанням речень по словах"
              >
                <Sliders className="w-4 h-4" />
                <span className="hidden sm:inline">Складніше</span>
              </button>
            )}

            {/* Reset */}
            <button
              onClick={onResetAll}
              className="p-2 sm:p-2.5 rounded-xl bg-[#242C3E] hover:bg-[#2F3A52] text-slate-400 hover:text-white transition-colors"
              title="Почати спочатку"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4-Step Round Progress Indicators */}
        <div className={`${wrap} mx-auto pt-2`}>
          <div className="flex items-center justify-between relative">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-[#283248] z-0" />

            {[
              { num: 1, label: 'Прибери зайве ✂️' },
              { num: 2, label: 'Заміни пастку 🔁' },
              { num: 3, label: 'Порядок ↕️' },
              { num: 4, label: 'Маркери 🏷' }
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;

              return (
                <div key={step.num} className="flex items-center gap-2 relative z-10 sm:bg-[#1C2230] sm:pr-2">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-sm sm:text-base border-2 transition-all ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 border-amber-300 ring-4 ring-amber-400/30 shadow-lg'
                        : isPast
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-[#202737] text-slate-400 border-[#323E56]'
                    }`}
                  >
                    {isPast ? <Check className="w-5 h-5 stroke-[3]" /> : step.num}
                  </div>
                  <span
                    className={`text-base font-bold hidden sm:block ${
                      isActive ? 'text-amber-300 font-extrabold' : isPast ? 'text-emerald-300' : 'text-slate-200'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* 2. SOROKA MASCOT SPEECH BUBBLE */}
      <div className={`shrink-0 ${wrap} mx-auto w-full px-3 sm:px-4 pt-2 sm:pt-3 pb-2`}>
        <div
          aria-live="polite"
          className={`border-2 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-3 shadow-xl transition-colors ${
            isSorokaAlert
              ? 'bg-amber-500/15 border-amber-400 ring-4 ring-amber-400/30'
              : 'bg-gradient-to-r from-[#202738] to-[#1C2332] border-amber-500/40'
          }`}
        >
          <div className="hidden sm:flex w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl sm:text-2xl shadow-lg shadow-amber-500/20 shrink-0">
            🦅
          </div>
          <div className="flex-1 min-w-0">
            <div className="hidden sm:block lg:hidden text-[11px] font-mono font-black uppercase tracking-wider text-amber-400">
              Сорока радить:
            </div>
            <p className="text-[15px] sm:text-lg font-bold text-white leading-snug">
              <span className="sm:hidden">🦅 </span>
              {getSorokaMessage()}
            </p>
          </div>
        </div>
      </div>

      {/* 3. MAIN AREA: СТРІЧКА (THE FEED OF CARDS) */}
      <main className="flex-1 min-h-0 overflow-y-auto">
       <div className={`${wrap} mx-auto w-full px-3 sm:px-4 py-2 space-y-3`}>
        {/* 2б. ЗГОРНУТА ПІДКАЗКА (кнопка «Підказка») та порада кроку 4 */}
        {(isHintOpen || currentStep === 4) && (
          <div>
            <div className="bg-[#1C2332] border-2 border-[#3A4560] rounded-2xl p-3 sm:p-4 space-y-2">
              {currentStep === 1 && isHintOpen && (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg sm:text-xl font-black text-white">Що вирізаємо?</h3>
                    <button
                      onClick={() => setIsHintOpen(false)}
                      className="p-2 text-slate-400 hover:text-white rounded-lg"
                      title="Згорнути підказку"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-base text-slate-200">
                    <li className="bg-[#232B3E] rounded-xl p-2.5"><span className="text-xl mr-1.5">🌀</span><strong className="text-white">Відступ</strong> — цікаво, але про інше.</li>
                    <li className="bg-[#232B3E] rounded-xl p-2.5"><span className="text-xl mr-1.5">🔁</span><strong className="text-white">Повтор</strong> — те саме іншими словами.</li>
                    <li className="bg-[#232B3E] rounded-xl p-2.5"><span className="text-xl mr-1.5">💬</span><strong className="text-white">«Усі знають»</strong> — загальна фраза.</li>
                    <li className="bg-[#232B3E] rounded-xl p-2.5"><span className="text-xl mr-1.5">🤔</span><strong className="text-white">Вагання</strong> — «хоча, можливо…».</li>
                  </ul>
                  <p className="text-base text-amber-200 font-semibold leading-relaxed">
                    Дивись не на перше слово, а на питання: чи відповідає речення на „що я думаю?“, „чому?“ або „як це буває?“.
                  </p>
                </>
              )}
              {currentStep === 2 && isHintOpen && (
                <p className="text-base text-slate-200 font-semibold leading-relaxed">
                  🔁 Пастка починається як потрібна репліка, але нічого не доводить. Торкнись її й обери варіант, який справді пояснює думку.
                </p>
              )}
              {currentStep === 3 && isHintOpen && (
                <p className="text-base text-slate-200 font-semibold leading-relaxed">
                  ↕️ Прочитай уголос: спочатку «що я думаю», потім «чому», а тоді «як це буває». Звучить складно? Перестав картки.
                </p>
              )}
              {currentStep === 4 && (
                <p className="text-base text-amber-200 font-semibold leading-relaxed">
                  🏷 Подивись не на перше слово, а на питання, на яке відповідає речення.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 3 Model Order Badges (non-clickable guide) */}
        {currentStep === 3 && (
          <div className="bg-[#1C2332] border border-[#2D384D] rounded-xl p-3 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold text-slate-300">
            <span className="text-slate-400">Правильний порядок:</span>
            <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
              💡 Що я думаю
            </span>
            <span>→</span>
            <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40">
              🔑 Чому (Бо)
            </span>
            <span>→</span>
            <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              📸 Приклад
            </span>
          </div>
        )}

        {/* List of Cards */}
        <div className={currentStep === 1 ? 'grid grid-cols-1 md:grid-cols-2 gap-2' : 'space-y-3'}>
          {cards.map((card, idx) => {
            const isSelected = selectedCardId === card.id;
            const isTrap = card.currentType === 'trap';

            // Step 4 Marker background styling
            let markerBg = 'bg-[#1D2331] border-[#2C364C] text-slate-100';
            if (card.marker === 'thought') {
              markerBg = 'bg-gradient-to-r from-amber-950/70 to-[#2A231C] border-amber-500 text-amber-100';
            } else if (card.marker === 'reason') {
              markerBg = 'bg-gradient-to-r from-blue-950/70 to-[#1C2538] border-blue-500 text-blue-100';
            } else if (card.marker === 'example') {
              markerBg = 'bg-gradient-to-r from-emerald-950/70 to-[#1A2E26] border-emerald-500 text-emerald-100';
            }

            return (
              <div
                key={card.id}
                onClick={() => {
                  // Крок 1: один натиск — і репліка в кошику (повернути теж одним натиском)
                  if (currentStep === 1 && !isHarderMode) {
                    soundManager.playCut();
                    onCutCard(card.id);
                    return;
                  }
                  soundManager.playClick();
                  setSelectedCardId(isSelected ? null : card.id);
                  setSelectedWordCutIndex(null);
                }}
                className={`rounded-2xl border-2 transition-all cursor-pointer shadow-md relative ${
                  currentStep === 1 ? 'px-3 py-2 sm:px-4' : 'p-4 sm:p-5'
                } ${markerBg} ${
                  isSelected
                    ? 'ring-4 ring-amber-400/80 border-amber-400 shadow-xl shadow-amber-500/10'
                    : 'hover:border-slate-500'
                }`}
              >
                {/* Step 2 Trap Notice Badge */}
                {currentStep === 2 && isTrap && (
                  <div className="mb-2 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Це речення-пастка! Торкнись, щоб замінити
                    </span>
                  </div>
                )}

                {/* Card Sentence Text (>= 22px requirement) + ✂️ на кроці 1 */}
                <div className={`flex gap-3 ${currentStep === 1 ? 'items-center' : 'items-start'}`}>
                <div
                  className={`flex-1 min-w-0 font-semibold ${
                    currentStep === 1
                      ? 'text-[17px] sm:text-[18px] leading-snug'
                      : 'text-[20px] sm:text-[22px] md:text-[24px] leading-relaxed tracking-wide'
                  }`}
                >
                  {/* If Harder mode is active, allow clicking on words to cut tail */}
                  {isHarderMode && currentStep === 1 ? (
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      {card.text.split(/\s+/).map((word, wIdx, arr) => {
                        const isCutSelected =
                          selectedWordCutIndex?.cardId === card.id &&
                          selectedWordCutIndex?.wordIdx === wIdx;

                        return (
                          <span
                            key={wIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              soundManager.playClick();
                              setSelectedCardId(card.id);
                              setSelectedWordCutIndex(
                                isCutSelected ? null : { cardId: card.id, wordIdx: wIdx }
                              );
                            }}
                            className={`px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                              isCutSelected
                                ? 'bg-amber-400 text-slate-950 font-bold'
                                : 'hover:bg-[#2C364C]'
                            }`}
                          >
                            {word}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <span>{card.text}</span>
                  )}
                </div>
                {currentStep === 1 && (
                  <span
                    aria-hidden="true"
                    className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-xl border-2 transition-colors ${
                      isSelected
                        ? 'bg-amber-500 border-amber-300'
                        : 'bg-[#262E40] border-[#36415A]'
                    }`}
                    title="Натисни, щоб вирізати"
                  >
                    ✂️
                  </span>
                )}
                </div>

                {/* HARDER MODE: Big "Cut tail here" button */}
                {isHarderMode &&
                  currentStep === 1 &&
                  selectedWordCutIndex?.cardId === card.id && (
                    <div className="mt-4 pt-3 border-t border-[#2C364C] flex items-center gap-3 animate-in fade-in">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundManager.playCut();
                          onTrimCardTail(card.id, selectedWordCutIndex.wordIdx);
                          setSelectedWordCutIndex(null);
                        }}
                        className="h-14 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base flex items-center gap-2 shadow-lg shadow-amber-500/20"
                      >
                        <Scissors className="w-5 h-5" />
                        <span>✂️ Обрізати тут (видалити хвіст)</span>
                      </button>
                    </div>
                  )}

                {/* STEP 1: Big "✂️ Виріж" button on selected card */}
                {currentStep === 1 && isHarderMode && isSelected && !selectedWordCutIndex && (
                  <div className="mt-4 pt-3 border-t border-[#2C364C] flex items-center gap-3 animate-in fade-in">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playCut();
                        onCutCard(card.id);
                        setSelectedCardId(null);
                      }}
                      className="h-14 px-8 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-lg flex items-center gap-2.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                    >
                      <Scissors className="w-6 h-6 stroke-[2.5]" />
                      <span>✂️ Виріж це речення</span>
                    </button>
                  </div>
                )}

                {/* STEP 2: Big "🔁 Заміни" button on selected card */}
                {currentStep === 2 && isSelected && (
                  <div className="mt-4 pt-3 border-t border-[#2C364C] flex items-center gap-3 animate-in fade-in">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playClick();
                        setIsReplaceModalOpen(true);
                      }}
                      className="h-14 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-lg flex items-center gap-2.5 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                    >
                      <RefreshCw className="w-6 h-6 stroke-[2.5]" />
                      <span>🔁 Заміни це речення</span>
                    </button>
                  </div>
                )}

                {/* STEP 3: Big ⬆ / ⬇ Buttons on each card */}
                {currentStep === 3 && (
                  <div className="mt-4 pt-3 border-t border-[#2C364C] flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Позиція #{idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundManager.playMove();
                          onMoveCard(idx, 'up');
                        }}
                        disabled={idx === 0}
                        className="h-14 px-5 rounded-xl bg-[#283248] hover:bg-[#34415D] disabled:opacity-20 text-slate-200 font-bold text-base flex items-center gap-1.5 transition-colors"
                        title="Посунути вище"
                      >
                        <ArrowUp className="w-5 h-5" />
                        <span>⬆ Вгору</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundManager.playMove();
                          onMoveCard(idx, 'down');
                        }}
                        disabled={idx === cards.length - 1}
                        className="h-14 px-5 rounded-xl bg-[#283248] hover:bg-[#34415D] disabled:opacity-20 text-slate-200 font-bold text-base flex items-center gap-1.5 transition-colors"
                        title="Посунути нижче"
                      >
                        <ArrowDown className="w-5 h-5" />
                        <span>⬇ Вниз</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Three Big Icon Marker Buttons (💡 🔑 📸) */}
                {currentStep === 4 && (
                  <div className="mt-4 pt-3 border-t border-[#2C364C] grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playMarker('thought');
                        onSetMarker(card.id, 'thought');
                      }}
                      className={`h-14 rounded-xl text-base font-extrabold flex items-center justify-center gap-2 border-2 transition-all ${
                        card.marker === 'thought'
                          ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md ring-2 ring-amber-400'
                          : 'bg-[#22293A] border-[#313B52] text-amber-300 hover:border-amber-500'
                      }`}
                    >
                      <span className="text-xl">💡</span>
                      <span>Що я думаю</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playMarker('reason');
                        onSetMarker(card.id, 'reason');
                      }}
                      className={`h-14 rounded-xl text-base font-extrabold flex items-center justify-center gap-2 border-2 transition-all ${
                        card.marker === 'reason'
                          ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400'
                          : 'bg-[#22293A] border-[#313B52] text-blue-300 hover:border-blue-500'
                      }`}
                    >
                      <span className="text-xl">🔑</span>
                      <span>Чому (Бо)</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playMarker('example');
                        onSetMarker(card.id, 'example');
                      }}
                      className={`h-14 rounded-xl text-base font-extrabold flex items-center justify-center gap-2 border-2 transition-all ${
                        card.marker === 'example'
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-400'
                          : 'bg-[#22293A] border-[#313B52] text-emerald-300 hover:border-emerald-500'
                      }`}
                    >
                      <span className="text-xl">📸</span>
                      <span>Приклад</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* STEP 1: Trash Tray ("Кошик") with 1-tap restore */}
        {currentStep === 1 && binCards.length > 0 && (
          <div className="pt-3 border-t-2 border-dashed border-[#2B3548] space-y-2">
            <div className="text-sm font-bold text-slate-300">
              🗑 Кошик ({binCards.length}) — торкнись «↩️», щоб повернути:
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {binCards.map((bCard) => (
                <div
                  key={bCard.id}
                  className="bg-[#171B26] border border-[#2B3548] rounded-xl pl-3 pr-1.5 py-1.5 flex items-center justify-between gap-2"
                >
                  <span className="text-[15px] text-slate-400 truncate flex-1 min-w-0 font-medium">
                    {bCard.text}
                  </span>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onRestoreCard(bCard.id);
                    }}
                    className="h-9 px-3 rounded-lg bg-[#252E42] hover:bg-[#323D57] text-amber-300 font-bold text-sm flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <span>↩️<span className="hidden sm:inline lg:hidden xl:inline"> Повернути</span></span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
       </div>
      </main>

      {/* STEP 1: Лічильник реплік — завжди на екрані, над кнопками (на широких — у нижній панелі) */}
      {currentStep === 1 && (
        <div className={`lg:hidden shrink-0 ${wrap} mx-auto w-full px-3 sm:px-4 pb-2 pt-1`}>
          {renderCounter('replica-counter')}
        </div>
      )}

      {/* 4. BOTTOM NAVIGATION BAR (MAX 3 ACTION BUTTONS AT A TIME) */}
      <footer className="shrink-0 bg-[#1C2230] border-t border-[#2C3549] px-3 py-2 sm:px-4 sm:py-3">
        <div className={`${wrap} mx-auto flex items-center justify-between gap-2 sm:gap-3`}>
          {/* Button 1: Назад */}
          <button
            onClick={handlePrevStep}
            className="h-12 sm:h-14 px-3 sm:px-6 rounded-xl bg-[#242C3E] hover:bg-[#2F3A52] text-slate-300 hover:text-white font-bold text-base flex items-center gap-1.5 sm:gap-2 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{currentStep === 1 ? 'До новин' : 'Назад'}</span>
          </button>

          {/* Лічильник реплік у панелі (широкі екрани) */}
          {currentStep === 1 && (
            <div className="hidden lg:block flex-1 min-w-0">{renderCounter('replica-counter-wide')}</div>
          )}

          {/* Button 2: Підказка */}
          <button
            onClick={() => {
              soundManager.playHint();
              setIsHintOpen((prev) => !prev);
            }}
            className={`h-12 sm:h-14 px-3 sm:px-6 rounded-xl border font-bold text-base flex items-center gap-1.5 sm:gap-2 transition-all shadow-sm ${
              isHintOpen
                ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                : 'bg-[#252E42] hover:bg-[#2F3B54] border-amber-500/40 text-amber-300'
            }`}
            aria-expanded={isHintOpen}
          >
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse hidden sm:block" />
            <span>Підказка</span>
          </button>

          {/* Button 3: Далі ➡️ or У ефір! 🎬 */}
          <button
            onClick={handleNextStep}
            disabled={(currentStep === 4 && !allMarked) || (currentStep === 1 && !hasExactCount)}
            className={`h-12 sm:h-14 px-4 sm:px-8 rounded-xl font-black text-base sm:text-lg flex items-center gap-1.5 sm:gap-2 shadow-lg transition-all active:scale-95 shrink-0 ${
              currentStep === 4
                ? allMarked
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-emerald-900/30'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50'
                : currentStep === 1 && !hasExactCount
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20'
            }`}
          >
            {currentStep === 4 ? (
              <>
                <Radio className="w-6 h-6" />
                <span>У ефір! 🎬</span>
              </>
            ) : (
              <>
                <span>Далі</span>
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>
        </div>
      </footer>

      {/* REPLACEMENT MODAL (Step 2) */}
      {isReplaceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C2230] border border-[#2F384C] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-5 bg-[#232B3E] border-b border-[#2F384C] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🔁</span>
                <h3 className="text-lg font-bold text-white">
                  Обери заміну для пастки
                </h3>
              </div>
              <button
                onClick={() => setIsReplaceModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <p className="text-xs sm:text-sm text-slate-300">
                Обери найбільш влучний варіант або напиши свій власний:
              </p>

              {/* 3 Library Options */}
              <div className="space-y-2.5">
                {trapOptions.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectReplacementOption(opt)}
                    className="w-full text-left p-4 rounded-xl bg-[#232B3E] hover:bg-[#2A354C] border border-[#313B52] hover:border-blue-400 text-slate-100 font-semibold text-base leading-relaxed transition-all flex items-start gap-3"
                  >
                    <span className="w-7 h-7 rounded-lg bg-[#1B2130] text-blue-400 font-mono text-sm font-bold flex items-center justify-center shrink-0">
                      {oIdx + 1}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                  </button>
                ))}
              </div>

              {/* 4th Card: Custom Frame Input */}
              <form onSubmit={handleCustomReplacementSubmit} className="pt-2">
                <div className="bg-[#171B26] border border-[#2F384C] rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <PenLine className="w-4 h-4" />
                    <span>✍️ Вигадаю сам(а) (до 15 слів):</span>
                  </div>

                  <textarea
                    value={replaceCustomText}
                    onChange={(e) => setReplaceCustomText(e.target.value)}
                    rows={2}
                    placeholder="Напиши своє речення..."
                    className="w-full bg-[#1F2535] border border-[#303B52] focus:border-amber-400 rounded-lg p-3 text-base text-white placeholder:text-slate-500 outline-none resize-none"
                  />

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-400">
                      Слів: {getWordCount(replaceCustomText)} / 15
                    </span>
                    <button
                      type="submit"
                      disabled={getWordCount(replaceCustomText) === 0 || getWordCount(replaceCustomText) > 15}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg text-xs"
                    >
                      Вставити мій варіант
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 ORDER WARNING DIALOG (as specified in prompt) */}
      {showOrderWarning && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C2230] border-2 border-amber-500/50 rounded-2xl w-full max-w-md p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl">
              🦅
            </div>
            <h3 className="text-xl font-bold text-white">
              Здається, тут ще щось переплутано. Спробуємо?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Золоте правило телебачення: спочатку що я думаю 💡, потім чому 🔑, а наприкінці — приклад 📸!
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowOrderWarning(false)}
                className="h-14 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-base transition-colors"
              >
                Спробую ще ⬆ ⬇
              </button>
              <button
                onClick={() => {
                  setShowOrderWarning(false);
                  onSetStep(4);
                }}
                className="h-14 px-5 rounded-xl bg-[#242C3E] hover:bg-[#2F3A52] text-slate-300 font-semibold text-sm transition-colors"
              >
                Далі, як є
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// «Ще 1 зайва», «Ще 2 зайві», «Ще 5 зайвих»
function pluralExtra(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'зайва';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'зайві';
  return 'зайвих';
}
