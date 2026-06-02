import React from "react";
import { LatexRenderer } from "./LatexRenderer";
import { Zap, Tag, Brain, HelpCircle, CheckSquare } from "lucide-react";

interface FormulaItem {
  id: string;
  name: string;
  latex: string;
  topic: string;
  chineseDesc: string; // 中文解釋
  whenToUse: string;    // 何時使用
  examPatterns: string; // 常見考法
  example: string;      // 小例子
}

const FORMULAS_DATA: FormulaItem[] = [
  {
    id: "dijkstra",
    topic: "Chapter 5: Control Plane",
    name: "1. Dijkstra 最短路徑更新式（Dijkstra’s Algorithm）",
    latex: "D(v) = \\min \\big( D(v), D(w) + c_{w,v} \\big)",
    chineseDesc: "此公式是 Link-State (LS) 路由演算法的核心鬆弛更新式。當一個新的節點 w 被加入已求得最短路徑的確定集合 N' 中後，路由器需要以 w 作為跳板，重新檢查並更新其所有尚未被加入 N' 的鄰居節點 v。若「經由 w 到 v 的代價」比「原先估計到 v 的代價」還要小，則將 D(v) 更新為 D(w) + c_{w,v}，並將 v 的前驅節點記錄為 w。",
    whenToUse: "在全網路各路由器都知悉完整網路拓撲（Topology）時，用來以集中式計算某特定單一源點（Source Node）到其他所有節點的最短路徑樹與排程 forwarding table。",
    examPatterns: "1. 矩陣表格手寫大題：填寫每一輪（Step）的 N' 集合、各節點的最短退避成本與前驅對應 D(v),p(v)。\n2. 轉發表生成：根據最短路徑樹，寫出前往各目標節點的最短路徑出口埠（Interface）。\n3. 複雜度計算：問基本搜尋的 O(n^2) 或利用 Priority Queue 堆疊優化後的 O((n+e) log n) 以及訊息廣播複雜度 O(n*e)。",
    example: "假設目前源節點到目的地 t 的舊成本 estimates D(t) = 9。現在最新加入 N' 的頂點為 w（其最終最小代價 D(w) = 5），且 w 與 t 之間有直接物理連線，代價 c_{w,t} = 3。套用公式：D(t) = min(9, 5 + 3) = min(9, 8) = 8。成本重整成功，D(t) 鬆弛更新為 8，前驅節點 pointer 指向 w。"
  },
  {
    id: "bellman-ford",
    topic: "Chapter 5: Control Plane",
    name: "2. Distance Vector / Bellman-Ford 距離向量方程式",
    latex: "D_x(y) = \\min_{v} \\big\\{ c_{x,v} + D_v(y) \\big\\}",
    chineseDesc: "Bellman-Ford 方程式是用於 Distance Vector (DV) 演算法的分散式遞迴表達式。節點 x 欲得知其前往遠方目的地 y 的最短總路徑代價時，不需要知悉全網地圖；只要將其「到鄰居 v 的直接實體鏈路代價 c_{x,v}」加上「鄰居 v 報稱到目的地 y 的宣稱代價 D_v(y)」，並對所有直接相鄰對等的鄰居 v 求最小值，即為所求。",
    whenToUse: "在分散式、非同步、自主運行的距離向量路由協定（如 RIP）中，路由器定期且自發地向其鄰居交換更新路由表資訊時使用。",
    examPatterns: "1. 遞迴表格迭代手算：給定一個小型三個或四個路由器的網路，連續手寫 BF 方程式在兩到三個時間間隔下的自我更變。\n2. 計數到無窮大（Count-to-Infinity）申論：說明鏈路惡化時壞消息傳得慢、互相套娃遞迴推高的成因，以及毒性反轉（Poisoned Reverse）的解法與 3-node loop 限制。",
    example: "節點 x 面臨要前往目的地 y。x 有兩個鄰居 a 與 b：x 到 a 的直接代價 c_{x,a} = 2；x 到 b 的直接代價 c_{x,b} = 7。目前 a 的距離向量宣稱 D_a(y) = 5；b 的宣稱 D_b(y) = 1。套用公式：D_x(y) = min { (c_{x,a} + D_a(y)), (c_{x,b} + D_b(y)) } = min { 2+5, 7+1 } = min { 7, 8 } = 7。因此最優路徑代價為 7，且下一次轉發應投往鄰居 a。"
  },
  {
    id: "buffering",
    topic: "Chapter 4: Data Plane",
    name: "3. 路由器佇列緩衝區設計準則（RTT & Capacity Formula）",
    latex: "B = RTT \\times C",
    chineseDesc: "此公式是計算路由器輸出埠排隊佇列（Queueing Buffer）大小的業界經驗準則（Rule of Thumb）。在維持高網絡利用率的前提下，緩衝容量大小 B 應約等於該鏈路往返時間（RTT）乘以實體鏈路頻寬容量（C）。若是多個獨立流流經該埠（假設有 N 個 Flows），則公式可精細優化為：B = (RTT * C) / sqrt(N)。",
    whenToUse: "在設計具有高突發排隊負荷的高速核心骨幹網路由器時，用以界定緩衝記憶體（Buffer Size）的大小，以求兼顧高傳輸率與降低 Bufferbloat 的系統級取捨。",
    examPatterns: "1. 直接代入算術題：給定主幹線路的 RTT（例如 250 ms）與線路頻寬（例如 10 Gbps），求最佳緩衝大小位元組容量。\n2. 多流計算：引入獨立流數量 N，將原結果除以 sqrt(N) 得到優化後的緊湊緩衝大小。",
    example: "一條骨幹光纖線路的 RTT = 100 ms（0.1 秒），鏈路頻寬為 C = 10 Gbps。傳統 Rule of Thumb 式緩衝容量為：B = 0.1 * 10,000,000,000 = 1,000,000,000 bits = 1 Gbit（約合 125 MB 緩衝記憶體）。但若已知這條線路載入 N = 100 條不同的 TCP flows，則緩衝區大小可壓縮為：B_N = B / sqrt(100) = 1 Gbit / 10 = 100 Mbit（約 12.5 MB）。"
  },
  {
    id: "wfq",
    topic: "Chapter 4: Data Plane",
    name: "4. 加權公平佇列頻寬分配（WFQ Bandwidth Allocation）",
    latex: "\\text{share}_i = \\frac{w_i}{\\sum_j w_j}",
    chineseDesc: "在加權公平佇列（Weighted Fair Queueing, WFQ）排程排隊法中，各個活躍（Active）的流量類別 i 將根據其指派的權重 w_i 分享整條輸出頻寬。公式代表流量 class i 能夠獲得的**頻寬份額比例**。若線路總頻寬容量為 R，則該類別獲得的具體保證頻寬額為：share_i * R。",
    whenToUse: "在路由器輸出埠提供服務品質保證（QoS）與區分服務（DiffServ）排程調度時，用以在面臨高擁堵時按契約公平劃分頻寬、避免低權優先級 class 被完全餓死（Starvation）。",
    examPatterns: "1. 頻寬分配計算：給定各類別流量權重（例如 3, 2, 1）與出口總頻寬 R（例如 12 Mbps），計算在「所有類別均有大流量、滿載」情境下，各類別所得頻寬。\n2. 概念簡答題：若某一類別此時是「空閒無封包限制（Inactive）」，問剩下的活躍類別如何瓜分頻寬。（即重新計算分母求份額）。",
    example: "輸出埠有 3 個流量類別排隊，各自的權重 w_1 = 3, w_2 = 2, w_3 = 1。在整網持續滿載、均有源源不絕的封包準備向外發送的情境下，類別 1 所能享有的保證頻寬份額比例為：share_1 = 3 / (3 + 2 + 1) = 3 / 6 = 50%。若出口總頻寬容量為 R = 18 Mbps，則分配到的保障傳輸帶寬為：18 * 50% = 9.0 Mbps。這保障了類別 1 最低 QoS 性能。"
  },
  {
    id: "crc",
    topic: "Chapter 6: Link Layer and LANs",
    name: "5. CRC 循環冗餘檢驗二進位關係式",
    latex: "\\langle D, R\\rangle = D \\cdot 2^r \\oplus R",
    chineseDesc: "這是用於 Layer 2 CRC 循環冗餘檢查的位元拼接方程式。⊕ 代表無借進位的二進制 XOR（互斥或，等同模二加法/減法）。D 代表傳送端欲送出的 d 位元長原始數據；r 代表接收端與發送端約定好生成多項式（Generator G）的最高次（r 次方），這意味著校驗碼 R 將會具有 r 個 bits。公式物理意義是在原始數據 D 後方直接補上 r 個 0，再用 XOR 補上算好的餘數 R，好讓發出的 bits 訊息剛好可以被 G 模二整除。",
    whenToUse: "在有線乙太網路、Wi-Fi、乃至各類硬體網絡晶片發射端和接收端進行高速偵錯（Error Detection）校驗。",
    examPatterns: "1. 完整手算大題（期末基本送分題）：給定二進制原始數據 D （如 101010）與生成多項式 G（如 1011），依序手動求出 R 並拼寫出發送端的 ⟨D, R⟩ 位元組。\n2. 運算法概念：問接收端如何驗證（即除以 G 看餘數是否為 0），以及為什麼模二運算中不需要借進位。",
    example: "原數據 D = 101110（二進制），生成多項式 G = 1001 ($r=3$)。我們將 D 向左推 r 欄，即補三個 0 變為 101110000。直式長除模二除以 1001，經歷 XOR 退位計算後，求得三位的餘數 R = 011。我們將 011 覆蓋到補零的地方，最終合成物理信道發射的訊息為：D . 2^r ⊕ R = 101110011。接收端收到後再次模二除以 1001，能整除無任何餘數則判定電晶體數據傳遞完美無誤。"
  },
  {
    id: "cidr",
    topic: "Chapter 4: Data Plane",
    name: "6. CIDR 無類別域間路由定址結構",
    latex: "\\text{Address Format: } a.b.c.d/x",
    chineseDesc: "此格式為無類別域間路由（CIDR）的標準表達，其中前綴網口 /x 代表前 x 個位元代表該網路的「子網前綴（Subnet Prefix / Network Prefix）」，其長度可彈性更動，不用像早期大班制 A, B, C 類那樣僵硬分配。剩下的 (32 - x) 位元則由本網段的管理員自行分配給主機介面使用。",
    whenToUse: "在網路定址、子網路劃分、轉發表路由項聲明前綴匹配中，對 IPv4 位址與子網進行彈性規劃與最高效的路由彙整。",
    examPatterns: "1. 子網劃分算算看：問某 /x 網段總共能容納多少台有效主機（需要扣除保留的主機全零網路 IP 與主機全一廣播 IP，共扣 2 個）。\n2. 路由彙整（Aggregation）：給予多個分散的小型 /24 子網，詢問如何找出共通二進制前綴進行最高性能合併輸出。",
    example: "地址 `200.23.16.0/23` 代表前 23 位是子網號。其餘可用主機號有 32 - 23 = 9 位元。因此總共可供分配的 IP 地址容量為 2^9 = 512 個。除去了特殊的全零子網本 IP 和全 1 的局域網廣播 IP `200.23.17.255` 後，有效可分配主機數量上限為 510 台。"
  },
  {
    id: "ipv4-size",
    topic: "Chapter 4: Data Plane",
    name: "7. IPv4 全球理論位址總空間大小",
    latex: "\\text{IPv4 Address Size} = 2^{32}",
    chineseDesc: "IPv4 協議中每個 IP 地址是由 32 位元（32 bits，即 4 bytes）二進位序列所構成。理論上可對全球進行唯一性編配的獨立位址席位總容量上限為 2^32，約合 43 億（4,294,967,296）個位址。",
    whenToUse: "在網際網路骨幹架構分析、地址短缺危機評估、DHCP與NAT技術必要性論證中使用。",
    examPatterns: "1. 基本填空算術：比較 IPv4 與 IPv6 空間體量差距。\n2. 問答題：敘述當 2^32 定址資源在 2011 年左右完全枯竭後，Internet 引入了哪些主要救急技術或核心新標準（答：DHCP, NAT 與 IPv6 轉骨升級）。",
    example: "全球總人口已突破 80 億，每人若皆有手機及筆電，2^32 個 IPv4 地址即便完全無失真精準發配也已供不應求。多數主機只能在內網使用虛擬 IP，在邊緣路由器用 NAT 共用極少數的世界公網 IP 出入。"
  },
  {
    id: "ipv6-size",
    topic: "Chapter 4: Data Plane",
    name: "8. IPv6 全球理論位址總空間大小",
    latex: "\\text{IPv6 Address Size} = 2^{128}",
    chineseDesc: "IPv6 協議將 IP 點位一舉擴充到了 128 位元（128 bits，即 16 bytes）。其理論可發配的全球唯一物理位址上限為 2^128 個（約合 3.4 * 10^38 個位址）。此池子大到能夠為地球上的每一粒沙、每一朵花分配上百萬個專屬對外的 IP 位址，徹底解決了地址耗盡之虞並為物聯網打下地基。",
    whenToUse: "在部署高密度大型物聯網、超高速骨幹網通訊、逐步汰除 NAT 回歸乾淨的端到端直接通訊（End-to-End communication）時採用。",
    examPatterns: "1. 面對 IPv6 的特點問答題：寫出 IPv6 比起 IPv4 除了空間爆發性劇增到 2^128 外，其 Header 首部長度設計（固定 40 位組）及其他優勢（如無 checksum 加速轉發、不分片機制、強插擴充標頭等）。",
    example: "在 IPv6 的普及下，不再有內外網轉換的尷尬，每台智慧手錶和智慧電燈皆能分配到全網唯一的 `2001:0db8:85a3:0000:0000:8a2e:0370:7334` 位址，能以極佳安全標準直接對外進行對等通聯。"
  }
];

