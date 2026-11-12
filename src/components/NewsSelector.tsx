import React from 'react';
import { Film, Users, Sparkles, ArrowRight, Clock, Shuffle } from 'lucide-react';
import { NewsItem } from '../types';
import { soundManager } from '../utils/audio';

interface NewsSelectorProps {
  newsList: NewsItem[];
  onSelectNews: (news: NewsItem) => void;
  onSwitchToTeacher: () => void;
}

export const NewsSelector: React.FC<NewsSelectorProps> = ({
  newsList,
  onSelectNews,
  onSwitchToTeacher
}) => {
  const handleRandomPick = () => {
    soundManager.playClick();
    const randomIndex = Math.floor(Math.random() * newsList.length);
    onSelectNews(newsList[randomIndex]);
  };

  return (
    <div className="min-h-screen bg-[#15181F] text-slate-100 flex flex-col select-none">
      {/* Top Bar */}
      <header className="h-16 bg-[#1A1F2C] border-b border-[#2B3242] px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
            🦅
          </div>
          <div>
            <div className="text-xs font-black tracking-widest uppercase text-amber-400">
              Телеканал «Сорока ТВ»
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-white">
              Монтажна студія новин
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="./single-index.html"
            download="index.html"
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            title="Завантажити готовий один файл index.html для GitHub Pages"
          >
            <span>📥 Завантажити index.html</span>
          </a>

          <button
            onClick={handleRandomPick}
            className="px-3 py-1.5 bg-[#252C3E] hover:bg-[#30384D] border border-[#323B52] text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Випадкова новина</span>
          </button>

          <button
            onClick={onSwitchToTeacher}
            className="px-3 py-1.5 bg-[#252C3E] hover:bg-[#30384D] border border-[#323B52] text-slate-300 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Режим викладача (Zoom)</span>
          </button>
        </div>
      </header>

      {/* Hero instructions banner */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-6 sm:pt-8 pb-4">
        <div className="bg-gradient-to-r from-[#1E2536] via-[#212A3D] to-[#1A2234] border border-[#2F394E] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Завдання для юних монтажерів</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                Обери матеріал для свого 30-секундного ефіру!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Сорока принесла сирий матеріал із купою «води» та підступною пасткою. Розріж його лезом ✂️, викинь зайве, збережи формулу <strong className="text-amber-300">«Думка 💡 → Бо 🔑 → Наприклад 📸»</strong> та вкладися у 30 секунд!
              </p>
            </div>

            {/* Zoom callout bubble */}
            <div className="bg-black/50 border-2 border-amber-500/50 rounded-xl p-3 sm:p-4 text-center shrink-0">
              <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-extrabold mb-0.5">
                Підказка для уроку
              </div>
              <div className="text-xs sm:text-sm font-bold text-white">
                «Обери вільний номер і назви його вголос:
              </div>
              <div className="text-base sm:text-lg font-black text-amber-300 font-mono mt-0.5">
                „Беру сьому!“»
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 12 News Items */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-4 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {newsList.map((news) => {
            // Rough raw duration calculation
            const rawWordCount = news.segments.reduce(
              (sum, seg) => sum + seg.text.split(/\s+/).filter(Boolean).length,
              0
            );
            const rawDuration = Math.round(rawWordCount / 2.5);

            return (
              <div
                key={news.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectNews(news);
                }}
                className="group bg-[#1A1F2C] hover:bg-[#202737] border border-[#2B3448] hover:border-amber-400/80 rounded-xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-150 cursor-pointer shadow-md hover:shadow-xl hover:shadow-amber-500/10 active:scale-[0.98]"
              >
                <div>
                  {/* Card top badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-9 h-9 rounded-xl bg-[#262E40] group-hover:bg-amber-500 group-hover:text-slate-950 text-amber-400 font-mono text-base font-extrabold flex items-center justify-center transition-colors shadow-inner">
                      #{news.id}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-xs text-slate-400 bg-[#222837] px-2 py-0.5 rounded border border-[#2B3448]">
                      <Clock className="w-3 h-3 text-amber-400" />
                      сирий: ~0:{rawDuration}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-200 transition-colors leading-snug mb-2">
                    {news.title}
                  </h3>
                </div>

                {/* Bottom CTA */}
                <div className="pt-3 border-t border-[#262E40] flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-amber-300 transition-colors">
                  <span className="flex items-center gap-1">
                    <Film className="w-3.5 h-3.5" />
                    <span>Потрібен монтаж</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold group-hover:translate-x-1 transition-transform">
                    <span>Монтувати</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
