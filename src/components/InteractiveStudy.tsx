import React, { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, Info } from "lucide-react";

export const InteractiveStudy: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"walkthrough" | "compare">("walkthrough");

  return (
    <div className="space-y-6 font-sans text-slate-900" id="interactive-study-hub">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 pb-3 gap-2">
        <button
          onClick={() => setActiveSubTab("walkthrough")}
          className={`px-4 py-2.5 rounded-xl font-sans text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
            activeSubTab === "walkthrough"
              ? "bg-blue-600 text-white shadow-sm border border-blue-500"
              : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-850"
          }`}
        >
          🌐 封包歷險記 Scenario Walkthrough
        </button>
        <button
          onClick={() => setActiveSubTab("compare")}
          className={`px-4 py-2.5 rounded-xl font-sans text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
            activeSubTab === "compare"
              ? "bg-blue-600 text-white shadow-sm border border-blue-500"
              : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-850"
          }`}
        >
          ⚖️ 觀念對照鏡 Compare Mode
        </button>
      </div>

      {activeSubTab === "walkthrough" ? <ScenarioWalkthrough /> : <CompareMode />}
    </div>
  );
};

/* ========================================================================= */
/* 1. SCENARIO WALKTHROUGH COMPONENT                                         */
/* ========================================================================= */
const ScenarioWalkthrough: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);

  const STEPS = [
    {
      title: "第一步：Host 主機 DORA 租借 IP（DHCP 廣播）",
      node: "Client Host (尚未有IP)",
      layer: "應用層 ➔ 傳輸層 ➔ 網路層 ➔ 鏈路層 ➔ 實體層",
      detailsHtml: (
        <div className="space-y-3">
          <p className="text-slate-700 text-sm leading-relaxed">
            新開機的主機毫無 IP。為了上網，它在本地 LAN 內廣播發出 <strong>DHCP DISCOVER</strong> 封包尋求租位。
          </p>
          <div className="bg-slate-50 p-4 border border-slate-150 rounded-xl space-y-1.5 font-sans shadow-xxs">
            <span className="text-blue-600 font-sans font-bold text-xs block">封包欄位重寫解析 (Packet Inspector)：</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-700">
              <div><strong className="text-slate-500">Source IP:</strong> <span className="font-mono text-rose-600 font-bold">0.0.0.0</span> (無IP)</div>
              <div><strong className="text-slate-500">Dest IP:</strong> <span className="font-mono text-rose-600 font-bold">255.255.255.255</span> (L3 廣播)</div>
              <div><strong className="text-slate-500">Source MAC:</strong> <span className="font-mono text-slate-700 font-semibold">00:1A:2B:3C:4D:5E</span></div>
              <div><strong className="text-slate-500">Dest MAC:</strong> <span className="font-mono text-slate-700 font-bold">FF:FF:FF:FF:FF:FF</span> (L2 廣播)</div>
              <div><strong className="text-slate-500">Src Port (UDP):</strong> <span className="font-mono">68</span></div>
              <div><strong className="text-slate-500">Dst Port (UDP):</strong> <span className="font-mono">67</span></div>
            </div>
          </div>
          <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-200">
            💡 <strong>考試高頻常考：</strong> 為什麼 Source IP 是 0.0.0.0、Dest IP 是 255.255.255.255？因為此時主機尚未被分派 IP，只能發放全局廣播向 DHCP 協調取位。
          </p>
        </div>
      )
    },
    {
      title: "第二步：ARP 查詢網關閘口 MAC 位址",
      node: "Client Host ➔ Local Switch ➔ Gate Router",
      layer: "網路層 ➔ 鏈路層 (ARP Address Resolution)",
      detailsHtml: (
        <div className="space-y-3">
          <p className="text-slate-700 text-sm leading-relaxed font-sans">
            主機獲得 IP（租用為 192.168.1.10）及預設閘道（Default Gateway 192.168.1.1）。準備發送 DNS 請求。但主機只知道閘道的 IP，不知其 MAC！
            於是，它在 LAN 廣播發放 <strong>ARP Request</strong> 詢問：「誰持有 192.168.1.1？快把 MAC 報上來！」
          </p>
          <div className="bg-slate-50 p-4 border border-slate-150 rounded-xl space-y-1.5 font-sans shadow-xxs">
            <span className="text-blue-600 font-sans font-bold text-xs block">ARP 廣播詢問：</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-700">
              <div><strong className="text-slate-500">ARP 目的 IP:</strong> <span className="font-mono text-slate-800">192.168.1.1</span></div>
              <div><strong className="text-slate-500">訊框目的 MAC:</strong> <span className="font-mono text-amber-700 font-bold">FF:FF:FF:FF:FF:FF</span> (廣播)</div>
            </div>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed">
            閘道路由器收到後，以 <strong>ARP Reply 單播（Unicast）</strong> 回送自己的 MAC 地址（00:11:22:33:44:55），主機將之存入 ARP 快取表中。
          </p>
        </div>
      )
    },
    {
      title: "第三步：DNS 請求解析 Web Server 的 IP 地址",
      node: "Client Host ➔ Local Gateway Router ➔ DNS Server",
      layer: "應用層 (DNS) ➔ UDP ➔ IP ➔ 乙太網 Frame",
      detailsHtml: (
        <div className="space-y-3">
          <p className="text-slate-700 text-sm leading-relaxed">
            主機組裝 <strong>DNS Query</strong> 包，請求解析域名 <code>www.google.com</code>。利用前步學得的網關 MAC，將封包發送出網關路由。
          </p>
          <div className="bg-slate-50 p-4 border border-slate-150 rounded-xl space-y-1.5 font-sans shadow-xxs">
            <span className="text-blue-600 font-sans font-bold text-xs block">DNS 包首部剖析：</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-700">
              <div><strong className="text-slate-500">Source IP:</strong> <span className="font-mono">192.168.1.10</span></div>
              <div><strong className="text-slate-500">Dest IP:</strong> <span className="font-mono text-emerald-700">8.8.8.8</span> (DNS IP)</div>
              <div><strong className="text-slate-500">Source MAC:</strong> <span className="font-mono">00:1A:2B:3C:4D:5E</span></div>
              <div><strong className="text-slate-500">Dest MAC:</strong> <span className="font-mono text-amber-700 font-semibold text-amber-700 font-sans">00:11:22:33:44:55</span> (網關 MAC)</div>
              <div><strong className="text-slate-500">Dst Port:</strong> <span className="font-mono text-amber-600 font-bold">53</span> (DNS 專屬埠)</div>
            </div>
          </div>
          <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-200">
            🚨 <strong>易混淆觀念防禦：</strong> 雖然是要去 DNS Server (8.8.8.8)，但 L2 的 Dest MAC 寫的是「預設閘道」的 MAC！封包並非直飛 DNS，而是逐跳（Hop-by-Hop）前行，每次經過路由器都會重寫 MAC 表。
          </p>
        </div>
      )
    },
    {
      title: "第四步：NAT 路由器位址轉換（私有轉公有）",
      node: "NAT Router / Gateway (公網邊界)",
      layer: "網路層 (NAT 轉換與 Port Map 建表)",
      detailsHtml: (
        <div className="space-y-3">
          <p className="text-slate-700 text-sm leading-relaxed">
            DNS 回傳網頁伺服器 IP (128.119.40.186)。主機隨即發送 TCP SYN 連接。封包離開家裡，經過 <strong>NAT 路由器</strong>時，路由器發揮翻譯功能：
          </p>
          <div className="bg-slate-50 p-4 border border-slate-150 rounded-xl space-y-2 font-mono text-xs text-slate-700 shadow-xxs">
            <span className="text-rose-700 font-bold block font-sans">【NAT 映射重寫前後對比】</span>
            <div className="grid grid-cols-1 divide-y divide-slate-150">
              <div className="py-1">
                <span className="text-slate-500 block font-sans font-semibold mb-0.5">進入 NAT 路由器前 (LAN 側)：</span>
                <span>Source: <strong className="text-slate-800">192.168.1.10:5000</strong> ➔ Dest: <strong className="text-slate-600">128.119.40.186:80</strong></span>
              </div>
              <div className="py-1 pt-2">
                <span className="text-emerald-700 block font-sans font-semibold mb-0.5">穿出 NAT 路由器後 (WAN 公網側)：</span>
                <span>Source: <strong className="text-emerald-900 font-bold">138.76.29.7:12000</strong> ➔ Dest: <strong className="text-slate-800">128.119.40.186:80</strong></span>
              </div>
            </div>
          </div>
          <p className="text-slate-700 text-sm">
            NAT 路由器在大腦記錄映射：<code>192.168.1.10:5000 ⇄ 138.76.29.7:12000</code>，用以外網 SYN-ACK 回傳時能準確導流回正確的內網主機！
          </p>
        </div>
      )
    },
    {
      title: "第五步：跨 Internet 骨幹中繼轉發（Router 逐跳 MAC 重封）",
      node: "Router A ➔ Router B ➔ 目的地網域",
      layer: "資料平面 (轉發) / 控制平面 (路由)",
      detailsHtml: (
        <div className="space-y-3">
          <p className="text-slate-700 text-sm leading-relaxed">
            封包在公網骨幹穿行。每經過一台 ISP 路由器：
          </p>
          <ul className="list-disc pl-5 text-slate-700 space-y-1 text-sm">
            <li><strong>TTL 欄位</strong>強制減一。</li>
            <li><strong>L3 標頭 Checksum</strong> 重新校正計算。</li>
            <li><strong>比對最長前綴匹配（LPM）</strong>，從轉發表找到下一出孔。</li>
            <li>剝離原 L2 標頭，重新換上本跳輸出埠 MAC（Source） 與下一路由入口 MAC（Dest）。<strong>IP 絕對保持不變。</strong></li>
          </ul>
          <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-xs font-mono flex justify-between shadow-xxs">
            <div>
              <span className="text-slate-500 font-sans font-bold block mb-0.5">Router A ➔ B 行駛途中</span>
              <span>Src MAC: <strong className="text-blue-600 font-semibold">00:AA:BB:CC</strong></span><br />
              <span>Dst MAC: <strong className="text-amber-700 font-semibold">00:DD:EE:FF</strong></span>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span className="text-slate-500 font-sans font-bold block mb-0.5">網路層三層資料</span>
              <span>Src IP: <strong className="text-slate-800">138.76.29.7</strong></span><br />
              <span>Dst IP: <strong className="text-slate-800">128.119.40.186</strong></span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "第六步：Server 接應解封，連線建立完成（TCP HTTP 互動）",
      node: "Server NIC ➔ Web Application",
      layer: "鏈路層解封 ➔ 網路層校對 ➔ 傳輸層 Socket ➔ 應用層 API",
      detailsHtml: (
        <div className="space-y-3">
          <p className="text-slate-700 text-sm leading-relaxed">
            封包飛抵目的地 Google Web Server。伺服器網卡實施 <strong>CRC 冗餘檢驗</strong>，確定無 bit 損壞，解除乙太網幀（剝離 MAC），向上遞交。
          </p>
          <p className="text-slate-700 text-sm">
            網路層看清 IP 確屬本站（128.119.40.186），剝除 IP Header，將 TCP 載荷傳給 TCP 協定棧。TCP 依靠 Port 位 80 將數據傾洩於正確的 Web 服務 Socket，完成握手與 HTTP 回應！
          </p>
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3">
            <CheckCircle className="h-6 w-6 shrink-0 text-emerald-600" />
            <span className="text-xs font-bold leading-relaxed">
              恭喜！封包成功跨越五層漫空大洋！你已徹底打通網路概論 Chapter 4、5、6 的串連血脈！
            </span>
          </div>
        </div>
      )
    }
  ];

  const curr = STEPS[stepIndex];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs font-sans text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-wide">
            🌐 網際網路封包跨越五層「歷險記」互動模擬器
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            透視主機開機到獲取網頁資源，物理層、鏈路層、網路層（ARP/NAT/IP）的逐跳重寫生命旅程！
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200 shadow-xxs">
          <button
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((prev) => prev - 1)}
            className="p-1.5 rounded-lg bg-white border border-slate-202 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-950 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-mono font-bold px-2 text-slate-700">
            Step {stepIndex + 1} / {STEPS.length}
          </span>
          <button
            disabled={stepIndex === STEPS.length - 1}
            onClick={() => setStepIndex((prev) => prev + 1)}
            className="p-1.5 rounded-lg bg-white border border-slate-202 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-950 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Visual node flow bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between overflow-x-auto scrollbar-none gap-4">
        {STEPS.map((s, idx) => (
          <React.Fragment key={idx}>
            <button
              onClick={() => setStepIndex(idx)}
              className={`flex flex-col items-center gap-1.5 shrink-0 transition-all cursor-pointer outline-none`}
            >
              <div className={`h-8 w-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-all ${
                idx === stepIndex
                  ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                  : idx < stepIndex
                  ? "bg-emerald-50 text-emerald-700 border-emerald-250 border-emerald-200"
                  : "bg-white text-slate-400 border-slate-200"
              }`}>
                {idx + 1}
              </div>
              <span className={`text-xxs font-sans max-w-20 truncate text-center font-semibold ${idx === stepIndex ? "text-blue-600 font-bold" : "text-slate-500"}`}>
                {s.title.split("：")[1] || s.title}
              </span>
            </button>
            {idx < STEPS.length - 1 && (
              <div className="h-0.5 w-8 bg-slate-200 shrink-0"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Detailed Card display */}
      <div className="bg-slate-50/50 border border-slate-200 p-6 rounded-2xl space-y-4 shadow-xxs">
        <div className="space-y-1.5 border-b border-slate-150 pb-3">
          <span className="text-xxs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-mono uppercase tracking-widest border border-blue-100">
            {curr.layer}
          </span>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 font-sans tracking-tight mt-1.5">
            {curr.title}
          </h4>
          <p className="text-slate-500 text-xs font-sans mt-0.5">
            <strong>目前活動位置：</strong> {curr.node}
          </p>
        </div>

        <div>{curr.detailsHtml}</div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 2. COMPARE MODE COMPONENT                                                 */
/* ========================================================================= */
const CompareMode: React.FC = () => {
  const PAIRS = [
    {
      id: "plane",
      title: "Data Plane vs Control Plane",
      left: {
        name: "Data Plane（資料平面）",
        features: [
          "核心動作為：轉發（Forwarding）。",
          "負責將封包從該路由器的輸入埠搬到適合的輸出埠。",
          "時間尺度在「奈秒級（Nanoseconds）」，運行極速。",
          "大多採用硬體（ASIC 專屬晶片、TCAM快取記憶體）直接匹配加速。"
        ]
      },
      right: {
        name: "Control Plane（控制平面）",
        features: [
          "核心動作為：路由（Routing）。",
          "負責規劃封包從發送端到接收端經過的完整全程拓撲路徑。",
          "時間尺度在「毫秒級（Milliseconds）」，屬於邏輯思考性質。",
          "在傳統架構由路由處理器執行軟體計算（OSPF/BGP），集體分工。"
        ]
      },
      verdict: "資料平面是快速的指令執行者（硬體），控制平面是全局的決策大腦（軟體）。"
    },
    {
      id: "fwd-route",
      title: "Forwarding vs Routing",
      left: {
        name: "轉發（Forwarding）",
        features: [
          "路由器內部本地單個「去中心查找與匹配單一出門動作」。",
          "動作核心是使用 LPM 查對本地 Forwarding Table 中目的地欄位。",
          "類似：開車到一個單獨的十字路口，核查路牌往右轉出口。"
        ]
      },
      right: {
        name: "路由（Routing）",
        features: [
          "跨網路、全網範圍（Network-wide）的大型分布式路經規劃運算。",
          "動作核心是藉由 LS/DV 路由演算法，推演生成本地 Forwarding Table 的映射名單。",
          "類似：在出發自駕前，打開谷歌地圖，計算並標註全程該怎麼開。"
        ]
      },
      verdict: "「路由」是規劃地圖、寫好通配名冊；「轉發」是拿到大包，查名冊快速將其踢出去。"
    },
    {
      id: "ls-dv",
      title: "Link-State (LS) vs Distance Vector (DV)",
      left: {
        name: "Link-State Algorithm（如 Dijkstra / OSPF）",
        features: [
          "擁有全局地圖：在算路前，所有人向全網廣播鏈路資訊，拼湊完整 Topology 網絡狀態資訊。",
          "演算法複雜度高：Dijkstra 迭代搜索，需要為 O(N^2) 運算開銷。",
          "良藥擴散快：鏈路變化時全網秒速重新收斂。",
          "防毒能力強：節點只通報自己直連的 Cost，壞節點不易任意謊報捏造全局路由偽證。"
        ]
      },
      right: {
        name: "Distance Vector Algorithm（如 Bellman-Ford / BGP）",
        features: [
          "全去中心：節點不知道全局網絡圖，不知道除了鄰居之外的具體細部細節面貌。",
          "算路靠鄰居通報：每個節點重複與鄰居對帳，將「去所有目的地暫估最優值」與隔壁定時通報校正。",
          "壞消息傳播極慢：會有 count-to-infinity 閉環噩夢危機，需毒性逆轉（Poison reverse）反制。",
          "具備高脆弱性：若一個節點偽造錯的去往目的地代價，該毒素會光速擴散到沿途全部鏈路。"
        ]
      },
      verdict: "LS 是心懷全局地圖的大局學霸，DV 是走一步算一步、只靠鄰居傳話的信使網絡。"
    },
    {
      id: "ospf-bgp",
      title: "OSPF vs BGP",
      left: {
        name: "OSPF（開放最短路經優先）",
        features: [
          "屬於 系統內自治協定（Intra-AS Routing / IGP）。",
          "設計哲學：追求物理「最優性與速度」，算路全部自動套用 Dijkstra 累計 Cost（通常與頻寬反比）。",
          "基於 IP 承載（Protocol ID 89，無 TCP 開銷），在本地 Area 內洪泛通報（Symmetric Flooding）。"
        ]
      },
      right: {
        name: "BGP（邊界網關協定）",
        features: [
          "屬於 系統間自治協定（Inter-AS Routing / EGP）。",
          "設計哲學：追求「商業利益與自主政策（Policy-driven）」，不受網路物理成本束縛。例如管理者出資決定選路優先度。",
          "依靠 BGP Peering 的 TCP Session (Port 179) 來安全傳送。選路第一金律是管理者配的 Local Preference。"
        ]
      },
      verdict: "OSPF 追求物理速度與最省力路徑，BGP 追求商業地緣政治與資費政策。"
    },
    {
      id: "ipv4-ipv6",
      title: "IPv4 vs IPv6 Headers",
      left: {
        name: "IPv4 Header Structure",
        features: [
          "位址寬度：32-bit (約 42億個)，面臨枯竭困局。",
          "標頭長度變動（含 Options），多為 20~60 位組，極度依賴硬體動態偏移解碼。",
          "含有校驗和（Header Checksum）及分片控制鍵（ID, Flags, Offset），強推路由器做分片拆解，大大拖累轉發快取。"
        ]
      },
      right: {
        name: "IPv6 Header Structure",
        features: [
          "位址寬度：128-bit，數量大到「可以給地球上每顆沙子分發一個 IP」。",
          "固定 40-byte 基礎標頭，移除 options 到外掛 expansion 鏈，方便硬體管線流水查找。",
          "徹底幹掉了 Header Checksum（留給 Layer 2/4），且禁止路由器分片。分片失敗時由網關爆發 ICMP，逼主機自主重構，極大優化了路由轉速。"
        ]
      },
      verdict: "IPv6 通過捨棄變長 Options、Checksum 以及路由器分片等冗餘，配合大位址位寬，換取了硬體快轉高速。 "
    },
    {
      id: "switch-router",
      title: "Switch vs Router",
      left: {
        name: "Switch（交換器 - L2 電路端）",
        features: [
          "二層設備，專精在乙太網路訊框（Ethernet Frame）查找，不拆封 IP 網路層。",
          "依賴自學建表（MAC Address Table），完全即插即用，無須網絡工程師配 IP 地址。",
          "工作高度隔離：透過物理連接埠，直接截斷 Collision Domain（衝突網域）。但不阻斷 L2 廣播（Broadcast Domain）。"
        ]
      },
      right: {
        name: "Router（路由器 - L3 控制端）",
        features: [
          "三層設備，負責 IP Datagram 級拆封算路及分發對接。",
          "不靠廣播，而是依靠 LS/DV 選路演算法與 LPM 填表決定路由方向。網管必須配置其子網路 IP 與宣告閘口。",
          "最核心大功：直接物理阻斷 L2 廣播洪泛，作為 Broadcast Domain（廣播網域）之天然物理邊界！"
        ]
      },
      verdict: "交換器是就地自動接導線、不阻廣播的一線經理；路由器是分析網路號、封鎖廣播的總控指揮官。"
    },
    {
      id: "hub-switch",
      title: "Hub vs Switch",
      left: {
        name: "Hub（集線器 - L1 放大鏡）",
        features: [
          "一層實體層，是一個無腦的信號中繼放大器（Repeater）。",
          "在一個物理埠口收到任意 bit，直接盲目複寫洪泛到其餘全部接口。",
          "完全處於「同一個衝突網域（Collision Domain）」，任何兩站同時發送，直接撞毀信號。"
        ]
      },
      right: {
        name: "Switch（交換器 - L2 智慧閥）",
        features: [
          "二層鏈路層，具備高速晶片與快速快取，懂得識別與解析 MAC 標籤。",
          "依靠 MAC Table 實現快速點對點單播（Unicast），避免垃圾流量打碎無關埠口通訊。",
          "完美「斬斷衝突網域」，各個端口均是專屬的 Collision Domain。支援全雙工（Full-duplex）雙向通訊不打架。"
        ]
      },
      verdict: "Hub 是拿著喇叭朝所有人吼叫的噪音放大座，Switch 是按收信件名單投信、在密室通話的智能郵務官。"
    },
    {
      id: "partition",
      title: "TDMA vs FDMA vs CDMA",
      left: {
        name: "TDMA (時分接取) & FDMA (頻分接取)",
        features: [
          "TDMA：所有人共享同一個實體頻段，但被切分成無數循環的時間片（Slots），到自己的時刻才能發送。",
          "FDMA：所有人共享同一個時間，但各人都配發了相互絕緣的、專屬的窄頻段頻譜，在自己的頻率上不間斷發言。"
        ]
      },
      right: {
        name: "CDMA（碼分多址）",
        features: [
          "完全打破時間與空間的二元分割，所有人在同一個時間，使用同一個頻率進行不間斷發言！",
          "編碼隔離：每個用戶配備一串相互偏置正交（Orthogonal）的晶片碼（Chipping Key）。發送時直接融入混合波接收。",
          "接收端利用內積（Dot Product）計算，可毫無雜音地分離出各個頻道的原始 bit 數據。"
        ]
      },
      verdict: "TDMA 是大家輪流上講台說話；FDMA 是拉起圍欄分開大廳說話；CDMA 是大廳內有多人用不同國家語言同時說話，大腦靠語義聽懂其中一路。"
    },
    {
      id: "csma-cd-ca",
      title: "CSMA/CD vs CSMA/CA",
      left: {
        name: "CSMA/CD (碰撞檢測 - 有線乙太網)",
        features: [
          "動作信條：一邊發送，一邊嚴密監聽鏈路電壓。一旦察覺有人撞車，立即停止發送並廣播 Jam Signal（干擾信號）。",
          "隨即進入二進制指數退避（Binary Exponential Backoff）演算法，隨機選取時槽退後再試。",
          "其碰撞極易以硬體低開銷形式測得。"
        ]
      },
      right: {
        name: "CSMA/CA (嚴重預防碰撞 - 無線 802.11 Wi-Fi)",
        features: [
          "因為無線網卡天線在發射時噪聲高，無法邊發邊檢測 Collision。且面臨隱端問題（Hidden Terminal），只能主力防禦預防碰撞！",
          "引入「虛擬監聽與 RTS/CTS（請求/允許發送）握手預約」，提早宣告我要講話多久，封鎖其他人的通道時間，以此降低真碰撞。"
        ]
      },
      verdict: "CSMA/CD 有線網：撞了就撞了，撞完大叫，隨機退讓重來；CSMA/CA 無線網：不敢撞、測不出，必須提前申請預約防範衝突。"
    }
  ];

  const [selectedPairId, setSelectedPairId] = useState(PAIRS[0].id);
  const activePair = PAIRS.find((p) => p.id === selectedPairId) || PAIRS[0];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs font-sans text-slate-900 animate-fade-in">
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-wide">
          ⚖️ 電腦網路高頻考點對照鏡 Compare Mode
        </h3>
        <p className="text-slate-500 text-xs">
          一鍵切換網路概論核心極易混淆的這幾大概念、技術與協定，助你融會貫通！
        </p>
      </div>

      {/* Select buttons for pairs */}
      <div className="flex flex-wrap gap-2">
        {PAIRS.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPairId(p.id)}
            className={`px-3 py-1.5 rounded-xl font-sans text-xs font-semibold cursor-pointer transition-all ${
              selectedPairId === p.id
                ? "bg-blue-600 text-white border border-blue-500 shadow-sm"
                : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-800"
            }`}
          >
            {p.title.split(" (")[0]}
          </button>
        ))}
      </div>

      {/* Vertical Side-by-side comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Left Concept Card */}
        <div className="bg-slate-50/50 p-6 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4 shadow-xxs">
          <div className="space-y-4">
            <span className="text-blue-700 font-bold font-sans text-sm block border-b border-blue-105 border-slate-100 pb-2">
              🟢 {activePair.left.name}
            </span>
            <ul className="space-y-3">
              {activePair.left.features.map((f, idx) => (
                <li key={idx} className="flex gap-2 text-slate-700 text-xs sm:text-sm leading-relaxed">
                  <span className="text-blue-500 select-none">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Concept Card */}
        <div className="bg-slate-550/40 bg-slate-50/50 p-6 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4 shadow-xxs">
          <div className="space-y-4">
            <span className="text-amber-800 font-bold font-sans text-sm block border-b border-amber-105 border-slate-100 pb-2">
              🟡 {activePair.right.name}
            </span>
            <ul className="space-y-3">
              {activePair.right.features.map((f, idx) => (
                <li key={idx} className="flex gap-2 text-slate-700 text-xs sm:text-sm leading-relaxed">
                  <span className="text-amber-600 select-none">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Verdict Callout box */}
      <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl flex items-start gap-3 shadow-xxs">
        <Info className="h-5 w-5 mt-0.5 shrink-0 text-blue-600" />
        <div>
          <strong className="text-blue-900 text-xs sm:text-sm font-sans block mb-1 font-bold">
            學長/老師助攻記憶法：
          </strong>
          <span className="text-xs text-slate-700 font-sans leading-relaxed">
            {activePair.verdict}
          </span>
        </div>
      </div>
    </div>
  );
};
