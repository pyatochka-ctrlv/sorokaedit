import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Radio, Sparkles, CheckCircle2 } from 'lucide-react';
import { SentenceCard } from '../types';
import { soundManager } from '../utils/audio';

interface ExportModalProps {
  isOpen: boolean;
  newsTitle: string;
  cards: SentenceCard[];
  originalDuration: number;
  finalDuration: number;
  onClose: () => void;
  onNextNews: () => void;
  onRemontage: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  newsTitle,
  cards,
  originalDuration,
  finalDuration,
  onClose,
  onNextNews,
  onRemontage
}) => {
  const [isPrompterPlaying, setIsPrompterPlaying] = useState<boolean>(false);
  const [prompterWordIndex, setPrompterWordIndex] = useState<number>(0);

  // Flatten all words across the 3 cards
  const allWords = cards.flatMap((card) => card.text.trim().split(/\s+/).filter(Boolean));

  // Prompter: 2 words per second = 500ms per word
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPrompterPlaying) {
      interval = setInterval(() => {
        setPrompterWordIndex((prev) => {
          if (prev >= allWords.length - 1) {
            setIsPrompterPlaying(false);
            return allWords.length - 1;
          }
          return prev + 1;
        });
      }, 500); // 2 words/second = 500ms
    }
    return () => clearInterval(interval);
  }, [isPrompterPlaying, allWords.length]);

  useEffect(() => {
    if (isOpen) {
      setPrompterWordIndex(0);
      setIsPrompterPlaying(false);
      soundManager.playSuccessFanfare();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formattedOriginal = `0:${Math.round(originalDuration) < 10 ? '0' : ''}${Math.round(originalDuration)}`;
  const formattedFinal = `0:${Math.round(finalDuration) < 10 ? '0' : ''}${Math.round(finalDuration)}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none overflow-y-auto">
      <div className="bg-[#181D29] border border-[#2D364A] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Broadcast Badge Banner (No red color - sleek emerald & gold) */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-white animate-ping" />
            <span className="flex items-center gap-2 font-black tracking-widest uppercase text-xs sm:text-sm bg-black/30 px-3 py-1 rounded-full border border-white/30">
              <Radio className="w-4 h-4 text-white" />
              ГОТОВО ДО ЕФІРУ
            </span>
          </div>

          {/* Duration Comparison Badge */}
          <div className="font-mono text-xs sm:text-sm font-bold bg-black/40 px-3.5 py-1.5 rounded-xl border border-white/20">
            Було <span className="line-through opacity-70">{formattedOriginal}</span> → Стало{' '}
            <span className="text-emerald-300 font-extrabold">{formattedFinal}</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* News Title */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-extrabold">
              Сюжет теленовин
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mt-0.5">
              {newsTitle}
            </h2>
          </div>

          {/* Assembled 3 Parts with 💡 🔑 📸 in Large Text */}
          <div className="space-y-4 bg-[#131720] border border-[#2B3448] rounded-2xl p-4 sm:p-6">
            {cards.map((card) => {
              let badge = '💡 Що я думаю';
              let badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/50';
              if (card.marker === 'reason') {
                badge = '🔑 Чому (Бо)';
                badgeBg = 'bg-blue-500/20 text-blue-300 border-blue-500/50';
              } else if (card.marker === 'example') {
                badge = '📸 Приклад';
                badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
              }

              return (
                <div key={card.id} className="space-y-1.5">
                  <span
                    className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${badgeBg}`}
                  >
                    {badge}
                  </span>
                  <p className="text-[20px] sm:text-[22px] font-semibold text-slate-100 leading-relaxed">
                    {card.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Call to action for Zoom speech */}
          <div className="bg-amber-950/30 border-2 border-amber-500/40 rounded-2xl p-4 sm:p-5 text-amber-200">
            <div className="flex items-center gap-2 font-black text-base sm:text-lg text-amber-300 mb-1">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Твій вихід у прямий ефір!</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Тепер прочитай свій коментар <strong className="text-white font-bold">ГОЛОСОМ</strong>, коли ведучий передасть тобі слово в Zoom. Розкажи, що ти вирізав і що замінив!
            </p>
          </div>

          {/* "Суфлер" (Teleprompter) Rehearsal Mode (2 words/second) */}
          <div className="bg-[#1C2333] border border-[#2D364A] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (prompterWordIndex >= allWords.length - 1) {
                      setPrompterWordIndex(0);
                    }
                    setIsPrompterPlaying(!isPrompterPlaying);
                  }}
                  className="h-12 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 active:scale-95"
                >
                  {isPrompterPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-slate-950" />
                      <span>Пауза</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>Режим «Суфлер» ▶</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsPrompterPlaying(false);
                    setPrompterWordIndex(0);
                  }}
                  className="p-3 bg-[#252E42] text-slate-300 hover:text-white rounded-xl transition-colors"
                  title="Скинути суфлер"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs font-mono font-bold text-slate-400">
                Швидкість: 2 слова/сек
              </div>
            </div>

            {/* Karaoke Teleprompter Read-along text */}
            {isPrompterPlaying && (
              <div className="bg-[#121620] border border-[#2A3446] rounded-xl p-4 text-lg font-medium leading-relaxed max-h-36 overflow-y-auto">
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  {allWords.map((word, wIdx) => {
                    const isSpoken = wIdx <= prompterWordIndex;
                    const isCurrent = wIdx === prompterWordIndex;
                    return (
                      <span
                        key={wIdx}
                        className={`transition-all rounded px-1 ${
                          isCurrent
                            ? 'bg-amber-400 text-slate-950 font-black scale-105 shadow'
                            : isSpoken
                            ? 'text-slate-200 font-bold'
                            : 'text-slate-500'
                        }`}
                      >
                        {word}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 sm:p-5 bg-[#141822] border-t border-[#2D364A] flex items-center justify-between gap-3">
          <button
            onClick={onRemontage}
            className="h-14 px-6 bg-[#232B3E] hover:bg-[#2C364E] text-slate-300 hover:text-white rounded-xl text-sm font-bold transition-colors"
          >
            Змонтувати ще раз 🔄
          </button>

          <button
            onClick={onNextNews}
            className="h-14 px-7 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-base font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-transform active:scale-95"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Ще одна новина</span>
          </button>
        </div>
      </div>
    </div>
  );
};
