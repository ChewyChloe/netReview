import React from "react";
import { EXAM_SCOPE_INFO } from "../data/chapterData";
import { Calendar, BookOpen, AlertTriangle, AlertCircle } from "lucide-react";

export const ExamInfo: React.FC = () => {
  return (
    <div className="space-y-6 font-sans text-slate-900" id="exam-info-container">
      {/* Target Warning Alert Card */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 shadow-xs flex items-start gap-4">
        <div className="p-3 rounded-lg bg-amber-100/80 text-amber-700 shrink-0">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <h4 className="text-amber-800 font-bold text-base mb-1">
            【高頻預測 & 範圍剔除重要宣告】
          </h4>
          <p className="text-amber-900/90 text-sm leading-relaxed font-sans">
            Chapter 5 page 72 後面全部不列入必考重點範圍（即 SDN 控制平面後半與網路管理部分不考）。SDN 相關的傳統題目（亦即 SDN control plane）僅能作為延伸補充考點了解學科理念，不應被列入常規必考預測中，以免浪費寶貴的複習學時。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Schedule & Format */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-all duration-300 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <span className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/50">
              <Calendar className="h-5 w-5" />
            </span>
            <h3 className="text-base font-bold text-slate-800 font-sans tracking-tight">時間與題型</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">考試日期與時間</p>
              <p className="text-slate-800 font-semibold text-base font-sans mt-1">
                {EXAM_SCOPE_INFO.date}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">考試題型結構</p>
              <p className="text-slate-700 text-sm mt-1 leading-relaxed font-sans">
                {EXAM_SCOPE_INFO.format} (配分均等，考驗基本功與計算準確度。)
              </p>
            </div>
          </div>
        </div>

        {/* Excluded Materials */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-all duration-300 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <span className="p-2.5 rounded-xl bg-rose-50 text-rose-605 border border-rose-100/50">
              <AlertCircle className="h-5 w-5 text-rose-500" />
            </span>
            <h3 className="text-base font-bold text-slate-800 font-sans tracking-tight">剔除不考範圍</h3>
          </div>
          <ul className="space-y-2.5">
            {EXAM_SCOPE_INFO.excluded.map((item, idx) => (
              <li key={idx} className="flex gap-2 text-slate-650 text-sm leading-relaxed font-sans">
                <span className="text-rose-500 font-extrabold select-none">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Scope Details */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/50">
            <BookOpen className="h-5 w-5" />
          </span>
          <h3 className="text-base font-bold text-slate-800 font-sans tracking-tight">
            考試覆蓋主軸（Syllabus Focus）
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {EXAM_SCOPE_INFO.scope.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200/60 rounded-xl shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="text-slate-700 text-sm font-sans">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
