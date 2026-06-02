import React, { useState, useEffect } from "react";
import { 
  Compass, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  CheckCircle2, 
  MapPin, 
  BookOpen, 
  Layers, 
  Sparkles, 
  Zap, 
  Play, 
  Award, 
  AlertTriangle, 
  Flame,
  HelpCircle,
  TrendingUp,
  ArrowRight
} from "lucide-react";

interface GuideStep {
  id: number;
  tabId: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  desc: string;
  whyImportant: string;
  actionLabel: string;
  tips: string[];
}

const GUIDE_STEPS: GuideStep[] = [
  {
    id: 1,
    tabId: "info",
    title: "1. 掌握戰局：期末考試資訊",
    subtitle: "查看本學期最新考試日程、佔比與不考雷區",
    icon: Compass,
    desc: "首先掌握期末考的物理資訊！了解分值、時間分佈與助教公告的「防禦盾牌部分不考範圍」，精準縮小讀書視角，拒絕無效益的磨難。",
    whyImportant: "考前防禦：Ch 5 後半部 SDN、Homework 3 宣告不考，避開這些能為你省下 5 小時無效耗費時間！",
    actionLabel: "前往考試資訊 ➔",
    tips: ["確認自己的考試場地與座位配置", "注意計算與問答題所覆蓋的二、三、四層重點關鍵字"]
  },
  {
    id: 2,
    tabId: "review",
    title: "2. 基礎鞏固：精讀核心觀念",
    subtitle: "研讀 Ch4、Ch5、Ch6 高頻必考學理對帳單",
    icon: BookOpen,
    desc: "系統提煉了投影片 300+ 頁的考點。按章節順序讀透 DHCP 廣播、最長前綴匹配 (LPM)、L2 Switch 自學自轉。研讀完可按下「標記已讀」，累計複習儀表進度。",
    whyImportant: "打底功夫：大考中的 40% 單選與簡答題答案皆隱藏於此，必須深入掌握名詞本質。",
    actionLabel: "前往核心觀念 ➔",
    tips: ["建議讀完一個重點就在右上角標記「已讀」", "若看見 [Warning!] 字樣請多重複看三遍"]
  },
  {
    id: 3,
    tabId: "map",
    title: "3. 腦圖整合：跨章節完美解構",
    subtitle: "打破章節界線，整合封包與全圖脈絡",
    icon: Layers,
    desc: "期末考最常考跨章節綜合題。在這裡，我們提供「高頻互動心智圖」與「端到端封包歷險記」，模擬一個封包從主機 A DHCP 開機、DNS 解析到 BGP / OSPF、過閘、最後 MAC Hop-by-Hop 的完整旅程。",
    whyImportant: "打通任督二脈：徹底釐清「IP 全程不變，MAC 逐跳改頭換面」的經典痛點，穩拿 15 分跨域題元！",
    actionLabel: "查看心智拼圖 ➔",
    tips: ["點擊封包歷險記一步驟一步驟跟著跑一次", "在心智圖中點擊任意考點卡，查閱對應期末考真題與學霸解析"]
  },
  {
    id: 4,
    tabId: "interactive",
    title: "4. 動態解密：圖形化互動研讀",
    subtitle: "動手操縱 OpenFlow、CSMA 等複雜系統邏輯",
    icon: Sparkles,
    desc: "讀文字太抽象？「互動學習中心」提供動態系統匹配交互，你可以手動配置 Match-Action Rules，將 Switch 當作 Firewall、Router 或 NAT 運轉，並用圖像化動畫觀測 ARP、CSMA 物理運作。",
    whyImportant: "轉抽象為具體：考前不再「死記硬背」，透過親身互動將網絡動態架構儲存至大腦深處。",
    actionLabel: "開啟動態探索 ➔",
    tips: ["操作 OpenFlow 流表，觀察封包如何被篩選與丟棄", "觀察 CSMA-CD 在發生碰撞時對應的倍數退避邏輯"]
  },
  {
    id: 5,
    tabId: "formulas",
    title: "5. 必背卡片：大考高能公式集中營",
    subtitle: "速記 Buffer 尺寸、IPv4 標頭、常見 Port 與對照",
    icon: Zap,
    desc: "網概期末的一大特色就是充斥各種計算公式與常數。我們貼心設計了「必考公式與對稱卡片」，彙整 RTT Buffer $B=RTT\\times C/\\sqrt{N}$、CIDR 子網可用 IP $2^{32-x}-2$ 與兩層範疇對帳表。",
    whyImportant: "速成取分：這 10+ 張公式卡片涵蓋所有手算與計算題的前置定理，考前 10 分鐘速讀最佳！",
    actionLabel: "速查公式卡 ➔",
    tips: ["利用 [不進位 XOR 模二除算] 當作 CRC 計算的起點記憶", "背誦 ARP、DHCP、DNS 用的協定與端口號 (UDP 53, 67, 68 等)"]
  },
  {
    id: 6,
    tabId: "simulators",
    title: "6. 手算特訓：手寫模擬起死回生",
    subtitle: "手算 Dijkstra 最短路徑步矩陣與 CRC 直式除法",
    icon: Play,
    desc: "考試最痛失分點是 Dijkstra 矩陣手算忘記標 parent、或是 CRC 除錯除錯除不盡。「手寫動態模擬器」專為解決此痛點而生，輸入任意拓撲或二進制碼，即時推導出期末試卷格式的 100 分表格步驟！",
    whyImportant: "狂撈 25+ 分：今年 100% 續考 2 道特大計算題（Dijkstra + CRC 模二除算），熟用這兩台模擬器，此大題滿分勢在必得！",
    actionLabel: "開啟手算模擬 ➔",
    tips: ["可以在白紙上先算出一個練習拓撲，再輸入模擬器對帳", "詳讀 Dijkstra 計算中 D(v) 鬆弛與 parent 回補流程"]
  },
  {
    id: 7,
    tabId: "quiz",
    title: "7. 題庫衝刺：大考原題高強度實戰",
    subtitle: "刷完精排 MCQ、問答與計算題，檢驗學習成果",
    icon: Award,
    desc: "進入「學霸題庫衝刺」進行仿真模考。收錄了包含本學期熱點、歷屆最刁鑽單選題、手寫題模型。作答錯誤的題目別擔心，系統會精準追溯並自動存入你的「專屬錯題本」中。",
    whyImportant: "提前亮劍：在真正的戰場上最能發現漏洞，幫助你提防考卷中的單選藏雷選項。",
    actionLabel: "前往仿真題庫 ➔",
    tips: ["答對後，可以研讀 100 分「滿分答題模板」，了解助教改卷扣分點", "遇到疑惑時點開「選項對照深入剖析」查看學霸複習觀點"]
  },
  {
    id: 8,
    tabId: "mistakes",
    title: "8. 終極突破：錯題攻堅與黃金 48 小時",
    subtitle: "針對錯題各個擊破，在黃金衝刺階段精準收尾",
    icon: AlertTriangle,
    desc: "最後的關鍵一公里！在「經典錯題練兵」中集中功課你作答錯誤的題目，直至完全搞懂，達到錯題本『無泥埃』境界。考前 48 小時，遵照「黃金衝刺計劃」所建議的黃金時間軸，逐一拿下關鍵指標，直取 A+！",
    whyImportant: "直取卓越：真正的 A+ 學生，就在於是否能把懂的做對、把錯的改會！",
    actionLabel: "突破終極瓶頸 ➔",
    tips: ["在錯題本中反复重測同一題直至百分百過關", "按照 Study Plan 的時間點（考前 24、12、2 小時）各做一次重點檢閱"]
  }
];

