import React, { useState } from "react";
import { 
  ArrowRight,
  CheckCircle, 
  Layers, 
  MapPin, 
  Network, 
  Globe, 
  ShieldAlert, 
  HelpCircle, 
  Zap, 
  Activity, 
  Cpu, 
  Radio
} from "lucide-react";

interface JourneyStep {
  id: number;
  stageName: string;
  shortDesc: string;
  icon: React.ComponentType<any>;
  details: string[];
  scope: "L2" | "L3" | "L4" | "L7" | "Cross";
  techs: string[];
}

const PASSPORT_STEPS: JourneyStep[] = [
  {
    id: 1,
    stageName: "1. 註冊聯網：DHCP 動態分配 IP",
    shortDesc: "Host A 開機進入網路，使用 UDP 廣播，向網路宣告索取身分證（IP）。",
    icon: Cpu,
    scope: "Cross",
    techs: ["DHCP", "UDP", "Broadcast"],
    details: [
      "**四步驟廣播通訊**：Discover (發現) -> Offer (提供) -> Request (請求) -> ACK (確認)。全部在 UDP 上運行 (Port 67/68)，源 IP 為 `0.0.0.0`，公有目的廣播 IP `255.255.255.255`。",
      "**取得四大金剛資訊**：Host A 不僅獲配了自己的 **32-bit IP 地址**，同時還一次性打包獲得了：**子網遮罩 (Subnet Mask)**、**預設閘道器 (Default Gateway) 的 IP** 以及 **DNS 伺服器的 IP**。"
    ]
  },
  {
    id: 2,
    stageName: "2. 姓名解析：DNS 查詢目的 IP",
    shortDesc: "Host A 只知道目標的主機網域名稱 (如 ntu.edu.tw)，藉由 DNS 解析出 32-bit 目的 IP。",
    icon: Globe,
    scope: "L7",
    techs: ["DNS", "UDP Port 53", "Application Layer"],
    details: [
      "**應用層請求**：Host A 建構一個 DNS 查詢訊框，透過傳送層 **UDP port 53** 動態探訊目的伺服器。",
      "因為目標 DNS 伺服器通常位在別的 Subnet，此時需要查詢本網段的 ARP 快取，封包隨之準備扔給閘道器（Gateway）。"
    ]
  },
  {
    id: 3,
    stageName: "3. 身分探路：ARP 直尋預設閘道器 MAC",
    shortDesc: "Host A 發現目的 IP 在不同子網，必須經由 default gateway 轉發。此時需發出 ARP 尋找閘道器 MAC 物理位址。",
    icon: MapPin,
    scope: "L2",
    techs: ["ARP", "FF-FF-FF-FF-FF-FF", "IP-to-MAC"],
    details: [
      "**子網判定**：Host A 用自家 IP 及目的 IP 與 Subnet Mask 進行 AND 運算，斷定目標在「外網」，故下一跳（Next-hop）為 Default Gateway（R1）。",
      "**ARP 廣播召集**：若無快取，則在實體鏈路層洪泛廣播 `FF-FF-FF-FF-FF-FF` 訊框，吼出：『誰是 Gateway？請把物理 MAC 地址回覆我！』",
      "**單播響應與紀錄**：R1 收悉並發回單播 ARP Reply 透露 MAC 物理地址。Host A 同步寫入 ARP Table 續用。"
    ]
  },
  {
    id: 4,
    stageName: "4. 首發起跑：Ethernet 封裝與第一跳(第一網段)",
    shortDesc: "封包完全就緒，包上 Layer 2 Ethernet 首部，源 MAC 為 Host A，目的 MAC 為閘道器 R1。",
    icon: Radio,
    scope: "L2",
    techs: ["Ethernet Frame", "802.3", "NIC"],
    details: [
      "**封裝程序**：封裝 Layer 3 IP Datagram 至 Layer 2 訊框（Frame），尾隨 CRC 校驗字節組。",
      "**實體遞送**：網卡 (NIC) 以半雙工或全雙工方式調變射頻或電壓發送，第一跳直接被閘道器 R1 的實體埠口捕獲。"
    ]
  },
  {
    id: 5,
    stageName: "5. 路由器轉發：最長前綴匹配 (LPM) 決策",
    shortDesc: "R1 剝離 Ethernet 幀，解析 IP Datagram 目的位址，在轉發表中查詢下一出口埠。",
    icon: Activity,
    scope: "L3",
    techs: ["Switching Fabric", "LPM", "Forwarding Table"],
    details: [
      "**硬體處理**：R1 輸入埠硬體快速分析 IP 標頭，對 TTL 欄位遞減 1（若為 0 則發 ICMP 棄置報錯）。",
      "**最長前綴匹配 (LPM)**：在 Forwarding Table 中，若有多條路由前綴符合目的 IP，**嚴格挑選「符合子網長度最長、最精準」的那一項出口**作為轉發依歸。封包穿過「Switching fabric」由指定輸出埠甩出。"
    ]
  },
  {
    id: 6,
    stageName: "6. 改名換面：NAT 映射與埠號翻轉 (選配)",
    shortDesc: "若 Host A 身在私有內網，此時通過 R1 的 NAT 界面，將被強行洗牌重改 Source IP 及 Port。",
    icon: ShieldAlert,
    scope: "Cross",
    techs: ["NAT Table", "Private IP", "Port Translation"],
    details: [
      "**重寫 IP 與 Port**：R1 將 Incoming 私網資料轉換。例如原 `10.0.0.1:1234` 換為公有 IP `120.11.22.33:5566`。目的 IP 雷打不動。",
      "**表項快取與安全**：在 NAT Table 記下一筆雙向存根。因外部網主動連入時若無配對表項會被直接丟棄，故 NAT 同時具有天然的防護盾牌優勢。"
    ]
  },
  {
    id: 7,
    stageName: "7. 跨域征戰：BGP 全球路由與 AS 內 OSPF 算路",
    shortDesc: "封包需要穿梭在多個 Autonomous Systems (自治系統) 間。BGP 與 OSPF 在背後支配這條宏觀天塹。",
    icon: Network,
    scope: "L3",
    techs: ["BGP TCP 179", "OSPF Area 0", "Dijkstra"],
    details: [
      "**跨 AS 宣告 (eBGP/iBGP)**：BGP Session 運行在 TCP Port 179 上。eBGP 宣告外部 AS-PATH 可達性，iBGP 則在系統內傳播。利用「Hot Potato Routing」路由政策：一旦得知多個跨區出口，OSPF 計算出內部哪條代價低，立刻丟該出口！",
      "**區域內算路 (OSPF)**：骨幹區 Area 0 與局部區，每台路由器跑 Dijkstra 計算 SPF 樹，將路由結果寫入 L3 轉發表。"
    ]
  },
  {
    id: 8,
    stageName: "8. 移魂大法：每一躍 MAC 地址的瘋狂更換",
    shortDesc: "旅途中最關鍵的真理：IP End-to-End 全程不變；MAC Hop-by-Hop 每跳必換！",
    icon: Layers,
    scope: "L2",
    techs: ["MAC Rewrite", "Layer 2 Demux", "Hop-by-Hop"],
    details: [
      "**IP 端到端不變**：從頭到尾目的 IP 始終指向 Host B，源 IP 指向 Host A（非 NAT 情境下）。",
      "**MAC 逐跳被扒皮更換**：每一台三層路由器，在轉發時都必須：**剝除舊的 Layer 2 訊框首部 -> 分析 L3 IP -> 按照 LPM 挑出下出口 -> 調用下一跳 ARP -> 重新包上「全新目的地與源 MAC」 的 Ethernet Header**！每一躍，MAC 地址都會完全重組代換！"
    ]
  },
  {
    id: 9,
    stageName: "9. 凱旋而歸：落子目的子網與 Host B 捕獲",
    shortDesc: "封包終於到達 Host B 所在的最後子網。末代交換機通過 MAC 自學表單播送達。",
    icon: CheckCircle,
    scope: "L2",
    techs: ["Switch Table", "Self-Learning", "Host Delivery"],
    details: [
      "**交換器自學自轉**：最後子網交換器只看 MAC。透過 `MAC - Port - Timestamp` 的**自學機制 (Self-Learning)**，若命中則單播指向 Host B；若查無則在本 Subnet 進行氾洪廣播 (Flooding)。",
      "**Host B 解封**：Host B 網卡收到訊框，比對其 Dst MAC 吻合，執行 L2 CRC 奇偶校驗無誤，遂開箱扒去 L2，將 IP Datagram 送上 L3；L3 驗對無誤送交 L4 TCP/UDP 組裝、送往套接字 (Socket) 收尾！冒險圓滿完成！"
    ]
  }
];

