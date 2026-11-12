import React, { useState } from 'react';
import { Users, RotateCcw, Check, Lock, Unlock, Film, ArrowRight } from 'lucide-react';
import { NEWS_LIST } from '../data/newsData';
import { NewsItem } from '../types';
import { soundManager } from '../utils/audio';

interface TeacherDashboardProps {
  onOpenNewsInEditor: (news: NewsItem) => void;
  onSwitchToKidMode: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onOpenNewsInEditor,
  onSwitchToKidMode
}) => {
  // State for which cards are marked taken (boolean array of 12 items)
  const [takenStatus, setTakenStatus] = useState<Record<number, boolean>>({});
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const toggleTaken = (id: number) => {
    soundManager.playClick();
    setTakenStatus((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleClearAll = () => {
    soundManager.playDelete();
    setTakenStatus({});
    setShowClearConfirm(false);
  };

  const takenCount = Object.values(takenStatus).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#13161F] text-slate-100 flex flex-col select-none">
      {/* Top Bar for Zoom demonstration */}
      <header className="h-16 bg-[#1A1F2C] border-b border-[#2B3242] px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xl shadow-lg shadow-blue-600/20">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs font-black tracking-widest uppercase text-blue-400">
              Сорока ТВ · Урок у Zoom
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-white">
              Екран ведучого / викладача
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono font-bold bg-[#232B3D] px-3 py-1.5 rounded-lg border border-[#313B52] text-slate-300">
            Зайнято: <span className="text-amber-400 font-extrabold">{takenCount}</span> / 12
          </div>

          <a
            href="./single-index.html"
            download="index.html"
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            title="Завантажити готовий один файл index.html для GitHub Pages"
          >
            <span>📥 Завантажити index.html</span>
          </a>

          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={takenCount === 0}
            className="px-3 py-1.5 bg-[#252C3E] hover:bg-rose-950/50 border border-[#323B52] hover:border-rose-500/40 text-slate-300 hover:text-rose-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            title="Очистити всі позначки для наступної групи"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Очистити все</span>
          </button>

          <button
            onClick={onSwitchToKidMode}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-colors"
          >
            <Film className="w-3.5 h-3.5" />
            <span>Режим дитини (Монтажна)</span>
          </button>
        </div>
      </header>

      {/* Confirmation Modal for Clear All */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#1C2230] border border-[#2F384C] rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              Очистити всі позначки «Зайнято»?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Це зніме відмітки з усіх 12 новин для нового уроку або іншої групи дітей.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 bg-[#252C3E] hover:bg-[#30384D] text-slate-300 rounded-lg text-xs font-semibold"
              >
                Скасувати
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
              >
                Так, очистити
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher facilitation tips banner */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-5 pb-3">
        <div className="bg-[#1A202D] border border-blue-500/30 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Як проводити вправу в Zoom (5 хвилин):
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              1. Виведіть цей екран у демонстрацію Zoom. <br className="hidden sm:inline" />
              2. Діти по черзі вигукують свій вибір: <strong className="text-amber-300">«Беру сьому!»</strong>. <br className="hidden sm:inline" />
              3. Клікайте по картці, щоб позначити її як <strong className="text-rose-400">ЗАЙНЯТО 🔒</strong> (повторний клік скасовує). <br className="hidden sm:inline" />
              4. Через 5 хвилин монтажу діти по черзі вмикають мікрофон і читають сюжет вголос!
            </p>
          </div>

          <div className="bg-black/40 border border-blue-500/20 rounded-lg px-4 py-2 text-center shrink-0">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Формула телесюжету</div>
            <div className="text-xs font-bold text-amber-300 mt-0.5">
              Думка 💡 → Бо 🔑 → Наприклад 📸
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
              Ціль: ≤ 30 секунд
            </div>
          </div>
        </div>
      </div>

      {/* 12 News Cards Grid for Teacher */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-4 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {NEWS_LIST.map((news) => {
            const isTaken = !!takenStatus[news.id];

            return (
              <div
                key={news.id}
                onClick={() => toggleTaken(news.id)}
                className={`relative rounded-xl border-2 p-4 flex flex-col justify-between transition-all duration-150 cursor-pointer shadow-md select-none ${
                  isTaken
                    ? 'bg-[#181B24] border-slate-700/60 opacity-60'
                    : 'bg-[#1C2230] border-[#2E374D] hover:border-amber-400'
                }`}
              >
                {/* Diagonal Strike-through line if taken */}
                {isTaken && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-[110%] h-0.5 bg-red-500/80 -rotate-12 shadow-sm" />
                  </div>
                )}

                <div>
                  {/* Big Number & Status Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-2xl font-black font-mono ${
                        isTaken ? 'text-slate-500' : 'text-amber-400'
                      }`}
                    >
                      #{news.id}
                    </span>

                    {isTaken ? (
                      <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-500/50 text-red-300 text-[11px] font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>ЗАЙНЯТО</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                        <Unlock className="w-3 h-3" />
                        <span>ВІЛЬНО</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-sm sm:text-base font-bold leading-snug ${
                      isTaken ? 'line-through text-slate-500' : 'text-white'
                    }`}
                  >
                    {news.title}
                  </h3>
                </div>

                {/* Bottom Action for Teacher: Open this in Editor */}
                <div className="pt-3 mt-3 border-t border-[#262E40] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    {isTaken ? 'Клік — розблокувати' : 'Клік — позначити'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.playClick();
                      onOpenNewsInEditor(news);
                    }}
                    className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 hover:underline"
                    title="Демонструвати монтаж цієї новини в Zoom"
                  >
                    <span>Відкрити</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