export interface UserGuideProps {
  onNavigate: (tabId: string) => void;
  currentTab: string;
}

export const UserGuide: React.FC<UserGuideProps> = ({ onNavigate, currentTab }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Load completed steps from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("completed_guide_steps");
      if (saved) {
        setCompletedSteps(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleToggleStepComplete = (stepId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    let next;
    if (completedSteps.includes(stepId)) {
      next = completedSteps.filter(id => id !== stepId);
    } else {
      next = [...completedSteps, stepId];
    }
    setCompletedSteps(next);
    localStorage.setItem("completed_guide_steps", JSON.stringify(next));
  };

  const handleResetGuide = () => {
    setCompletedSteps([]);
    localStorage.setItem("completed_guide_steps", JSON.stringify([]));
    setCurrentStepIdx(0);
  };

  const currentStep = GUIDE_STEPS[currentStepIdx];
  const progressPercent = Math.round((completedSteps.length / GUIDE_STEPS.length) * 100);

  return (
    <div className="font-sans antialiased" id="onboarding-guide-module">
      
      {/* 1. Dashboard Widget Mode: Inline display of the recommended study path */}
      <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/60 border border-blue-150 rounded-3xl p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Compass className="h-32 w-32 text-blue-600" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-blue-100 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 bg-blue-600 text-white rounded-lg">
                <Compass className="h-4.5 w-4.5" />
              </span>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                🏆 網概合格直升 A+ 金牌複習步驟指引
              </h3>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              為你量身打造的精準複習流程 (Sequence Tour)。請按此建議順序使用各項功能，考前高能通關！
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Interactive Progress Ring/Bar */}
            <div className="text-right">
              <span className="text-[10px] font-mono font-bold text-blue-750 block">複習規劃完成度</span>
              <span className="text-xs font-mono font-extrabold text-blue-700">{completedSteps.length} / {GUIDE_STEPS.length} 關卡</span>
            </div>
            <button
              onClick={() => {
                setIsOpen(true);
                setCurrentStepIdx(0);
              }}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ml-1"
            >
              <Compass className="h-3.5 w-3.5 animate-spin-pulse" />
              <span>開啟逐步引導 ➔</span>
            </button>
          </div>
        </div>

        {/* Dynamic Study Progress Tracker bar */}
        <div className="mb-6">
          <div className="h-2 w-full bg-slate-200/70 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-1.5">
            <span>START (Day 1)</span>
            <span className="font-bold text-blue-600">{progressPercent}% 護體</span>
            <span>A+ DESTINATION (Exam Day)</span>
          </div>
        </div>

        {/* Stepper sequence boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GUIDE_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isDone = completedSteps.includes(step.id);
            const isHighlight = currentTab === step.tabId;

            return (
              <div
                key={step.id}
                onClick={() => {
                  setIsOpen(true);
                  setCurrentStepIdx(idx);
                }}
                className={`bg-white/90 border rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.01] relative flex flex-col justify-between group ${
                  isHighlight 
                    ? "border-blue-500 ring-2 ring-blue-100 bg-white" 
                    : isDone 
                      ? "border-emerald-250 bg-emerald-50/20" 
                      : "border-slate-200/80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2.5">
                    <span className={`text-[10px] font-mono font-black ${
                      isDone ? "text-emerald-600" : isHighlight ? "text-blue-600 animate-pulse" : "text-slate-400"
                    }`}>
                      STEP 0{step.id}
                    </span>
                    
                    {/* Tiny checking trigger */}
                    <button
                      onClick={(e) => handleToggleStepComplete(step.id, e)}
                      className={`p-0.5 rounded-full border transition-all ${
                        isDone 
                          ? "bg-emerald-100 border-emerald-300 text-emerald-700" 
                          : "bg-slate-50 border-slate-200 text-slate-300 hover:border-slate-400"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      isDone ? "bg-emerald-50 text-emerald-600" : isHighlight ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold leading-normal font-sans tracking-wide ${
                        isDone ? "text-slate-500 line-through" : "text-slate-800"
                      }`}>
                        {step.title.substring(3)}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-sans leading-normal mt-0.5 group-hover:text-slate-600 transition-colors">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100/80 pt-3 mt-3.5 flex items-center justify-between text-[10px] font-mono font-bold">
                  <span className={`${isHighlight ? "text-blue-600" : "text-slate-400"}`}>
                    {isHighlight ? "● 正在讀此分頁" : "點擊查閱觀點"}
                  </span>
                  <span className="text-blue-600 hover:underline flex items-center gap-0.5">
                    <span>導航</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset button bar if completed most */}
        {completedSteps.length > 0 && (
          <div className="flex justify-end mt-4">
            <button
              onClick={handleResetGuide}
              className="text-[10px] font-mono text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              重置我已完成的所有步驟 ✕
            </button>
          </div>
        )}
      </div>

      {/* 2. Full screen Stepper / Popup Guided overlay Tour */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl flex flex-col justify-between max-h-[90vh] overflow-y-auto space-y-6 relative animate-scale-up">
            
            {/* Upper dialog header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 px-2.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100 font-mono text-[10px] font-bold">
                  學習步驟 {currentStepIdx + 1} / {GUIDE_STEPS.length}
                </span>
                <span className="text-xxs text-slate-405 font-mono font-bold uppercase tracking-wider">
                  GOLDEN SEQUENCE STUDY TOUR
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 px-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors cursor-pointer"
              >
                關閉 ✕
              </button>
            </div>

            {/* Main Interactive Onboarding Card Content */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3.5 bg-blue-50/70 text-blue-600 border border-blue-100 rounded-2xl shrink-0">
                  {React.createElement(currentStep.icon, { className: "h-7 w-7 text-blue-600 animate-pulse" })}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-sans font-extrabold tracking-tight text-slate-950">
                    {currentStep.title}
                  </h3>
                  <p className="text-xxs font-mono font-bold text-slate-400 uppercase mt-0.5 tracking-wider">
                    目標模組：{currentStep.subtitle}
                  </p>
                </div>
              </div>

              {/* Description Paragraph */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 text-xs sm:text-sm text-slate-650 leading-relaxed font-sans">
                {currentStep.desc}
              </div>

              {/* Crucial 'Why Important' callout */}
              <div className="bg-amber-50/40 border border-amber-200 rounded-2xl p-4 space-y-1.5 shadow-xxs">
                <span className="text-xxs font-bold text-amber-700 font-mono tracking-wider uppercase block">為什麼第一步走這裡？ (CRUCIAL REASON)</span>
                <p className="text-xs text-slate-705 font-sans leading-relaxed">
                  {currentStep.whyImportant}
                </p>
              </div>

              {/* 學霸 Tips */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-slate-450 uppercase block font-semibold">金牌考研小叮嚀 (STUDY TIPS & CHEATING TRICKS)</span>
                <div className="grid grid-cols-1 gap-2">
                  {currentStep.tips.map((tip, tIdx) => (
                    <div key={tIdx} className="bg-white border border-slate-200/70 p-2.5 rounded-xl text-xxs sm:text-xs text-slate-600 leading-relaxed font-sans flex items-start gap-2">
                      <span className="text-blue-500 font-bold">✓</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation and state management buttons inside overlay */}
            <div className="border-t border-slate-150 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const isDone = completedSteps.includes(currentStep.id);
                    let next;
                    if (isDone) {
                      next = completedSteps.filter(id => id !== currentStep.id);
                    } else {
                      next = [...completedSteps, currentStep.id];
                    }
                    setCompletedSteps(next);
                    localStorage.setItem("completed_guide_steps", JSON.stringify(next));
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xxs font-sans font-bold flex items-center gap-1 cursor-pointer w-full justify-center sm:w-auto ${
                    completedSteps.includes(currentStep.id)
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{completedSteps.includes(currentStep.id) ? "標記為『未完成』" : "此關卡已讀完（打勾）"}</span>
                </button>
              </div>

              <div className="flex justify-between sm:justify-end items-center gap-2 w-full sm:w-auto">
                <button
                  disabled={currentStepIdx === 0}
                  onClick={() => setCurrentStepIdx(currentStepIdx - 1)}
                  className="px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-200 disabled:opacity-40 rounded-xl text-xxs transition-all font-sans font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>上一步</span>
                </button>

                <button
                  onClick={() => {
                    // Mark step as complete automatically if user navigates to it
                    if (!completedSteps.includes(currentStep.id)) {
                      const next = [...completedSteps, currentStep.id];
                      setCompletedSteps(next);
                      localStorage.setItem("completed_guide_steps", JSON.stringify(next));
                    }
                    onNavigate(currentStep.tabId);
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white shadow-md rounded-xl text-xxs sm:text-xs font-sans font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>{currentStep.actionLabel}</span>
                </button>

                {currentStepIdx < GUIDE_STEPS.length - 1 ? (
                  <button
                    onClick={() => setCurrentStepIdx(currentStepIdx + 1)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-white rounded-xl text-xxs font-sans font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>下一步</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xxs font-sans font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>結束引導 🎉</span>
                  </button>
                )}
              </div>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
};
