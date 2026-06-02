import React, { useState } from "react";
import { CHAPTER_REVIEW_DATA } from "../data/chapterData";
import { ChapterId } from "../types";
import { LatexRenderer } from "./LatexRenderer";
import { Search, CheckCircle, Circle, BookOpen } from "lucide-react";

interface ReviewSectionProps {
  completedConcepts: string[];
  onToggleConcept: (conceptId: string, chapterTitle: string) => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  completedConcepts,
  onToggleConcept,
}) => {
  const [selectedChapter, setSelectedChapter] = useState<ChapterId>(ChapterId.CH4);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState<"all" | "highFreq" | "mustKnow">("all");

  const activeChapterData = CHAPTER_REVIEW_DATA.find((ch) => ch.id === selectedChapter);

  // Parse text searching for \( ... \) blocks and render them live as Latex components
  const renderTextWithMath = (text: string) => {
    if (!text) return "";
    const parts = text.split(/(\\\([\s\S]*?\\\)|\$\$[\s\S]*?\$\$)/g);

    return parts.map((part, idx) => {
      if (part.startsWith("\\(") && part.endsWith("\\)")) {
        const math = part.slice(2, -2);
        return <LatexRenderer key={idx} math={math} block={false} />;
      }
      if (part.startsWith("$$") && part.endsWith("$$")) {
        const math = part.slice(2, -2);
        return <LatexRenderer key={part + idx} math={math} block={true} />;
      }
      return <span key={idx} className="whitespace-pre-line leading-relaxed text-slate-700 font-sans">{part}</span>;
    });
  };

  const filteredConcepts = (activeChapterData?.concepts || []).filter((concept) => {
    const matchesSearch =
      concept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      concept.contentMarkdown.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTag === "highFreq") return concept.isHighFreq;
    if (filterTag === "mustKnow") return concept.isMustKnow;
    return true;
  });

  return (
    <div className="space-y-6 font-sans text-slate-900" id="review-section-container">
      {/* Chapter Selection Header Tabs */}
      <div className="flex flex-col sm:flex-row gap-2 border-b border-slate-205 pb-3">
        {CHAPTER_REVIEW_DATA.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setSelectedChapter(ch.id)}
            className={`px-4 py-3 rounded-xl font-sans text-sm font-semibold tracking-wide transition-all duration-200 text-left sm:text-center shrink-0 cursor-pointer ${
              selectedChapter === ch.id
                ? "bg-blue-600 text-white shadow-sm border border-blue-500"
                : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            {ch.id === ChapterId.CH4 ? "Ch4: Data Plane" : ch.id === ChapterId.CH5 ? "Ch5: Control Plane" : "Ch6: Link Layer & LANs"}
          </button>
        ))}
      </div>

      {/* Concept Search and Controls */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋知識點關鍵字（例如：Dijkstra, NAT, OSPF, CRC...）"
            className="w-full bg-white text-slate-800 text-sm font-sans pl-10 pr-4 py-2.5 rounded-xl border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition-all placeholder-slate-400"
          />
        </div>

        {/* Filter badge switches */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto scrollbar-none py-1 justify-start md:justify-end">
          <button
            onClick={() => setFilterTag("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans shrink-0 border transition-all cursor-pointer ${
              filterTag === "all"
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-800 shadow-xxs"
            }`}
          >
            全部觀念
          </button>
          <button
            onClick={() => setFilterTag("highFreq")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans shrink-0 border transition-all flex items-center gap-1.5 cursor-pointer ${
              filterTag === "highFreq"
                ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300"
            }`}
          >
            🔥 High Frequency 位
          </button>
          <button
            onClick={() => setFilterTag("mustKnow")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans shrink-0 border transition-all flex items-center gap-1.5 cursor-pointer ${
              filterTag === "mustKnow"
                ? "bg-emerald-605 bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300"
            }`}
          >
            💡 Must Know 💡
          </button>
        </div>
      </div>

      {/* Concepts List Grid */}
      <div className="space-y-6">
        {filteredConcepts.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 border border-slate-200 rounded-2xl">
            <p className="text-slate-500 text-sm font-sans">找不到符合搜尋條件的觀念或知識點項目。</p>
          </div>
        ) : (
          filteredConcepts.map((concept) => {
            const isCompleted = completedConcepts.includes(concept.id);

            return (
              <div
                key={concept.id}
                className={`bg-white border rounded-2xl p-6 transition-all duration-200 shadow-xs ${
                  concept.isWarning
                    ? "border-amber-300 bg-amber-50/20"
                    : isCompleted
                    ? "border-emerald-300 bg-emerald-50/10"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Concept Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xxs font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 tracking-wide">
                        {concept.id.split("-")[1]?.toUpperCase() || "CONCEPT"}
                      </span>
                      {concept.isHighFreq && (
                        <span className="text-xxs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          High Frequency 🔥
                        </span>
                      )}
                      {concept.isMustKnow && (
                        <span className="text-xxs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Must Know 💡
                        </span>
                      )}
                      {concept.isWarning && (
                        <span className="text-xxs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          範圍警戒標示 ✕
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-sans tracking-tight font-bold text-slate-900">
                      {concept.title}
                    </h3>
                  </div>

                  {/* Mark completed checklists toggle */}
                  <button
                    onClick={() => onToggleConcept(concept.id, selectedChapter)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all shrink-0 ${
                      isCompleted
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold"
                        : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700"
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-emerald-605 text-emerald-600" />
                        <span>已完成複習</span>
                      </>
                    ) : (
                      <>
                        <Circle className="h-4 w-4 text-slate-400" />
                        <span>標記為已讀</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Concept Main Content Body */}
                <div className="max-w-none text-slate-700 text-sm leading-relaxed space-y-4 font-sans prose prose-slate">
                  {renderTextWithMath(concept.contentMarkdown)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