export const ConceptMap: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"journey" | "contrast">("journey");

  return (
    <div className="space-y-6 font-sans text-slate-900 animate-fade-in" id="concept-map-container">
      {/* Tab Switcher */}
      <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-slate-205 border-slate-200 pb-3 gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 font-sans tracking-tight">
            NTU 網路課最強：三章核心跨界大統整概念圖
          </h2>
          <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
            打破 Chapter 4、5、6 的高牆，用包容全局的「封包旅程」和「對比金鑰」融會貫通
          </p>
        </div>
        
        <div className="flex bg-slate-50 border border-slate-200 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab("journey")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "journey"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-850"
            }`}
          >
            封包端到端流動冒險
          </button>
          <button
            onClick={() => setActiveTab("contrast")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "contrast"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-850"
            }`}
          >
            核心對比金鑰
          </button>
        </div>
      </div>

      {activeTab === "journey" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Stepper Left Menu List */}
          <div className="lg:col-span-5 space-y-2">
            <span className="text-xxs font-sans font-bold text-blue-605 text-blue-600 tracking-widest uppercase block mb-3">
              封包歷險流程分解驛站 (SELECT STEPS)
            </span>
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
              {PASSPORT_STEPS.map((step) => {
                const IconComp = step.icon;
                const isSelected = activeStep === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 text-blue-800 border-2 border-blue-400 font-extrabold shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-850"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`p-1.5 rounded-lg shrink-0 ${
                        isSelected ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-505 text-slate-500"
                      }`}>
                        <IconComp className="h-4 w-4" />
                      </span>
                      <span className="text-xs font-sans line-clamp-1">{step.stageName}</span>
                    </div>
                    <ChevronRightIcon isSelected={isSelected} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stepper Right Display Card Panel */}
          <div className="lg:col-span-7">
            {(() => {
              const currentData = PASSPORT_STEPS.find((s) => s.id === activeStep)!;
              const IconComp = currentData.icon;
              return (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 h-full flex flex-col justify-between shadow-xs space-y-6">
                  <div className="space-y-4">
                    {/* Badge line */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-blue-50 border border-blue-105 border-blue-100 text-blue-700 rounded font-mono text-xxs font-bold">
                          {currentData.scope} 範疇
                        </span>
                        {currentData.techs.map((t) => (
                          <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-150 rounded font-mono text-xxs font-semibold">
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="text-xxs text-slate-400 font-mono font-bold">
                        Stage {currentData.id} of 9
                      </span>
                    </div>

                    {/* Title */}
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                      <span className="p-2.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl">
                        <IconComp className="h-6 w-6" />
                      </span>
                      <h3 className="text-base sm:text-lg font-sans font-extrabold tracking-tight text-slate-900">
                        {currentData.stageName}
                      </h3>
                    </div>

                    {/* Short Intro */}
                    <p className="text-slate-805 text-slate-800 font-sans font-semibold text-xs sm:text-sm bg-blue-50/50 border border-blue-200 p-3.5 rounded-xl leading-relaxed">
                      {currentData.shortDesc}
                    </p>

                    {/* Thorough bullets */}
                    <div className="space-y-4 pt-2">
                      <span className="text-xxs font-sans font-bold text-slate-500 tracking-widest uppercase block mb-1">
                        關卡技術深度解碼 (TA EXPLANATION)
                      </span>
                      <ul className="space-y-3">
                        {currentData.details.map((detail, dIdx) => (
                          <li
                            key={dIdx}
                            className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs sm:text-sm text-slate-705 text-slate-700 leading-relaxed font-sans shadow-xxs"
                            dangerouslySetInnerHTML={{
                              __html: detail
                                .replace(/\*\*(.*?)\*\*/g, "<strong class='text-blue-900 font-bold'>$1</strong>")
                                .replace(/`(.*?)`/g, "<code class='font-mono text-xxs bg-slate-100 px-1 py-0.5 rounded border border-slate-200 text-amber-800 font-bold'>$1</code>")
                            }}
                          />
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Flow control footer */}
                  <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-6">
                    <button
                      disabled={activeStep === 1}
                      onClick={() => setActiveStep(activeStep - 1)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xxs font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 font-mono uppercase shadow-xxs"
                    >
                      ← Back
                    </button>
                    
                    <div className="flex gap-1 font-mono text-xxs text-slate-350 text-center select-none">
                      {PASSPORT_STEPS.map((s) => (
                        <div
                          key={s.id}
                          className={`h-1.5 w-1.5 rounded-full ${s.id === activeStep ? "bg-blue-550 bg-blue-600" : "bg-slate-200"}`}
                        />
                      ))}
                    </div>

                    <button
                      disabled={activeStep === 9}
                      onClick={() => setActiveStep(activeStep + 1)}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xxs font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-500 font-mono uppercase flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Continue</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {/* Compare Card 1: IP vs MAC */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-blue-755 text-blue-700 font-sans tracking-wide border-b border-blue-50 border-slate-100 pb-2.5 flex items-center gap-2">
              <span className="p-1 bg-blue-50 text-blue-605 border border-blue-105 rounded-lg"><Layers className="h-4 w-4 text-blue-600" /></span>
              <span>IP Address (L3) vs MAC Address (L2)</span>
            </h3>
            
            <div className="space-y-3.5">
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 shadow-xxs">
                <span className="text-xxs font-sans font-bold text-slate-500 uppercase tracking-wider block">IP 位址（32位元 / 128位元）</span>
                <p className="text-xs text-slate-700 font-sans mt-1.5 leading-relaxed">
                  **階層式結構**（如同郵遞區號），不具備可攜性。身為邏輯定址，標誌封包的**端到端（End-to-End）**原點與終點，漫長通訊旅程中**雷打不動、始終如一**（NAT 映射為唯一例外）。
                </p>
              </div>
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 shadow-xxs">
                <span className="text-xxs font-sans font-bold text-slate-500 uppercase tracking-wider block">MAC 位址（48位元）</span>
                <p className="text-xs text-slate-700 font-sans mt-1.5 leading-relaxed">
                  **平面型結構**（如同你的身分證號），具有永久可攜性。出廠時固化在硬體 NIC ROM 中，標誌**單一局域子網物理段（Hop-by-Hop）**的近鄰轉移。透過 L3 路由器時，外包裝 MAC 訊框會**遭扒除並重新封寫為下一站的 MAC**。
                </p>
              </div>
            </div>
          </div>

          {/* Compare Card 2: Router vs Switch */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-blue-700 font-sans tracking-wide border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <span className="p-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg"><Cpu className="h-4 w-4 text-blue-600" /></span>
              <span>路由器 Router (L3) vs 交換器 Switch (L2)</span>
            </h3>
            
            <div className="space-y-3.5">
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 shadow-xxs">
                <span className="text-xxs font-sans font-bold text-slate-500 uppercase tracking-wider block">路由器 Router（運作於 Layer 3）</span>
                <p className="text-xs text-slate-700 font-sans mt-1.5 leading-relaxed">
                  完全根據 **IP 首部** 來做決定。擁有 Forwarding Table，負責**隔離廣播網域**、跨子網算路、並以硬體規格做最長前綴匹配（LPM）。
                </p>
              </div>
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 shadow-xxs">
                <span className="text-xxs font-sans font-bold text-slate-500 uppercase tracking-wider block">交換器 Switch（運作於 Layer 2）</span>
                <p className="text-xs text-slate-700 font-sans mt-1.5 leading-relaxed">
                  完全根據 **MAC 幀首部** 來做決定。依靠 Switch Table 快取。具備**自學機制 (Self-Learning)**。通常不隔離廣播網域（除非額外配置 Port-based VLAN 進行 traffic isolation），只負責同子網內的過濾、轉發或氾洪（Flooding）。
                </p>
              </div>
            </div>
          </div>

          {/* Compare Card 3: ARP Mapping */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-blue-700 font-sans tracking-wide border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <span className="p-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg"><HelpCircle className="h-4 w-4" /></span>
              <span>ARP (Layer 2.5) 的黏合橋樑定位</span>
            </h3>
            
            <div className="space-y-3.5">
              <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed font-semibold">
                ARP 協定扮演了 L3 邏輯層往 L2 物理層著陸轉換的最底層樞紐。它擁有在本地子網內，**將 (IP 地址) 動態轉譯快取為 (MAC 地址)** 的重大職責：
              </p>
              <ul className="space-y-2 font-sans text-xs text-slate-600 list-disc list-inside">
                <li><strong className="text-blue-800">ARP Request (廣播)</strong>：在暗處吹口哨。填寫 `FF-FF-FF-FF-FF-FF` 物理廣播位，全子網網卡都將強制收悉解析。</li>
                <li><strong className="text-blue-800">ARP Reply (單播)</strong>：由特定目的主機向發起方答覆，更新本機 ARP Table 存存根（TTL 約 10~20 分鐘過期淘汰）。</li>
                <li><strong className="text-amber-800 font-bold">跨網必備定律</strong>：若目的 IP 判定為外網，ARP 絕對不查最終主機的 MAC，而是**老老實實查預設閘道 (Default Gateway) 的 MAC 地址**！</li>
              </ul>
            </div>
          </div>

          {/* Compare Card 4: OSPF vs BGP */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-blue-700 font-sans tracking-wide border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <span className="p-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg"><Globe className="h-4 w-4" /></span>
              <span>OSPF (Intra-AS) vs BGP (Inter-AS)</span>
            </h3>
            
            <div className="space-y-3.5">
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 shadow-xxs">
                <span className="text-xxs font-sans font-bold text-slate-500 uppercase tracking-wider block">OSPF (域內最短優先：Intra-AS)</span>
                <p className="text-xs text-slate-700 font-sans mt-1.5 leading-relaxed">
                  **專注效能與代價**：在同一自治系統內部運作。主要追求：least cost、fastest 路徑。全網所有路由器維護相同拓撲，跑 Dijkstra SPF。
                </p>
              </div>
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 shadow-xxs">
                <span className="text-xxs font-sans font-bold text-slate-500 uppercase tracking-wider block">BGP (自治域邊界：Inter-AS)</span>
                <p className="text-xs text-slate-700 font-sans mt-1.5 leading-relaxed">
                  **專注路由決策與商業政策**：跨 AS 的外交協定（BGP session directly over TCP 179）。首要驅動力不是「哪條路徑物理代價小」，而是「**這條通道是否違反我國的商業、安全排他政策 (Policy-based)**」。因此 Local Preference 本地優先級大於一切。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ChevronProps {
  isSelected: boolean;
}

const ChevronRightIcon: React.FC<ChevronProps> = ({ isSelected }) => {
  return (
    <ArrowRight
      className={`h-4 w-4 transition-all duration-200 shrink-0 ml-1.5 ${
        isSelected ? "text-blue-600 translate-x-0.5" : "text-slate-400"
      }`}
    />
  );
};
