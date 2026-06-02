import React, { useState } from "react";
import { Play, RotateCcw, ChevronRight } from "lucide-react";

export const Simulators: React.FC = () => {
  const [activeSim, setActiveSim] = useState<"crc" | "dijkstra" | "dv">("crc");

  return (
    <div className="space-y-6 font-sans text-slate-900" id="simulators-outer-container">
      {/* Simulation Selector Tab switcher */}
      <div className="flex flex-col sm:flex-row gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSim("crc")}
          className={`px-4 py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeSim === "crc"
              ? "bg-blue-600 text-white shadow-sm border border-blue-500"
              : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-800"
          }`}
        >
          CRC 模二除學算盤
        </button>
        <button
          onClick={() => setActiveSim("dijkstra")}
          className={`px-4 py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeSim === "dijkstra"
              ? "bg-blue-600 text-white shadow-sm border border-blue-500"
              : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-800"
          }`}
        >
          Dijkstra 最短路徑步進器 (Q19)
        </button>
        <button
          onClick={() => setActiveSim("dv")}
          className={`px-4 py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeSim === "dv"
              ? "bg-blue-600 text-white shadow-sm border border-blue-500"
              : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-800"
          }`}
        >
          Distance Vector 接收演練 (Q20)
        </button>
      </div>

      {activeSim === "crc" && <CRCSimulator />}
      {activeSim === "dijkstra" && <DijkstraSimulator />}
      {activeSim === "dv" && <DVSimulator />}
    </div>
  );
};

