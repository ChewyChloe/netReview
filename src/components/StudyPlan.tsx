import React, { useState } from "react";
import { Circle, Clock, CheckCircle } from "lucide-react";

interface PlanItem {
  timeframe: string;
  focus: string;
  tasks: string[];
}

const SPRINTS: PlanItem[] = [
  {
    timeframe: "48H - 36H 前：攻克 Chapter 4 資料平面核心",
    focus: "分分必爭的 IP 分片、NAT 映射表與 DHCP 四步驟報文！",
    tasks: [
      "理解 Data Plane 與 Control Plane 核心機能區別（轉發與路由本質）。",
      "精熟投影片 4000 隨位元組 IP 分片與重組公式手算。保證會算 Offset （模8除） 與 MF 旗標。",
      "理清內網私有 IP、NAT Table 轉換（外網 Port 新對應分配）原理，以及 NAT Traversal 政策。",
      "記熟 DHCP 四步驟英文名字：Discover -> Offer -> Request -> ACK，能手寫其廣播 IP 源與目的限制。"
    ]
  },
  {
    timeframe: "36H - 24H 前：橫掃 Chapter 5 路由與 BGP 控制策略",
    focus: "Dijkstra 必定出手大題與 BGP 熱馬鈴薯演算法！",
    tasks: [
      "熟練 Dijkstra 算法的最短路徑表格更新。 熟記 D(v) 與前驅 p(v) 改換算。 避過路徑震盪現象。",
      "掌握 Bellman-Ford 距離向量更新。 讀懂真題 20 題，Z節點先收 V 向量，再收 X 向量的遞迴過程。",
      "理清 OSPF 骨幹區域（Area 0）和分區優點：大幅度縮減 LSA 洪泛擴展。",
      "徹底區分 eBGP（跨AS宣告）跟 iBGP（AS內傳播）的宣告路徑規條。",
      "背熟 BGP 熱馬鈴薯路由政策：出口 OSPF 內部成本最低即立刻丟出 AS，不在乎 AS 外部長代價！"
    ]
  },
  {
    timeframe: "24H - 12H 前：突貫 Chapter 6 鏈路層與二維奇偶 & CRC 實戰",
    focus: "CRC 直式 XOR 運算，跨子網 MAC 物理位址逐跳代換！",
    tasks: [
      "精熟二維奇偶校驗碼（2D Parity）定位與直接自我糾錯（0-1反轉）的原理。",
      "動手算 2 ~ 3 題 CRC 直式模二除法二進制 bit-wise XOR 不借位運算，求 R 餘數。",
      "熟記：跨網段轉發封包時，源與目的 IP 全程雷打不動！但源與目的 MAC 地址是逐跳（Hop-by-Hop）解開重封、隨時更動的！",
      "讀熟 VLAN 連接埠劃分與 Trunk Port 利用 802.1Q（附加實體 12-bit Tag header）的原理。",
      "掌握 CSMA/CD 指數退避演算法。 能按公式寫出第 m 次碰撞後隨機 K 集合範圍，以及其等待位元時間。"
    ]
  },
  {
    timeframe: "12H - 開考前：衝刺全真錯題簿與精緻公式鑰匙",
    focus: "查漏補缺、調整心態，直下 A+ 大捷！",
    tasks: [
      "開啟本站「錯題複習」分頁，將先前漏答、答錯的 MCQ 與手寫題反覆進行限時重練。",
      "精讀「精緻公式卡」，速記 Dijkstra 方程、Bellman-Ford 公式、WFQ 保證配額以及退避 K 列項。",
      "充足睡眠，帶齊文具，攜帶草稿紙，信心滿滿進考場！"
    ]
  }
];

export const StudyPlan: React.FC = () => {
  const [doneTasks, setDoneTasks] = useState<string[]>([]);

  const handleToggleTask = (task: string) => {
    if (doneTasks.includes(task)) {
      setDoneTasks(doneTasks.filter((t) => t !== task));
    } else {
      setDoneTasks([...doneTasks, task]);
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-900" id="study-plan-container">
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-4 shadow-xs">
        <span className="p-3 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl">
          <Clock className="h-6 w-6" />
        </span>
        <div>
          <h3 className="text-slate-900 font-extrabold text-base tracking-wide font-sans mb-1">
            學霸專屬：期末 48 小時極限黃金複習時程表
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed font-sans">
            依據教學設計師特製，將 3 大章、公式、手寫算路與錯題，提煉成 4 個大考前衝刺階段。 點擊完成勾選記錄！
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {SPRINTS.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
              <span className="text-xs sm:text-sm font-extrabold text-blue-700 font-sans">
                {item.timeframe}
              </span>
              <span className="text-xxs text-amber-800 bg-amber-50 border border-amber-100 rounded px-2 py-0.5 font-sans font-bold uppercase tracking-wide self-start sm:self-auto">
                衝刺焦點：{item.focus}
              </span>
            </div>

            <ul className="space-y-3">
              {item.tasks.map((task) => {
                const isFinished = doneTasks.includes(task);
                return (
                  <li
                    key={task}
                    onClick={() => handleToggleTask(task)}
                    className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer select-none transition-all duration-150 shadow-xxs"
                  >
                    <span className="shrink-0 mt-0.5">
                      {isFinished ? (
                        <CheckCircle className="h-4.5 w-4.5 text-emerald-600" />
                      ) : (
                        <Circle className="h-4.5 w-4.5 text-slate-400 hover:text-slate-600" />
                      )}
                    </span>
                    <span className={`text-xs sm:text-sm leading-relaxed ${isFinished ? "text-slate-400 line-through" : "text-slate-700 font-medium"}`}>
                      {task}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