export const FormulaSheet: React.FC = () => {
  return (
    <div className="space-y-6 font-sans text-slate-900" id="formula-sheet-container">
      {/* Visual Header Banner */}
      <div className="flex items-center gap-3 bg-slate-50 border border-slate-205 p-5 rounded-2xl relative overflow-hidden shadow-xs">
        <div className="p-3 bg-amber-50 text-amber-750 border border-amber-100 rounded-2xl shrink-0">
          <Zap className="h-6 w-6 text-amber-600 animate-pulse" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 font-sans tracking-tight">
            學霸必藏：期末公式 ✕ 演算法 手算速成精要
          </h2>
          <p className="text-slate-500 text-xs mt-1 leading-relaxed">
            嚴格對照 Dijkstra, Bellman-Ford, RTT Buffering, WFQ Share, CRC MOD-2, CIDR 實例，考前 10 分鐘提速首選
          </p>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 gap-6">
        {FORMULAS_DATA.map((item) => (
          <div
            key={item.id}
            id={`formula-card-${item.id}`}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-3xl p-6 transition-all duration-200 shadow-xs relative overflow-hidden"
          >
            {/* Topic label line */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-5 gap-2">
              <h3 className="text-sm sm:text-base font-sans tracking-wide font-extrabold text-slate-900 flex items-center gap-2">
                <Tag className="h-4 w-4 text-blue-500" />
                <span>{item.name}</span>
              </h3>
              <span className="px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 font-mono text-xxs font-bold rounded-lg uppercase tracking-wider self-start sm:self-auto">
                {item.topic}
              </span>
            </div>

            {/* Premium Render Block */}
            <div className="my-6 bg-slate-50 border border-slate-150 p-6 rounded-2xl flex items-center justify-center shadow-xxs relative">
              <span className="absolute top-2 left-2 text-slate-400 font-mono text-xxs select-none font-bold">
                MATH LATEX EXPRESSION
              </span>
              <div className="py-2 overflow-x-auto max-w-full text-center">
                <LatexRenderer math={item.latex} block={true} />
              </div>
            </div>

            {/* Formatted metadata stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 border-t border-slate-100 pt-5">
              
              {/* Left Column: Conceptual definitions */}
              <div className="space-y-4">
                <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-150/80 space-y-1 shadow-xxs">
                  <span className="text-xxs font-sans font-bold text-blue-600 tracking-wider flex items-center gap-1 uppercase">
                    <Brain className="h-3.5 w-3.5 text-blue-500" />
                    <span>【中文學術解釋】</span>
                  </span>
                  <p className="text-slate-700 text-xs sm:text-sm font-sans leading-relaxed">
                    {item.chineseDesc}
                  </p>
                </div>

                <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-150/80 space-y-1 shadow-xxs">
                  <span className="text-xxs font-sans font-bold text-indigo-600 tracking-wider flex items-center gap-1 uppercase">
                    <CheckSquare className="h-3.5 w-3.5 text-indigo-500" />
                    <span>【何時使用 / 適用場景】</span>
                  </span>
                  <p className="text-slate-700 text-xs sm:text-sm font-sans leading-relaxed">
                    {item.whenToUse}
                  </p>
                </div>
              </div>

              {/* Right Column: Testing and Examples */}
              <div className="space-y-4">
                <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-150/80 space-y-1 shadow-xxs">
                  <span className="text-xxs font-sans font-bold text-amber-700 tracking-wider flex items-center gap-1 uppercase">
                    <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
                    <span>【期末直擊：常見考法】</span>
                  </span>
                  <p className="text-slate-700 text-xs sm:text-sm font-sans whitespace-pre-line leading-relaxed">
                    {item.examPatterns}
                  </p>
                </div>

                <div className="bg-emerald-50/45 p-4 rounded-2xl border border-emerald-150 border-emerald-200/60 space-y-1 shadow-xxs">
                  <span className="text-xxs font-sans font-bold text-emerald-700 tracking-wider flex items-center gap-1 uppercase">
                    <Zap className="h-3.5 w-3.5 text-emerald-605 text-emerald-60s text-emerald-650" />
                    <span>【小例子對比實算】</span>
                  </span>
                  <p className="text-slate-700 text-xs sm:text-sm font-sans leading-relaxed">
                    {item.example}
                  </p>
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