/* ========================================================================= */
/* 1. CRC Binary Modulo-2 Divider Simulator                                  */
/* ========================================================================= */
const CRCSimulator: React.FC = () => {
  const [data, setData] = useState("11000111010"); // Defaults to MCQ Q18
  const [gen, setGen] = useState("1001");
  const [solvedSteps, setSolvedSteps] = useState<string[]>([]);
  const [finalR, setFinalR] = useState("");
  const [isCalculated, setIsCalculated] = useState(false);

  const handleSolve = () => {
    if (!data || !gen || !/^[01]+$/.test(data) || !/^[01]+$/.test(gen)) {
      alert("請輸入由 0 和 1 組成的二進位字串！");
      return;
    }

    const rLen = gen.length - 1;
    const paddedData = data + "0".repeat(rLen);
    const stepsOutput: string[] = [];

    let current = paddedData.slice(0, gen.length);
    let index = gen.length;

    stepsOutput.push(`初始被除數 (附屬 ${rLen} 個零): ${paddedData}`);
    stepsOutput.push(`準備開始模二除算，除數 (Generator): ${gen}\n`);

    while (index <= paddedData.length) {
      const isDivisible = current[0] === "1";
      const xorValue = isDivisible ? gen : "0".repeat(gen.length);

      stepsOutput.push(`當前除段:  ${current}`);
      stepsOutput.push(`相應 XOR:  ${xorValue}`);
      stepsOutput.push("-".repeat(gen.length + 10));

      // Do bit-wise XOR
      let xorResult = "";
      for (let i = 0; i < gen.length; i++) {
        xorResult += current[i] === xorValue[i] ? "0" : "1";
      }

      // Slice out the first bit (which becomes 0)
      const remainder = xorResult.slice(1);
      stepsOutput.push(`運算餘數:   ${remainder}`);

      if (index < paddedData.length) {
        const nextBit = paddedData[index];
        current = remainder + nextBit;
        stepsOutput.push(`拉下新位:         ↓ ${nextBit}  ==>  新除段: ${current}\n`);
      } else {
        setFinalR(remainder);
        stepsOutput.push(`\n除算結束！最末尾獲得 R 餘數為:  [${remainder}]`);
      }
      index++;
    }

    setSolvedSteps(stepsOutput);
    setIsCalculated(true);
  };

  const handleReset = () => {
    setData("11000111010");
    setGen("1001");
    setSolvedSteps([]);
    setFinalR("");
    setIsCalculated(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs font-sans">
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-wide">
          循環冗餘碼 (CRC) 模二直式除算盤
        </h3>
        <p className="text-slate-500 text-xs leading-relaxed">
          輸入任意 2 進制 Data 與多項式，一鍵解析二進制無進位 XOR 計算。 默認值為考古題第 18 題真題資料！
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-500 text-xs font-sans font-bold uppercase tracking-wider mb-1.5">
            數據載荷 (D) - Data bits
          </label>
          <input
            type="text"
            value={data}
            onChange={(e) => setData(e.target.value.replace(/[^01]/g, ""))}
            className="w-full bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 rounded-xl px-4 py-2.5 text-slate-800 text-sm font-mono outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 text-xs font-sans font-bold uppercase tracking-wider mb-1.5">
            生成多項式 (G) - Generator (除數)
          </label>
          <input
            type="text"
            value={gen}
            onChange={(e) => setGen(e.target.value.replace(/[^01]/g, ""))}
            className="w-full bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 rounded-xl px-4 py-2.5 text-slate-800 text-sm font-mono outline-none"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSolve}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-sans text-xs font-bold leading-none tracking-wide transition-all uppercase flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Play className="h-4 w-4" />
          <span>直式手算演練</span>
        </button>
        <button
          onClick={handleReset}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-sans text-xs font-bold leading-none tracking-wide transition-all uppercase flex items-center gap-2 cursor-pointer border border-slate-205"
        >
          <RotateCcw className="h-4 w-4" />
          <span>重設</span>
        </button>
      </div>

      {isCalculated && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between shadow-xxs">
            <div>
              <span className="text-xxs text-emerald-700 uppercase tracking-widest font-sans font-bold block">
                計算校驗碼結果 (CRC Remainder R)
              </span>
              <p className="text-emerald-900 font-mono font-extrabold text-lg mt-0.5">
                R = {finalR}
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100/50 border border-emerald-250 rounded-md text-emerald-800 font-mono text-xs font-semibold">
              傳送端組碼: {data}
              <span className="text-pink-600 font-black">{finalR}</span>
            </span>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <span className="text-xxs text-slate-550 uppercase tracking-wider font-sans font-bold block mb-3">
              二進制 XOR 直式除算流動分解 (手寫對帳單)
            </span>
            <pre className="font-mono text-xs text-slate-700 overflow-x-auto leading-relaxed scrollbar-thin max-h-96 whitespace-pre">
              {solvedSteps.map((step, idx) => (
                <div key={idx} className={step.includes("R =") ? "text-amber-800 font-bold mt-2" : ""}>
                  {step}
                </div>
              ))}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

/* ========================================================================= */
/* 2. Dijkstra Step-by-Step Scenario Simulator                               */
/* ========================================================================= */
const DijkstraSimulator: React.FC = () => {
  const [step, setStep] = useState(0);

  // Exact steps data mapping MCQ question 19
  const STEPS_DATA = [
    {
      NHash: "{x}",
      nodes: {
        y: { cost: "6", p: "x" },
        z: { cost: "8", p: "x" },
        v: { cost: "5 (min)", p: "x" },
        w: { cost: "6", p: "x" },
        t: { cost: "inf", p: "-" },
        u: { cost: "inf", p: "-" },
      },
      currentMin: "v (選取 5, x 最短加入)",
      desc: "起點 N'={x}。直接探索鄰居結點 y=6, z=8, v=5, w=6。目前全局非確定點中：D(v)=5 為最短，準備下步將其拉入確定集合 N' 中。"
    },
    {
      NHash: "{x, v}",
      nodes: {
        y: { cost: "6 (min)", p: "x" },
        z: { cost: "8", p: "x" },
        v: { cost: "-", p: "-" },
        w: { cost: "6", p: "x" },
        t: { cost: "9", p: "v" },
        u: { cost: "7", p: "v" },
      },
      currentMin: "y (選取 6, x 最短加入)",
      desc: "將 v 拉入 N'。透過 v 進行路徑鬆弛：\n- D(t) = min(inf, D(v)+c_{v,t}) = min(inf, 5+4) = 9 via v。\n- D(u) = min(inf, D(v)+c_{v,u}) = min(inf, 5+2) = 7 via v。\n- 有鄰居 D(y)=6, D(w)=6 相同，挑取 y 加入 N'。"
    },
    {
      NHash: "{x, v, y}",
      nodes: {
        y: { cost: "-", p: "-" },
        z: { cost: "8", p: "x" },
        v: { cost: "-", p: "-" },
        w: { cost: "6 (min)", p: "x" },
        t: { cost: "9", p: "v" },
        u: { cost: "7", p: "v" },
      },
      currentMin: "w (選取 6, x 最短加入)",
      desc: "將 y 拉入 N'。因 y 前往 z 與 t 無更小路，表格基本維持。當前非 N' 集合中 D(w)=6 成為最小值，準備吸納 w。"
    },
    {
      NHash: "{x, v, y, w}",
      nodes: {
        y: { cost: "-", p: "-" },
        z: { cost: "8", p: "x" },
        v: { cost: "-", p: "-" },
        w: { cost: "-", p: "-" },
        t: { cost: "9", p: "v" },
        u: { cost: "7 (min)", p: "v" },
      },
      currentMin: "u (選取 7, v 最短加入)",
      desc: "將 w 拉入 N'。更新鄰居：D(u) = min(7, D(w)+c_{w,u}) = min(7, 6+3) = 7。目前剩餘點中 D(u)=7 最短via v，選作下一個加入點。"
    },
    {
      NHash: "{x, v, y, w, u}",
      nodes: {
        y: { cost: "-", p: "-" },
        z: { cost: "8 (min)", p: "x" },
        v: { cost: "-", p: "-" },
        w: { cost: "-", p: "-" },
        t: { cost: "8 (更新 via u)", p: "u" },
        u: { cost: "-", p: "-" },
      },
      currentMin: "z (選取 8, x 最短加入)",
      desc: "將 u 拉入確定集。透過 u 對 t 進行鬆弛探查：\n- D(t) = min(9, D(u)+c_{u,t}) = min(9, 7+1) = 8！ 成功比原 9 縮小。目前 z 與 t 代價皆為 8，選取 z 確定。"
    },
    {
      NHash: "{x, v, y, w, u, z}",
      nodes: {
        y: { cost: "-", p: "-" },
        z: { cost: "-", p: "-" },
        v: { cost: "-", p: "-" },
        w: { cost: "-", p: "-" },
        t: { cost: "8 (min)", p: "u" },
        u: { cost: "-", p: "-" },
      },
      currentMin: "t (選取 8, u 最短加入)",
      desc: "將 z 拉入確定集。對其餘無影響，最末一個非確定點 t=8（via u）加入 100% 收斂。"
    },
    {
      NHash: "{x, v, y, w, u, z, t} - 全域收斂",
      nodes: {
        y: { cost: "6", p: "x" },
        z: { cost: "8", p: "x" },
        v: { cost: "5", p: "x" },
        w: { cost: "6", p: "x" },
        t: { cost: "8", p: "u" },
        u: { cost: "7", p: "v" },
      },
      currentMin: "ALL CONVERGED",
      desc: "大功告成！全網最短路徑樹完全建立。對照此資料，可直接比對填交考古第 19 題壓軸 15 分手寫大題！"
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-wide">
            Dijkstra 最短路徑步進手算模擬器
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            針對考古題第 19 題，以起點 x 計算最短路徑。 倒數步驟表格，每一步的代置跟前驅關係。
          </p>
        </div>
        <div className="flex bg-slate-50 border border-slate-200 p-1 rounded-xl self-start sm:self-auto shrink-0 select-none items-center">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            className="px-3 py-1.5 hover:bg-slate-150 rounded-lg text-xs font-mono font-bold text-slate-600 cursor-pointer"
          >
            Prev
          </button>
          <span className="px-3 py-1.5 text-xs text-blue-600 font-mono font-extrabold">
            Step {step} / 6
          </span>
          <button
            onClick={() => setStep(Math.min(6, step + 1))}
            className="px-3 py-1.5 hover:bg-slate-150 rounded-lg text-xs font-mono font-bold text-slate-800 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>

      {/* Graph Visual preview info */}
      <div className="bg-slate-550 bg-slate-50 p-4 border border-slate-200 rounded-xl flex gap-3 text-xs justify-between flex-col sm:flex-row shadow-xxs">
        <div className="flex items-center gap-2">
          <span className="p-1 px-2 rounded bg-blue-50 text-blue-700 font-mono font-bold select-none text-xxs border border-blue-100">原圖連線成本</span>
          <span className="text-slate-600 whitespace-pre-wrap font-sans">x-v:5 | x-y:6 | x-w:6 | x-z:8 | v-u:2 | v-w:4 | v-t:4 | w-u:3 | u-t:1</span>
        </div>
        <button
          onClick={() => setStep(0)}
          className="flex items-center gap-1 hover:text-blue-700 text-blue-600 font-sans font-bold cursor-pointer text-xs"
        >
          <RotateCcw className="h-3.5 w-3.5 animate-spin-slow" />
          <span>重設 Reset</span>
        </button>
      </div>

      {/* Active step progress visualizer card */}
      <div className="space-y-4">
        <div className="bg-blue-50/50 border border-blue-200 p-5 rounded-2xl shadow-xxs">
          <div className="flex justify-between items-center pb-3 border-b border-blue-105 border-blue-100/60 mb-3 flex-wrap gap-2">
            <div>
              <span className="text-xxs uppercase font-sans font-bold tracking-widest text-blue-750 text-blue-750 text-blue-800">
                確定集合 N'
              </span>
              <p className="text-sm font-mono font-black text-blue-900 uppercase mt-0.5">
                {STEPS_DATA[step].NHash}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xxs uppercase font-sans font-bold tracking-widest text-blue-750 text-blue-800">
                本輪選中最小點
              </span>
              <p className="text-xs font-sans font-bold text-amber-700 mt-0.5">
                {STEPS_DATA[step].currentMin}
              </p>
            </div>
          </div>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
            {STEPS_DATA[step].desc}
          </p>
        </div>

        {/* Dynamic Dijkstra Table visualization */}
        <div className="border border-slate-200 rounded-2xl overflow-x-auto bg-white shadow-xxs">
          <table className="w-full text-left font-mono text-xs border-collapse min-w-max">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-205 text-slate-500 font-sans font-bold">
                <th className="p-3 pl-4">Step</th>
                <th className="p-3">D(y),p(y)</th>
                <th className="p-3">D(z),p(z)</th>
                <th className="p-3">D(v),p(v)</th>
                <th className="p-3">D(w),p(w)</th>
                <th className="p-3">D(t),p(t)</th>
                <th className="p-3">D(u),p(u)</th>
              </tr>
            </thead>
            <tbody>
              {STEPS_DATA.map((row_data, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-slate-100 last:border-b-0 text-slate-650 transition-colors duration-200 ${
                    idx === step ? "bg-blue-50/70 text-blue-800 font-black" : idx < step ? "opacity-45 text-slate-400 bg-slate-50/20" : ""
                  }`}
                >
                  <td className="p-3 pl-4 font-bold">{idx}</td>
                  <td className="p-3">{row_data.nodes.y.cost},{row_data.nodes.y.p}</td>
                  <td className="p-3">{row_data.nodes.z.cost},{row_data.nodes.z.p}</td>
                  <td className="p-3">{row_data.nodes.v.cost !== "-" ? `${row_data.nodes.v.cost},${row_data.nodes.v.p}` : "-"}</td>
                  <td className="p-3">{row_data.nodes.w.cost},{row_data.nodes.w.p}</td>
                  <td className="p-3">{row_data.nodes.t.cost},{row_data.nodes.t.p}</td>
                  <td className="p-3">{row_data.nodes.u.cost !== "-" ? `${row_data.nodes.u.cost},${row_data.nodes.u.p}` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 3. Distance Vector Scenario Simulator                                     */
/* ========================================================================= */
const DVSimulator: React.FC = () => {
  const [step, setStep] = useState(0);

  // Exact step workflow matching MCQ question 20
  const DV_STEPS = [
    {
      title: "Step 0 - z 初始宣告 (僅知直接連線代價值)",
      vector: { u: "inf", v: "3", y: "inf", x: "6", z: "0" },
      desc: "Z此時只知道自己的物理連線，去 v 為 3，去 x 為 6。其餘點暫設為無窮大。\n向量：D_z(*) = [inf, 3, inf, 6, 0]"
    },
    {
      title: "Step 1 - z 收到鄰居 v 宣告的距離向量，執行 B-F 鬆弛計算",
      vector: { u: "8 (更新)", v: "3", y: "7 (更新)", x: "4 (更新)", z: "0" },
      vInput: { u: "5", v: "0", y: "4", x: "1", z: "3" },
      desc: "Z 收到鄰居 v 傳來的向量：D_v = [5, 0, 4, 1, 3]。\nZ套用 Bellman-Ford 方正式 D_z(目的地) = min(舊 D_z, c_{z,v} + D_v)：\n- D_z(u) = min(inf, 3 + 5) = 8 via v\n- D_z(y) = min(inf, 3 + 4) = 7 via v\n- D_z(x) = min(6, 3 + 1) = 4 via v\n這令 Z 去往各目的地的代價大幅壓縮縮減，下一跳皆由 v 代理！"
    },
    {
      title: "Step 2 - z 接著收到鄰居 x 宣告之向量，評估最優路",
      vector: { u: "8", v: "3", y: "7", x: "4", z: "0" },
      xInput: { u: "inf", v: "1", y: "2", x: "0", z: "6" },
      desc: "Z 接著收到鄰居 x 的向量報表：D_x = [inf, 1, 2, 0, 6]。\n- D_z(u) = min(8, c_{z,x} + D_x(u)) = min(8, 6 + inf) = 8 (不變)\n- D_z(y) = min(7, c_{z,x} + D_x(y)) = min(7, 6 + 2) = 7 (不變)\n- D_z(x) = min(4, c_{z,x} + D_x(x)) = min(4, 6 + 0) = 4 (不變)\n經由 x 所有通路代價皆此時比原本 via v 還要高。Z 之最終路由完全不做更動，向量收斂。"
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-wide">
            Distance Vector 向量表格逐步變更演練 (Q20)
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            模擬考古題第 20 題，Z 節點先收到 V 傳來向量、再收到 X 傳來向量時之動態 Bellman-Ford 更新程序。
          </p>
        </div>
        <div className="flex bg-slate-50 border border-slate-200 p-1 rounded-xl self-start sm:self-auto shrink-0 select-none items-center">
          <button
            onClick={() => setStep(0)}
            className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 font-sans text-xs font-bold cursor-pointer"
          >
            Reset
          </button>
          <span className="px-3 py-1.5 text-xs text-blue-600 font-mono font-extrabold border-l border-slate-200">
            Step {step}
          </span>
          <button
            onClick={() => setStep(Math.min(2, step + 1))}
            className="px-3 py-1.5 bg-blue-550 bg-blue-600 hover:bg-blue-550 text-white rounded-lg text-xs font-sans font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="bg-slate-50 p-4 border border-slate-200 text-xs rounded-xl text-slate-550 flex flex-col sm:flex-row gap-4 justify-between font-sans shadow-xxs">
        <span>{"Z 緊鄰之物理成本：c_{z,v} = 3 | c_{z,x} = 6"}</span>
        <span className="text-blue-600 font-mono font-semibold">{"B-F 式: D_z(y) = min_w (c_{z,w} + D_w(y))"}</span>
      </div>

      {/* Presentation Cards */}
      <div className="space-y-4">
        <div className="bg-blue-50/50 border border-blue-200 p-5 rounded-2xl space-y-3 shadow-xxs">
          <h4 className="font-bold text-blue-800 block border-b border-blue-100 pb-2 text-sm">
            {DV_STEPS[step].title}
          </h4>
          <p className="text-slate-700 text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-line">
            {DV_STEPS[step].desc}
          </p>
        </div>

        {/* Layout details of nodes variables */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
          {(["u", "v", "y", "x", "z"] as const).map((dest) => (
            <div key={dest} className="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-xxs">
              <span className="text-xxs text-slate-505 text-slate-500 uppercase tracking-wider font-sans font-bold">前往目的 {dest}</span>
              <p className="text-lg font-mono font-extrabold text-slate-800 mt-1">
                {DV_STEPS[step].vector[dest]}
              </p>
            </div>
          ))}
        </div>

        {/* Inputs details */}
        {step === 1 && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-xxs">
            <span className="text-xxs text-blue-600 font-sans font-bold uppercase tracking-wider block mb-2">
              接收到 V 傳來的距離向量 D_v 內容：
            </span>
            <div className="flex gap-4 font-mono text-xs text-slate-600 flex-wrap">
              <span>D(u)=5</span>
              <span>D(v)=0</span>
              <span>D(y)=4</span>
              <span>D(x)=1</span>
              <span>D(z)=3</span>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-xxs">
            <span className="text-xxs text-blue-600 font-sans font-bold uppercase tracking-wider block mb-2">
              接收到 X 傳來的距離向量 D_x 內容：
            </span>
            <div className="flex gap-4 font-mono text-xs text-slate-600 flex-wrap">
              <span>D(u)=inf</span>
              <span>D(v)=1</span>
              <span>D(y)=2</span>
              <span>D(x)=0</span>
              <span>D(z)=6</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
