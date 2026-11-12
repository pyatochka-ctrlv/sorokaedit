import React, { useState } from 'react';
import { NEWS_LIST, createInitialSentenceCards, calculateCardsDuration } from './data/newsData';
import { NewsItem, SentenceCard, WizardStep, MarkerType, WizardValidation } from './types';
import { validateWizard } from './utils/validator';
import { soundManager } from './utils/audio';

import { NewsSelector } from './components/NewsSelector';
import { TeacherDashboard } from './components/TeacherDashboard';
import { WizardScreen } from './components/WizardScreen';
import { ExportModal } from './components/ExportModal';

export default function App() {
  // App mode: student or teacher (?mode=teacher)
  const [appMode, setAppMode] = useState<'student' | 'teacher'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('mode') === 'teacher' ? 'teacher' : 'student';
    }
    return 'student';
  });

  // Screen: 'select' (Screen 1) | 'editor' (Screen 2 Wizard)
  const [screen, setScreen] = useState<'select' | 'editor'>('select');
  const [selectedNews, setSelectedNews] = useState<NewsItem>(NEWS_LIST[0]);

  // Wizard state
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [cards, setCards] = useState<SentenceCard[]>([]);
  const [binCards, setBinCards] = useState<SentenceCard[]>([]);
  const [originalDuration, setOriginalDuration] = useState<number>(38);

  // Optional Level 2: "Складніше"
  const [isHarderMode, setIsHarderMode] = useState<boolean>(false);
  const [hasSeenSuccess, setHasSeenSuccess] = useState<boolean>(false);

  // Audio mute
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<WizardValidation | null>(null);

  // Load a news item to start editing
  const handleSelectNews = (news: NewsItem) => {
    soundManager.playClick();
    setSelectedNews(news);
    const initialCards = createInitialSentenceCards(news);
    setCards(initialCards);
    setBinCards([]);
    setCurrentStep(1);
    setOriginalDuration(calculateCardsDuration(initialCards));
    setScreen('editor');
  };

  // Step 1: Cut card into bin
  const handleCutCard = (cardId: string) => {
    const cardToCut = cards.find((c) => c.id === cardId);
    if (!cardToCut) return;

    setCards((prev) => prev.filter((c) => c.id !== cardId));
    setBinCards((prev) => [cardToCut, ...prev]);
  };

  // Step 1: Restore card from bin
  const handleRestoreCard = (cardId: string) => {
    const cardToRestore = binCards.find((c) => c.id === cardId);
    if (!cardToRestore) return;

    setBinCards((prev) => prev.filter((c) => c.id !== cardId));
    setCards((prev) => [...prev, cardToRestore]);
  };

  // Step 3: Move card up or down
  const handleMoveCard = (cardIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? cardIndex - 1 : cardIndex + 1;
    if (targetIndex < 0 || targetIndex >= cards.length) return;

    setCards((prev) => {
      const next = [...prev];
      const [moved] = next.splice(cardIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  };

  // Step 2: Replace card text
  const handleReplaceCard = (cardId: string, newText: string, isCustom: boolean) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          return {
            ...c,
            text: newText,
            isReplaced: true,
            isCustom,
            replacedType: selectedNews.trapReplaceAs,
            currentType: selectedNews.trapReplaceAs || 'thought'
          };
        }
        return c;
      })
    );
  };

  // Step 4: Set marker on card
  const handleSetMarker = (cardId: string, marker: MarkerType) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          return { ...c, marker };
        }
        return c;
      })
    );
  };

  // Level 2 (Harder Mode): Trim words after wordIndex
  const handleTrimCardTail = (cardId: string, wordIndex: number) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const words = c.text.split(/\s+/).filter(Boolean);
          const trimmedText = words.slice(0, wordIndex + 1).join(' ');
          return {
            ...c,
            text: trimmedText
          };
        }
        return c;
      })
    );
  };

  // Reset current news to beginning
  const handleResetAll = () => {
    if (window.confirm('Почати монтаж цієї новини знову з чистого аркуша?')) {
      const initialCards = createInitialSentenceCards(selectedNews);
      setCards(initialCards);
      setBinCards([]);
      setCurrentStep(1);
    }
  };

  // Finish wizard & Validate for broadcast
  // Коротка анімація «Готуємо ефір…»: якщо щось не так — зупиняється й показує ОДНУ підказку
  const [isCheckingAir, setIsCheckingAir] = useState<boolean>(false);
  const handleFinishWizard = () => {
    if (isCheckingAir) return;
    const validation = validateWizard(selectedNews, cards, binCards);
    setIsCheckingAir(true);
    window.setTimeout(() => {
      setIsCheckingAir(false);
      if (validation.isValid) {
        soundManager.playSuccessFanfare();
        setHasSeenSuccess(true);
        setIsExportModalOpen(true);
      } else {
        soundManager.playHint();
        setValidationError(validation);
      }
    }, 1100);
  };

  const handleToggleMute = () => {
    soundManager.isMuted = !isMuted;
    setIsMuted(!isMuted);
  };

  // 1. Teacher Mode View
  if (appMode === 'teacher') {
    return (
      <TeacherDashboard
        onOpenNewsInEditor={(news) => {
          handleSelectNews(news);
          setAppMode('student');
        }}
        onSwitchToKidMode={() => setAppMode('student')}
      />
    );
  }

  // 2. Kid Mode: Screen 1 (Select Material)
  if (screen === 'select') {
    return (
      <NewsSelector
        newsList={NEWS_LIST}
        onSelectNews={handleSelectNews}
      />
    );
  }

  // 3. Kid Mode: Screen 2 (4-Step Wizard)
  return (
    <>
      <WizardScreen
        news={selectedNews}
        cards={cards}
        binCards={binCards}
        currentStep={currentStep}
        originalDuration={originalDuration}
        isHarderMode={isHarderMode}
        hasSeenSuccess={hasSeenSuccess}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onToggleHarderMode={() => setIsHarderMode(!isHarderMode)}
        onSetStep={(step) => setCurrentStep(step)}
        onCutCard={handleCutCard}
        onRestoreCard={handleRestoreCard}
        onMoveCard={handleMoveCard}
        onReplaceCard={handleReplaceCard}
        onSetMarker={handleSetMarker}
        onTrimCardTail={handleTrimCardTail}
        onFinishWizard={handleFinishWizard}
        onBackToNews={() => setScreen('select')}
        onResetAll={handleResetAll}
      />

      {/* Screen 3: Ready for Air Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        newsTitle={selectedNews.title}
        cards={cards}
        originalDuration={originalDuration}
        finalDuration={calculateCardsDuration(cards)}
        onClose={() => setIsExportModalOpen(false)}
        onNextNews={() => {
          setIsExportModalOpen(false);
          setScreen('select');
        }}
        onRemontage={() => {
          setIsExportModalOpen(false);
          handleResetAll();
        }}
      />

      {/* Анімація перевірки перед ефіром */}
      {isCheckingAir && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C2230] border-2 border-emerald-500/50 rounded-2xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl">
            <div className="text-4xl animate-bounce">🎬</div>
            <div className="text-lg font-extrabold text-white">Готуємо ефір…</div>
            <div className="h-3 bg-[#131720] rounded-full overflow-hidden border border-[#2C3549]">
              <div className="h-full w-1/2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Friendly Validation Error Dialog with "Повернутися до кроку N" */}
      {validationError && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C2230] border-2 border-amber-500/50 rounded-2xl w-full max-w-md p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl">
              🦅
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Сорока радить:
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                {validationError.title}
              </h3>
            </div>
            <p className="text-base text-slate-300 leading-relaxed font-medium">
              {validationError.message}
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  if (validationError.stepToReturn) {
                    setCurrentStep(validationError.stepToReturn);
                  }
                  setValidationError(null);
                }}
                className="h-14 px-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-base transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                Повернутися до кроку {validationError.stepToReturn || 1} ➡️
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
