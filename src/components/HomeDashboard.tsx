import React, { useEffect, useState } from "react";
import { Clock, Play, Award, Zap, BookOpen, AlertTriangle, CheckCircle, ShieldAlert, Sparkles, AlertCircle, BarChart2, BookOpen as BookIcon, Clipboard } from "lucide-react";
import { QUIZ_BANK } from "../data/quizBank";
import { UserGuide } from "./UserGuide";

interface HomeDashboardProps {
  onNavigate: (tab: string) => void;
  completedChapters: string[];
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  completedChapters,
}) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; mins: number; secs: number }>({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  const [mistakeCount, setMistakeCount] = useState(0);
  const [weakestTopic, setWeakestTopic] = useState<{ topic: string; count: number } | null>(null);

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem("mistakes_list") || "[]");
      setMistakeCount(list.length);

      const details = JSON.parse(localStorage.getItem("mistakes_details") || "{}");
      const topicWeights: { [topic: string]: number } = {};

      list.forEach((qId: string) => {
        const q = QUIZ_BANK.find((item) => item.id === qId);
        if (q) {
          const errRecord = details[qId];
          const errCount = errRecord && typeof errRecord.count === "number" ? errRecord.count : 1;
          topicWeights[q.topic] = (topicWeights[q.topic] || 0) + errCount;
        }
      });

      let maxTopic = "";
      let maxCount = 0;
      Object.entries(topicWeights).forEach(([topic, count]) => {
        if (count > maxCount) {
          maxCount = count;
          maxTopic = topic;
        }
      });

      if (maxTopic) {
        setWeakestTopic({ topic: maxTopic, count: maxCount });
      } else {
        setWeakestTopic(null);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    // Final Exam: June 9, 2026 at 14:10
    const examDate = new Date("2026-06-09T14:10:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = examDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days: d, hours: h, mins: m, secs: s });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Top 10 High Frequency Candidates Topics
  const HOT_SPOTS_TOP_10 = [
    { rank: 1, name: "Dijkstra’s Algorithm", rate: "100%", desc: "Dijkstra 最短路徑選擇手算矩陣與轉發表填寫（考古題第 19 題壓軸題！）", bg: "bg-teal-50/40", border: "border-teal-200/60", text: "text-teal-900", countColor: "bg-teal-100 text-teal-800" },
    { rank: 2, name: "Distance Vector / Bellman-Ford", rate: "95%", desc: "距離向量 Bellman-Ford 表格遞迴運轉，壞消息傳得慢、計數到無窮大原理解析（第一階段 V、第二階段 X 考點）", bg: "bg-teal-50/40", border: "border-teal-200/60", text: "text-teal-900", countColor: "bg-teal-100 text-teal-800" },
    { rank: 3, name: "OSPF vs BGP 運作機制與熱馬鈴薯選路", rate: "90%", desc: "iBGP / eBGP 的宣告差異、OSPF 分區域設計優勢，以及熱馬鈴薯政策選路順序", bg: "bg-teal-50/40", border: "border-teal-200/60", text: "text-teal-900", countColor: "bg-teal-100 text-teal-800" },
    { rank: 4, name: "NAT 網路地址轉換", rate: "85%", desc: "私口與公口 TCP/UDP Port 映射、埠號更換生命週期與 NAT 表映射手算", bg: "bg-blue-50/40", border: "border-blue-200/60", text: "text-blue-900", countColor: "bg-blue-100 text-blue-800" },
    { rank: 5, name: "IPv4/IPv6 & Fragmentation", rate: "85%", desc: "IP 首部 Overhead 開銷計算、IPv4 分片 Offset / MF 旗標模八除算（投影片 4000 位組分片真題）", bg: "bg-blue-50/40", border: "border-blue-200/60", text: "text-blue-900", countColor: "bg-blue-100 text-blue-800" },
    { rank: 6, name: "CIDR / 最長前綴匹配", rate: "80%", desc: "最長前綴匹配（Longest Prefix Matching）二進制對比查找與子網彙組轉發", bg: "bg-blue-50/40", border: "border-blue-200/60", text: "text-blue-900", countColor: "bg-blue-100 text-blue-800" },
    { rank: 7, name: "DHCP / ARP 互動運作實戰", rate: "80%", desc: "DHCP Client-Server 四步驟，以及 ARP 廣播請求 (FF-FF-FF-FF-FF-FF) 與單播響應過程", bg: "bg-blue-50/40", border: "border-blue-200/60", text: "text-blue-900", countColor: "bg-blue-100 text-blue-800" },
    { rank: 8, name: "CRC 循環冗餘檢驗碼", rate: "75%", desc: "模二除法二進制 bit-wise XOR 不借位運算，求餘數 R 校驗（真題第 18 題與手算題）", bg: "bg-purple-50/40", border: "border-purple-200/60", text: "text-purple-900", countColor: "bg-purple-100 text-purple-850" },
    { rank: 9, name: "Ethernet / Switch 幀轉發與自學機制", rate: "75%", desc: "跨網段子網轉發時：IP 不變，MAC 逐跳（Hop-by-Hop）解封重封物理位址算路實例", bg: "bg-purple-50/40", border: "border-purple-200/60", text: "text-purple-900", countColor: "bg-purple-100 text-purple-850" },
    { rank: 10, name: "VLAN & Trunk 幹線協定", rate: "70%", desc: "VLAN 隔離優勢，以及跨實體交換器 Trunk 傳輸 802.1Q 插入 12-bit Tag 識別碼", bg: "bg-purple-50/40", border: "border-purple-200/60", text: "text-purple-900", countColor: "bg-purple-100 text-purple-850" },
  ];

  return (
    <div className="space-y-8 font-sans" id="home-dashboard-container">
      {/* Target Slogan & Tagline */}
      <div className="text-center py-7 bg-slate-50 rounded-3xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <BookOpen className="h-40 w-40 text-slate-800" />
        </div>
        <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-750 border border-emerald-200/60 uppercase tracking-widest">
          STUDY PACK FOR FINAL EXAM
        </span>
        <h1 className="text-3xl md:text-4xl font-sans tracking-tight font-extrabold text-slate-900 mt-4 px-4 leading-snug">
          netReview
        </h1>
        <p className="text-slate-500 md:text-base font-normal max-w-2xl mx-auto mt-3 leading-relaxed px-4">
          整合 Chapter 4、5、6 簡報與考古題，聚焦必考觀念、手算流程與錯題複習。
        </p>
      </div>

      {/* Recommended Interactive Golden Sequence Guide Tour */}
      <UserGuide onNavigate={onNavigate} currentTab="home" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Countdown Timer card */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-blue-600 font-mono text-xs tracking-wider uppercase font-bold">
              <Clock className="h-4 w-4" />
              <span>期末考倒數計時</span>
            </div>
            <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100 font-mono font-semibold">
              6月9日 14:10 開考
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3 py-3">
            <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl text-center shadow-xs">
              <span className="block text-3xl md:text-4xl font-mono font-black text-slate-800">{timeLeft.days}</span>
              <span className="text-xxs text-slate-500 font-sans mt-1.5 block font-medium">天 Days</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl text-center shadow-xs">
              <span className="block text-3xl md:text-4xl font-mono font-black text-slate-800">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-xxs text-slate-500 font-sans mt-1.5 block font-medium">時 Hrs</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl text-center shadow-xs">
              <span className="block text-3xl md:text-4xl font-mono font-black text-slate-800">
                {String(timeLeft.mins).padStart(2, "0")}
              </span>
              <span className="text-xxs text-slate-500 font-sans mt-1.5 block font-medium">分 Mins</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl text-center shadow-xs">
              <span className="block text-3xl md:text-4xl font-mono font-black text-blue-600">
                {String(timeLeft.secs).padStart(2, "0")}
              </span>
              <span className="text-xxs text-slate-500 font-sans mt-1.5 block font-medium">秒 Secs</span>
            </div>
          </div>

          <div className="text-xs text-slate-500 border-t border-slate-100 pt-4 mt-2 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-blue-500" />
            <span>系統設定考期基準：2026 年 6 月 9 日（6/9）14:10 PM</span>
          </div>
        </div>

        {/* Progress Tracker Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-emerald-700 font-mono text-xs tracking-wider uppercase font-bold flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-600" />
                <span>複習掌握進度</span>
              </span>
              <span className="text-xs text-slate-500">{completedChapters.length} / 3 章已讀</span>
            </div>

            <div className="space-y-3 my-3">
              <div>
                <div className="flex justify-between text-xs text-slate-705 mb-1">
                  <span className="font-medium">Ch4 Data Plane</span>
                  <span className={completedChapters.includes("Chapter 4") ? "text-emerald-600 font-mono font-semibold" : "text-slate-400"}>
                    {completedChapters.includes("Chapter 4") ? "已完成" : "未讀"}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${completedChapters.includes("Chapter 4") ? "w-full bg-emerald-500" : "w-1/12 bg-slate-200"}`}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-705 mb-1">
                  <span className="font-medium">Ch5 Control Plane (Partial)</span>
                  <span className={completedChapters.includes("Chapter 5") ? "text-emerald-600 font-mono font-semibold" : "text-slate-400"}>
                    {completedChapters.includes("Chapter 5") ? "已完成" : "未讀"}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${completedChapters.includes("Chapter 5") ? "w-full bg-emerald-500" : "w-1/12 bg-slate-200"}`}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-705 mb-1">
                  <span className="font-medium">Ch6 Link Layer and LANs</span>
                  <span className={completedChapters.includes("Chapter 6") ? "text-emerald-600 font-mono font-semibold" : "text-slate-400"}>
                    {completedChapters.includes("Chapter 6") ? "已完成" : "未讀"}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${completedChapters.includes("Chapter 6") ? "w-full bg-emerald-500" : "w-1/12 bg-slate-200"}`}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-xxs text-slate-400 leading-snug">
              *可前往「高頻觀念大課」將對應分頁標記為「已讀」以更新儀表進度
            </p>
          </div>
        </div>
      </div>

      {/* Mistake Telemetry Alert Banner */}
      {mistakeCount > 0 ? (
        <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-100 rounded-2xl text-rose-600 shrink-0">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-slate-900 text-sm sm:text-base">
                ⏱️ 錯題備忘錄分析已就位 ({mistakeCount} 道待突破題目)
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {weakestTopic ? (
                  <span>
                    當前系統分析出你的「最弱考點」為：
                    <strong className="text-rose-700 font-extrabold font-sans bg-rose-100 px-1.5 py-0.5 rounded ml-1 mr-1 shadow-xs border border-rose-200">
                      {weakestTopic.topic}
                    </strong>
                    （累計已遭遇答錯 <strong>{weakestTopic.count}</strong> 次）。建議立即點選以下通道前往特訓攻關！
                  </span>
                ) : (
                  <span>快前去「經典錯題練兵」標籤，練習錯題，掌握薄弱章節！</span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("mistakes")}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-sans text-xs font-bold rounded-xl transition-all shadow-md shrink-0 cursor-pointer w-full sm:w-auto text-center"
          >
            專屬錯題特訓 ➔
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600 shrink-0">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-sans font-bold text-slate-900 text-sm">
              👑 錯題本無塵埃（目前錯題：0 題）
            </h4>
            <p className="text-xs text-slate-550 mt-0.5 leading-relaxed font-sans">
              當前所有遭遇題均已百分百攻克完畢，狀態堪稱完美！繼續保持高頻題庫衝刺。
            </p>
          </div>
        </div>
      )}

      {/* Do Not Overstudy Shield (無效範圍防禦盾) */}
      <div className="bg-amber-50/50 border border-amber-200 p-5 rounded-3xl space-y-3 shadow-xs">
        <div className="flex items-center gap-2.5 text-amber-800">
          <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" />
          <h3 className="font-sans font-bold text-sm sm:text-base leading-none">
            🛡️ 考試縮小範圍防禦盾（無效範疇避雷指南 - 本年不考）
          </h3>
        </div>
        <p className="text-xs text-slate-650 leading-relaxed font-sans">
          嚴格結合<strong>課程大綱與助教公告</strong>，以下考古題或投影片內容<strong>本學期不納入考試評估範圍</strong>，請同學務必繞道，切勿在考前無效刷題、耗費大好青春：
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-1 shadow-xs">
            <span className="text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded text-xxs font-mono uppercase tracking-wider block font-bold w-fit">🚫 Chapter 5 Page 72 之後</span>
            <p className="text-slate-600 text-xxs leading-relaxed font-sans pt-1">
              Chapter 5 第 72 頁（含）之後涉及的所有 SDN 其他細部延伸不考，刷考古題遇到時請直接跳過。
            </p>
          </div>
          <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-1 shadow-xs">
            <span className="text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded text-xxs font-mono uppercase tracking-wider block font-bold w-fit">🚫 SDN Control Plane 相關</span>
            <p className="text-slate-600 text-xxs leading-relaxed font-sans pt-1">
              Homework 3 宣告不考。考古題中只要看見「SDN 控制平面南向協定、控制器對帳」等題目皆標有 <span className="text-amber-600 font-bold font-mono">[Skip]</span>，請自動跳過。
            </p>
          </div>
          <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-1 shadow-xs">
            <span className="text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded text-xxs font-mono uppercase tracking-wider block font-bold w-fit">⚠️ Chapter 4 僅作了解</span>
            <p className="text-slate-600 text-xxs leading-relaxed font-sans pt-1">
              僅需簡單了解 Chapter 4 的 Match-Action 與 OpenFlow 資料平面抽象（流控基本欄位匹配），無需耗費過多精力研究底層報文。
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation bar */}
      <div>
        <h2 className="text-base font-bold text-slate-800 font-sans tracking-tight mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          <span>期末考一鍵速達通道</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            onClick={() => onNavigate("review")}
            className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 hover:border-blue-300 hover:bg-slate-50/50 rounded-2xl text-center group transition-all duration-300 cursor-pointer shadow-xs"
          >
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
              <Play className="h-5 w-5" />
            </div>
            <span className="text-xs text-slate-700 font-semibold mt-3">Start Review</span>
          </button>

          <button
            onClick={() => onNavigate("quiz")}
            className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 hover:border-emerald-300 hover:bg-slate-50/50 rounded-2xl text-center group transition-all duration-300 cursor-pointer shadow-xs"
          >
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
              <Award className="h-5 w-5" />
            </div>
            <span className="text-xs text-slate-700 font-semibold mt-3">Practice MCQ</span>
          </button>

          <button
            onClick={() => onNavigate("quiz")}
            className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 hover:border-sky-300 hover:bg-slate-50/50 rounded-2xl text-center group transition-all duration-300 cursor-pointer shadow-xs"
          >
            <div className="p-3 bg-sky-50 rounded-xl text-sky-600 group-hover:scale-110 group-hover:bg-sky-100 transition-all duration-300">
              <BookIcon className="h-5 w-5" />
            </div>
            <span className="text-xs text-slate-700 font-semibold mt-3">Practice Short</span>
          </button>

          <button
            onClick={() => onNavigate("mistakes")}
            className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 hover:border-rose-300 hover:bg-slate-50/50 rounded-2xl text-center group transition-all duration-300 cursor-pointer shadow-xs"
          >
            <div className="p-3 bg-rose-50 rounded-xl text-rose-650 group-hover:scale-110 group-hover:bg-rose-100 transition-all duration-300">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="text-xs text-slate-700 font-semibold mt-3">Review Mistakes</span>
          </button>

          <button
            onClick={() => onNavigate("formulas")}
            className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 hover:border-amber-300 hover:bg-slate-50/50 col-span-2 sm:col-span-1 rounded-2xl text-center group transition-all duration-300 cursor-pointer shadow-xs"
          >
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600 group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-300">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-xs text-slate-700 font-semibold mt-3">Formula Sheet</span>
          </button>
        </div>
      </div>

      {/* Past Exam Pattern Analysis Section (考古題規律大剖析) */}
      <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xxs px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-200/60 font-mono font-bold uppercase rounded-md">
            PAST PAPER ANALYTICS
          </span>
          <h2 className="text-xl md:text-2xl font-bold font-sans tracking-tight text-slate-900 mt-2 flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-blue-600" />
            <span>網路概論（Computer Networking）考古命題大數據規律剖析</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            基於歷年期末試卷、投影片核心詞頻及今年最新縮考範圍權重，建構出 100% 機率不落空考點定位！
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trend 1 & 2 */}
          <div className="bg-white p-5 border border-slate-200 rounded-2xl space-y-3 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm font-sans flex items-center gap-2 border-b border-slate-100 pb-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>題型趨勢與高頻主題大盤點</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed font-sans list-disc pl-4.5">
              <li>
                <strong className="text-slate-800">選擇題 MCQ 規律：</strong> 極度高頻考察各層協定 Overhead（如 IPv4 標頭 20-60 bytes、IPv6 為固定 40 bytes），以及資料平面（轉發）與控制平面（路由）運作的物理、軟體劃分界限。
              </li>
              <li>
                <strong className="text-slate-800">手算與推導題趨勢：</strong> 必考 Dijkstra 矩陣表與 BGP 轉發表推演（壓軸 20 分），其次為 CRC 二進制模二直式除算，以及 NAT IP-Port 轉換表格生命週期重寫。
              </li>
              <li>
                <strong className="text-slate-800">簡答題關鍵字精準對齊：</strong> DHCP DORA 的四步封包名與欄位目的、ARP 廣播請求 MAC 的特定包格式、Switch 自學邏輯等。
              </li>
            </ul>
          </div>

          {/* Quick Concept Contrast Cheat-sheet */}
          <div className="bg-white p-5 border border-slate-200 rounded-2xl space-y-3 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm font-sans flex items-center gap-2 border-b border-slate-100 pb-2">
              <Clipboard className="h-4 w-4 text-blue-500" />
              <span>五大高頻混淆死穴精準對照</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xxs font-sans text-left border-collapse font-sans">
                <thead>
                  <tr className="border-b border-slate-155 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-2 pb-2">觀念項目</th>
                    <th className="py-2 pb-2">左端 A 項目</th>
                    <th className="py-2 pb-2">右端 B 項目</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="py-2.5 text-slate-800 font-semibold">轉發 vs 路由</td>
                    <td className="py-2.5">Forwarding：本地單埠匹配轉交</td>
                    <td className="py-2.5">Routing：全局端對端選路算路</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-slate-800 font-semibold">OSPF vs BGP</td>
                    <td className="py-2.5">IGP：追求物理最優度 Cost</td>
                    <td className="py-2.5">EGP：商業利益與資費政策選路</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-slate-800 font-semibold">交換器 vs 路由</td>
                    <td className="py-2.5">Switch：L2二層自學，不擋廣播</td>
                    <td className="py-2.5">Router：L3三層隔離，杜絕廣播流</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-slate-800 font-semibold">Trunk vs Access</td>
                    <td className="py-2.5">Trunk：打上 802.1Q 標籤跨機傳輸</td>
                    <td className="py-2.5">Access：解開標籤對接單一終端設備</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-slate-800 font-semibold">CSMA/CD vs CA</td>
                    <td className="py-2.5">CD：有線乙太，邊發邊聽撞車</td>
                    <td className="py-2.5">CA：無線網，主動預備防碰撞</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Predictive Exam Questions (20+ Short Answer predictive formulas & outline clues) */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-800 text-sm font-sans flex items-center gap-2 block border-t border-slate-200 pt-4">
            <BookIcon className="h-4 w-4 text-emerald-600" />
            <span>期末最可能考 20+ 的考前狂背簡答命題點預測卡</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-1 shadow-xs">
              <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-xxs font-mono font-bold border border-blue-100">Ch4 核心</span>
              <p className="text-slate-800 text-xs font-semibold leading-relaxed pt-1">DHCP 分配四步 (DORA)</p>
              <p className="text-slate-500 text-xxs leading-relaxed">
                Discover (0.0.0.0 廣播 255.255.255.255)、Offer、Request、ACK 的流程及埠號 Dst 67, Src 68 必考。
              </p>
            </div>
            <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-1 shadow-xs">
              <span className="px-1.5 py-0.5 bg-teal-50 text-teal-600 rounded text-xxs font-mono font-bold border border-teal-100">Ch5 核心</span>
              <p className="text-slate-800 text-xs font-semibold leading-relaxed pt-1">LS vs DV 收斂比較</p>
              <p className="text-slate-500 text-xxs leading-relaxed">
                LS (Dijkstra) 收斂極快且防偽造度高；DV (Bellman-Ford) 容易進入路由閉環、面臨 Count-to-infinity 二維無窮大死結。
              </p>
            </div>
            <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-1 shadow-xs">
              <span className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-xxs font-mono font-bold border border-purple-100">Ch6 核心</span>
              <p className="text-slate-800 text-xs font-semibold leading-relaxed pt-1">Switch 自學習</p>
              <p className="text-slate-500 text-xxs leading-relaxed">
                交換器接收乙太幀時，登錄 (Src MAC, 入口 Port) 到 MAC Table，若 Dst MAC 未登錄則向全網洪泛。
              </p>
            </div>
            <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-1 shadow-xs">
              <span className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-xxs font-mono font-bold border border-purple-100">Ch6 核心</span>
              <p className="text-slate-800 text-xs font-semibold leading-relaxed pt-1">VLAN 幹線 (Trunk)</p>
              <p className="text-slate-500 text-xxs leading-relaxed">
                兩個交換器對接埠為 Trunk 時，跨機傳輸訊框會被強制插入 802.1Q 標籤（4 bytes，其中 12-bit 為 VLAN ID）。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Must-Know Top 10 Spot list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 font-sans tracking-tight flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            <span>必考核心考點指數 TOP 10 預測大名單</span>
          </h2>
          <span className="text-xs text-slate-505 font-mono">
            基於簡報詞庫與考古出題模型加權
          </span>
        </div>

        <div className="space-y-3">
          {HOT_SPOTS_TOP_10.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white border border-slate-205 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-all duration-300 shadow-xs border-l-4 ${idx < 3 ? "border-l-teal-500" : idx < 7 ? "border-l-blue-500" : "border-l-purple-500"}`}
            >
              <div className="flex gap-4 items-start">
                <div className={`h-8 w-8 rounded-lg ${item.countColor} flex items-center justify-center font-mono text-xs font-bold select-none shrink-0`}>
                  {item.rank}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 font-sans text-sm tracking-wide">
                    {item.name}
                  </h4>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 border-slate-100 pt-2.5 md:pt-0 shrink-0">
                <span className="text-slate-400 font-mono text-xxs tracking-wider uppercase">
                  核心高頻指數
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-extrabold bg-blue-50 border border-blue-100 text-blue-700 shadow-xs font-sans">
                  {item.rate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
