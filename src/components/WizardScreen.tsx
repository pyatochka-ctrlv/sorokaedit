import React, { useState } from 'react';
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
import { calculateCardsDuration, getWordCount } from '../data/newsData';
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

  // Step 1 hint level (0 = none, 1 = general, 2 = zone, 3 = card)
  const [hintLevel, setHintLevel] = useState<number>(0);

  // Step 3 order warning modal state
  const [showOrderWarning, setShowOrderWarning] = useState<boolean>(false);

  // Word selection for "Harder" mode trimming
  const [selectedWordCutIndex, setSelectedWordCutIndex] = useState<{ cardId: string; wordIdx: number } | null>(null);

  // Calculate current duration
  const currentDuration = calculateCardsDuration(cards);
  const isDurationGood = currentDuration <= 30;

  // Selected card
  const selectedCard = cards.find((c) => c.id === selectedCardId) || null;

  // Soroka instruction bubble text based on current step and context
  const getSorokaMessage = (): string => {
    // Check if kid cut important card in step 1
    const hasCoreInBin = binCards.some((c) =>
      ['thought', 'reason', 'example'].includes(c.originalType) &&
      c.originalType !== news.trapReplaceAs
    );
    if (hasCoreInBin && currentStep === 1) {
      return 'Ой, це важливе! Поверни його з кошика нижче ↩️';
    }

    if (replaceErrorTip && currentStep === 2) {
      return replaceErrorTip;
    }

    switch (currentStep) {
      case 1:
        if (hintLevel === 1) return 'Шукай речення, яке розповідає про щось інше, а не про новину!';
        if (hintLevel === 2) return 'Подивися на речення, виділені жовтою рамкою — одне з них зайве!';
        if (hintLevel === 3) return 'Ось це речення зовсім не потрібне в ефірі — сміливо вирізай!';
        return 'Тут є речення, яке нічого не каже про думку. Торкнись його й виріж!';
      case 2:
        return 'Це речення звучить так, ніби воно до теми, але не допомагає думці. Спробуй замінити!';
      case 3:
        return 'Тепер порядок: спочатку що я думаю, потім чому, потім приклад.';
      case 4:
        return 'Допоможи глядачам: познач, де думка, де причина, а де приклад.';
      default:
        return 'Монтуємо сюжет разом!';
    }
  };

  // Check if Step 1 can proceed (no water left in feed)
  const hasWaterInFeed = cards.some((c) => c.currentType === 'water');
  const hasCoreInBin = binCards.some((c) =>
    ['thought', 'reason', 'example'].includes(c.originalType) &&
    c.originalType !== news.trapReplaceAs
  );

  // Handle Step progression
  const handleNextStep = () => {
    soundManager.playClick();
    if (currentStep === 1) {
      if (hasWaterInFeed) {
        setHintLevel(Math.min(3, hintLevel + 1));
        return;
      }
      if (hasCoreInBin) {
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
      const getCardRole = (c: SentenceCard) => c.replacedType || c.currentType;
      const roles = cards.map(getCardRole);
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
      setReplaceErrorTip('Хм, це теж не підтримує думку. Спробуй інший варіант або вигадай свій!');
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

  // Is "Next" active on Step 4?
  const allMarked = cards.length === 3 && cards.every((c) => c.marker !== null);

  return (
    <div className="min-h-screen bg-[#15181F] text-slate-100 flex flex-col select-none">
      {/* 1. TOP BAR */}
      <header className="bg-[#1C2230] border-b border-[#2C3549] px-4 py-3 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl shadow-md shadow-amber-500/20 shrink-0">
              🦅
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-amber-400">
                Сорока ТВ — Монтажна
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-[200px] sm:max-w-md">
                {news.title}
              </h1>
            </div>
          </div>

          {/* Right Controls: Duration Bar, Mute, Harder Toggle */}
          <div className="flex items-center gap-3">
            {/* 30s Air Duration Bar */}
            <div className="flex flex-col items-end">
              <div className="text-xs font-mono font-bold flex items-center gap-1.5 mb-1">
                <span>Ефір:</span>
                <span className={`tabular-nums ${isDurationGood ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {currentDuration} с / 30 с
                </span>
              </div>
              <div className="w-28 sm:w-36 h-3 bg-[#131720] rounded-full overflow-hidden border border-[#2C3549]">
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
              className="p-2.5 rounded-xl bg-[#242C3E] hover:bg-[#2F3A52] text-slate-300 transition-colors"
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
              className="p-2.5 rounded-xl bg-[#242C3E] hover:bg-[#2F3A52] text-slate-400 hover:text-white transition-colors"
              title="Почати спочатку"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4-Step Round Progress Indicators */}
        <div className="max-w-4xl mx-auto pt-4 pb-1">
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
                <div key={step.num} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-black text-sm sm:text-base border-2 transition-all ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 border-amber-300 ring-4 ring-amber-400/30 scale-110 shadow-lg'
                        : isPast
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-[#202737] text-slate-400 border-[#323E56]'
                    }`}
                  >
                    {isPast ? <Check className="w-5 h-5 stroke-[3]" /> : step.num}
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs font-bold mt-1.5 hidden sm:block ${
                      isActive ? 'text-amber-300 font-extrabold' : 'text-slate-400'
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
      <div className="max-w-4xl mx-auto w-full px-4 pt-5 pb-3">
        <div className="bg-gradient-to-r from-[#202738] to-[#1C2332] border-2 border-amber-500/40 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-xl">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20 shrink-0">
            🦅
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-mono font-black uppercase tracking-wider text-amber-400 mb-0.5">
              Сорока радить:
            </div>
            <p className="text-base sm:text-lg font-bold text-white leading-snug">
              {getSorokaMessage()}
            </p>
          </div>
        </div>
      </div>

      {/* 3. MAIN AREA: СТРІЧКА (THE FEED OF CARDS) */}
      <main className="max-w-4xl mx-auto w-full px-4 py-2 flex-1 overflow-y-auto space-y-4">
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
        <div className="space-y-3">
          {cards.map((card, idx) => {
            const isSelected = selectedCardId === card.id;
            const isTrap = card.currentType === 'trap';

            // Visual hint border in Step 1
            let hintHighlightClass = '';
            if (currentStep === 1) {
              if (hintLevel === 3 && card.currentType === 'water') {
                hintHighlightClass = 'ring-4 ring-amber-400 animate-pulse border-amber-400';
              } else if (hintLevel === 2 && card.currentType === 'water') {
                hintHighlightClass = 'ring-2 ring-amber-400/70 border-amber-400/80';
              }
            }

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
                  soundManager.playClick();
                  setSelectedCardId(isSelected ? null : card.id);
                  setSelectedWordCutIndex(null);
                }}
                className={`rounded-2xl border-2 p-4 sm:p-5 transition-all cursor-pointer shadow-md relative ${markerBg} ${
                  isSelected
                    ? 'ring-4 ring-amber-400/80 border-amber-400 shadow-xl shadow-amber-500/10'
                    : 'hover:border-slate-500'
                } ${hintHighlightClass}`}
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

                {/* Card Sentence Text (>= 22px requirement) */}
                <div className="text-[20px] sm:text-[22px] md:text-[24px] font-semibold leading-relaxed tracking-wide">
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
                {currentStep === 1 && isSelected && !selectedWordCutIndex && (
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
          <div className="mt-6 pt-4 border-t-2 border-dashed border-[#2B3548] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              <span>🗑 Кошик вирізаних речень (можна повернути одним натиском):</span>
            </div>

            <div className="space-y-2">
              {binCards.map((bCard) => (
                <div
                  key={bCard.id}
                  className="bg-[#171B26] border border-[#2B3548] rounded-xl p-3.5 flex items-center justify-between gap-4"
                >
                  <span className="text-base text-slate-400 truncate flex-1 font-medium">
                    {bCard.text}
                  </span>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onRestoreCard(bCard.id);
                    }}
                    className="h-12 px-5 rounded-lg bg-[#252E42] hover:bg-[#323D57] text-amber-300 font-bold text-sm flex items-center gap-2 shrink-0 transition-colors"
                  >
                    <span>↩️ Повернути</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 4. BOTTOM NAVIGATION BAR (MAX 3 ACTION BUTTONS AT A TIME) */}
      <footer className="bg-[#1C2230] border-t border-[#2C3549] p-4 sm:p-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Button 1: Назад */}
          <button
            onClick={handlePrevStep}
            className="h-14 px-6 rounded-xl bg-[#242C3E] hover:bg-[#2F3A52] text-slate-300 hover:text-white font-bold text-base flex items-center gap-2 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{currentStep === 1 ? 'До новин' : 'Назад'}</span>
          </button>

          {/* Button 2: Підказка */}
          <button
            onClick={() => {
              soundManager.playHint();
              setHintLevel((prev) => (prev >= 3 ? 1 : prev + 1));
            }}
            className="h-14 px-6 rounded-xl bg-[#252E42] hover:bg-[#2F3B54] border border-amber-500/40 text-amber-300 font-bold text-base flex items-center gap-2 transition-all shadow-sm"
          >
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <span>Підказка</span>
          </button>

          {/* Button 3: Далі ➡️ or У ефір! 🎬 */}
          <button
            onClick={handleNextStep}
            disabled={currentStep === 4 && !allMarked}
            className={`h-14 px-8 rounded-xl font-black text-lg flex items-center gap-2 shadow-lg transition-all active:scale-95 shrink-0 ${
              currentStep === 4
                ? allMarked
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-emerald-900/30'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50'
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
                {news.trapOptions?.map((opt, oIdx) => (
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
