import React, { useState, useEffect } from "react";
import { ChapterId } from "./types";
import { HomeDashboard } from "./components/HomeDashboard";
import { ExamInfo } from "./components/ExamInfo";
import { ReviewSection } from "./components/ReviewSection";
import { FormulaSheet } from "./components/FormulaSheet";
import { Simulators } from "./components/Simulators";
import { QuizSection } from "./components/QuizSection";
import { StudyPlan } from "./components/StudyPlan";
import { ConceptMap } from "./components/ConceptMap";
import { InteractiveStudy } from "./components/InteractiveStudy";

// Lucide icons
import {
  Menu,
  X,
  BookOpen,
  Calendar,
  Zap,
  Play,
  AlertTriangle,
  Award,
  ChevronRight,
  TrendingUp,
  Flame,
  HelpCircle,
  Layers,
  Sparkles
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // States synced with localStorage
  const [completedConcepts, setCompletedConcepts] = useState<string[]>([]);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [mistakesList, setMistakesList] = useState<string[]>([]);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const savedConcepts = localStorage.getItem("completed_concepts");
      const savedChapters = localStorage.getItem("completed_chapters");
      const savedMistakes = localStorage.getItem("mistakes_list");

      if (savedConcepts) setCompletedConcepts(JSON.parse(savedConcepts));
      if (savedChapters) setCompletedChapters(JSON.parse(savedChapters));
      if (savedMistakes) setMistakesList(JSON.parse(savedMistakes));
    } catch (e) {
      console.error("Failed to load local storage values:", e);
    }
  }, []);

  const handleToggleConcept = (conceptId: string, chapterId: string) => {
    let nextConcepts = [...completedConcepts];
    if (nextConcepts.includes(conceptId)) {
      nextConcepts = nextConcepts.filter((id) => id !== conceptId);
    } else {
      nextConcepts.push(conceptId);
    }
    setCompletedConcepts(nextConcepts);
    localStorage.setItem("completed_concepts", JSON.stringify(nextConcepts));

    // Simple heuristic: if user marked at least 2 concepts as read, consider chapter reviewed
    const chapterKey = String(chapterId);
    let nextChapters = [...completedChapters];
    if (nextConcepts.filter((id) => id.includes(chapterKey.toLowerCase().replace(" ", ""))).length >= 2) {
      if (!nextChapters.includes(chapterKey)) {
        nextChapters.push(chapterKey);
      }
    } else {
      nextChapters = nextChapters.filter((ch) => ch !== chapterKey);
    }
    setCompletedChapters(nextChapters);
    localStorage.setItem("completed_chapters", JSON.stringify(nextChapters));
  };

  const handleAddMistake = (qId: string) => {
    if (!mistakesList.includes(qId)) {
      const nextMistakes = [...mistakesList, qId];
      setMistakesList(nextMistakes);
      localStorage.setItem("mistakes_list", JSON.stringify(nextMistakes));
    }
  };

  const handleRemoveMistake = (qId: string) => {
    const nextMistakes = mistakesList.filter((id) => id !== qId);
    setMistakesList(nextMistakes);
    localStorage.setItem("mistakes_list", JSON.stringify(nextMistakes));
  };

  const handleClearAllMistakes = () => {
    setMistakesList([]);
    localStorage.setItem("mistakes_list", JSON.stringify([]));
    localStorage.removeItem("mistakes_details");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Collapses the drawer on mobile/tablet after selection
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navItems = [
    { id: "home", label: "首頁總覽 Dashboard", icon: TrendingUp },
    { id: "info", label: "期末考試資訊 Exam Info", icon: Calendar },
    { id: "review", label: "核心高頻觀念 review", icon: BookOpen },
    { id: "interactive", label: "互動學習中心 Interactive", icon: Sparkles },
    { id: "map", label: "跨章節整合圖 Concept Map", icon: Layers },
    { id: "formulas", label: "必考公式卡 Formulas", icon: Zap },
    { id: "simulators", label: "手算動態模擬器 Solvers", icon: Play },
    { id: "quiz", label: "學霸題庫衝刺 Quiz Bank", icon: Award },
    { id: "mistakes", label: "經典錯題練兵 Mistakes", icon: AlertTriangle, badgeCount: mistakesList.length },
    { id: "sprint", label: "黃金48小時衝刺 Sprint", icon: Flame },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans select-none antialiased">
      
      {/* Upper Navigation Header bar for tablet & mobile */}
      <header className="lg:hidden bg-slate-50/95 border-b border-slate-200 backdrop-blur-md px-5 py-4 flex items-center justify-between sticky top-0 z-40 transition-all duration-300">
        <div className="flex items-center gap-2.5">
          <span className="p-1 px-2.5 rounded-lg bg-blue-50 text-blue-600 font-mono font-black text-sm tracking-widest leading-normal shadow-sm border border-blue-100 select-none">
            [netReview]
          </span>
          <span className="text-xxs text-slate-505 font-mono tracking-widest hidden sm:inline select-none uppercase">
            Computer Networking Study Portal
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white border border-slate-200 text-slate-500 rounded-xl hover:text-slate-800 transition-all cursor-pointer"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Main Structural Framework Layout */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        
        {/* SIDEBAR NAVIGATION - Collapsible on tablet/mobile dropdown */}
        <aside
          className={`lg:w-72 bg-slate-50 border-r border-slate-200/80 shrink-0 p-6 flex flex-col justify-between fixed lg:sticky top-[61px] lg:top-0 h-[calc(100vh-61px)] lg:h-screen z-30 transition-transform duration-300 w-full md:w-80 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div>
            {/* Desktop Brand Logo */}
            <div className="hidden lg:flex flex-col gap-1.5 pb-6 mb-6 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="p-1 px-3 rounded-xl bg-blue-50 text-blue-600 font-mono font-extrabold text-lg tracking-widest leading-loose shadow-sm border border-blue-100">
                  [netReview]
                </span>
                <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-md font-mono text-xxs font-bold select-none uppercase tracking-wider">
                  Final A+
                </span>
              </div>
              <span className="text-xxs text-slate-500 font-mono tracking-wide mt-1 leading-normal">
                Computer Networking Study Suite
              </span>
            </div>

            {/* Nav list elements */}
            <nav className="space-y-1.5 text-xs sm:text-sm">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-sans font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-blue-50/60 text-blue-700 border-l-4 border-blue-600 font-bold shadow-sm"
                        : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4.5 w-4.5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badgeCount !== undefined && item.badgeCount > 0 && (
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-full text-xxs font-mono font-bold shadow-sm">
                        {item.badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer info */}
          <div className="border-t border-slate-200/80 pt-4 text-xxs text-slate-500 leading-relaxed space-y-1 mt-6 font-sans">
            <p className="font-semibold text-slate-600 font-mono uppercase tracking-wide">考試複習系統 v2.4</p>
            <p>NTU Computer Networking Final Kit</p>
            <p>Designed for Academic Excellence.</p>
          </div>
        </aside>

        {/* MAIN DISPLAY VIEWPORT */}
        <main className="flex-1 p-5 md:p-8 max-w-5xl mx-auto w-full overflow-y-auto leading-relaxed space-y-8 select-text bg-white">
          {activeTab === "home" && (
            <HomeDashboard
              onNavigate={handleTabChange}
              completedChapters={completedChapters}
            />
          )}

          {activeTab === "info" && <ExamInfo />}

          {activeTab === "review" && (
            <ReviewSection
              completedConcepts={completedConcepts}
              onToggleConcept={handleToggleConcept}
            />
          )}

          {activeTab === "interactive" && <InteractiveStudy />}

          {activeTab === "map" && <ConceptMap />}

          {activeTab === "formulas" && <FormulaSheet />}

          {activeTab === "simulators" && <Simulators />}

          {activeTab === "quiz" && (
            <QuizSection
              onAddMistake={handleAddMistake}
              onRemoveMistake={handleRemoveMistake}
              mistakesList={mistakesList}
            />
          )}

          {activeTab === "mistakes" && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900 font-sans tracking-tight">
                  錯誤複習筆記（錯題訓練本）
                </h2>
                <p className="text-slate-500 text-xs">
                  此處將自動收錄你在大考題庫中作答錯誤的題目，供你專屬攻關，直到答對為止。
                </p>
              </div>
              <QuizSection
                onAddMistake={handleAddMistake}
                onRemoveMistake={handleRemoveMistake}
                onClearAllMistakes={handleClearAllMistakes}
                mistakesList={mistakesList}
                onlyMistakesMode={true}
              />
            </div>
          )}

          {activeTab === "sprint" && <StudyPlan />}
        </main>
      </div>
    </div>
  );
}
