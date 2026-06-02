import { ChapterData, ChapterId } from "../types";

export const CHAPTER_REVIEW_DATA: ChapterData[] = [
  {
    id: ChapterId.CH4,
    title: "Chapter 4: Network Layer - Data Plane（網路層：資料平面）",
    concepts: [
      {
        id: "ch4-overview",
        title: "1. Network Layer Overview: 資料平面與控制平面",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### 核心任務
網路層的主要任務是將封包（Datagrams）從發送端主機運送到接收端主機。這包含以下關鍵功能、平面與服務模型：

*   **資料平面（Data Plane）**：
    *   **定義**：決定封包抵達路由器的**輸入埠（Input Port）**後，如何被移動到合適的**輸出埠（Output Port）**。
    *   **核心功能為 轉發（Forwarding）**：這是單一路由器內部的本地（Local）硬體級高效率運作，通常在**奈秒（Nanosecond）**級完成。
*   **控制平面（Control Plane）**：
    *   **定義**：決定封包如何跨越整個全網路從起點端（Source）路由到目的端（Destination）。
    *   **核心功能為 路由（Routing）**：這是全網範圍（Network-wide）的軟體級運行，決定封包遵循的路徑，運作時間通常在**毫秒（Millisecond）**級。
    *   **實現方式**：
        1. *傳統分散式方案（Per-router control）*：各路由器獨立執行路由演算法。
        2. *集中式方案（Software-Defined Network, SDN）*：邏輯集中控制器計算好後，下發轉發表給路由器。

### 網路層服務模型（Service Model）
網際網路使用**盡力而為（Best-Effort Service Model）**：
*   **不保證**：封包是否能保證安全抵達。
*   **不保證**：封包抵達的時間延遲或順序（可能發生嚴重亂序與延遲抖動）。
*   **不保證**：端到端的可用頻寬。
*   *優點*：極大簡化了網路邊緣及路由器硬體的複雜度，造就了 Internet 的全球極速擴展與高相容性！`
      },
      {
        id: "ch4-router-arch",
        title: "2. Router Architecture: 路由器硬體架構",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `路由器主要由以下四大核心組件構成：

1.  **輸入埠（Input Port）**：
    *   執行物理層（位元接收）與資料鏈路層（解封裝，如乙太網路或 802.11 訊框）。
    *   進行**去中心化查找與轉發**：根據轉發表在輸入埠本地進行最長前綴匹配（LPM），決定下行的輸出埠。
    *   為了能承受瞬時高流量，輸入埠必須達到**線路速度（Line Speed）**——即硬體能承受的最高輸入速率。
2.  **交換結構（Switching Fabric）**：
    *   將輸入埠的封包搬移至正確的輸出埠。其搬移能力決定了路由器的整體轉發速率。
    *   **三種交換方法（Switching Methods）**：
        *   **經由記憶體（Switching via Memory）**：早期架構。封包被 CPU 複製到系統記憶體中，受限於記憶體匯流排頻寬（封包需進出記憶體各一次）。
        *   **經由匯流排（Switching via Bus）**：封包經由一條共享匯流排直接由輸入埠傳送至輸出埠，不需要 CPU 涉入，但會發生**匯流排爭用（Bus Contention）**，一次僅能有一台埠發送。
        *   **經由互連網路（Switching via Interconnection Network）**：如 Crossbar（交叉開關）或 Clos 多級開關。利用二維交叉開關矩陣，伺服器發送端允許多個封包**並行（Parallel）**穿越而互不干擾。
3.  **輸出埠（Output Port）**：
    *   包含緩衝管理（Buffer Management）、封包排程（Packet Scheduling，如 FIFO、Priority、WFQ）與物理發送。
4.  **路由處理器（Routing Processor）**：
    *   執行控制平面軟體協定編排（如 OSPF、BGP 路由協定），產生並更新**轉發表（Forwarding Table）**，並下發給各個輸入埠。`
      },
      {
        id: "ch4-queuing-scheduling",
        title: "3. Queueing and Scheduling: 排隊溢位與排程公式",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: true,
        contentMarkdown: `當進入交換結構的封包速率超過交換結構或輸出埠的承載能力時，封包必須在路由器內部排隊，因而引發延遲甚至丟包。

### 輸入埠排隊（Input Port Queueing）
*   當交換結構速度慢於所有輸入埠輸入速度總和時，封包在輸入佇列中排隊。
*   **隊首阻塞（Head-of-the-Line Blocking, HOL Blocking）**：在第一個被排在佇列隊首的封包，因為它要去的輸出埠正處於繁忙（交換結構正在處理去該埠的其他封包），導致排在它後面的、原本要去空閒輸出埠的其他封包，也全部被連帶阻擋而無法發送！這會嚴重拉低路由器的吞吐量。

### 輸出埠排隊（Output Port Queueing）
*   當交換結構遞送至某一特定輸出埠的速度，快於該輸出埠向外發送的實體線路速率時，封包在輸出佇列中排隊。

### 緩衝區管理（Buffer Management）與 Tail Drop
當輸出佇列滿時，緩衝區管理必須採取丟包策略：
*   **尾部丟棄（Tail Drop）**：最簡單的做法，當緩衝區滿了，任何新抵達的封包一律丟棄。
*   **主動佇列管理（AQM / RED）**：在佇列未滿前就隨機丟包，向端端 TCP 發出塞車警訊。
*   **緩衝大小計算公式（Buffering Formula）**：
    *   傳統 Rule of Thumb：$$B = RTT \\times C$$
        *   $C$: 線路頻寬（Link Capacity）。
        *   $RTT$: 往返延遲。
    *   若有多條獨立 TCP 流（假設數量為 $N$）：$$B = \\frac{RTT \\times C}{\\sqrt{N}}$$

### 封包排程（Packet Scheduling）
1.  **優先排程（Priority Scheduling）**：將封包分為多個高、低優先等級。當輸出埠空閒，一律先發送高優先等級佇列中的封包。
2.  **輪詢（Round Robin, RR）**：循環掃描各個類別佇列，每個類別輪流發送一個封包。
3.  **加權公平排隊（Weighted Fair Queueing, WFQ）**：
    *   為每個類別佇列指派一個權重 $w_i$。
    *   在線路繁忙時，類別 $i$ 保證可獲得的頻寬比例（Share）為：
        $$\\text{share}_i = \\frac{w_i}{\\sum_j w_j}$$
    *   *常考題型*：給定三個類別權重 $w_1=3, w_2=2, w_3=1$，求在持續滿載下各自佔有多少比例的頻寬？
        *   解：類別 1 佔 $\\frac{3}{3+2+1} = \\frac{3}{6} = 50\%$，類別 2 佔 $33.3\\%$，類別 3 佔 $16.7\\%$。`
      },
      {
        id: "ch4-ip-datagram",
        title: "4. IP Datagram Format: IPv4 數據報格式",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### IPv4 標頭欄位詳解
IPv4 封包通常含有 **20 節組（bytes）** 的固定長度標頭：

1.  **版本（Version）**：4位元。指明 IP 的版本（\`4\` 或 \`6\`）。
2.  **標頭長度（Header Length, IHL）**：4位元。單位是 **4位組（4 bytes）**。若值為 \`5\`，代表標頭長度為 $5 \\times 4 = 20$ bytes。
3.  **服務類型（Type of Service, TOS）**：用於區分不同優先級的封包（DiffServ）。
4.  **總長度（Total Length）**：16位元。IP 數據報的總長度（含 Header 與 Data Payload），最大為 $65535$ 節組。
5.  **分片控制欄位（Fragmentation Fields）**：
    *   **識別碼（Identifier, ID）**：16位元。相同原始封包的分片具備相同 ID。
    *   **旗標（Flags）**：3位元。包含 DF（Don't Fragment）與 MF（More Fragments）旗標。
    *   **分片偏移量（Fragment Offset）**：13位元。**單位是 8位組（8-byte units）**。
6.  **存活時間（Time To Live, TTL）**：8位元。防止封包在網路上無限循環。每經過一台路由器，TTL 減 1，減至 0 時封包丟棄並向源端傳回 ICMP 報錯。
7.  **協定（Protocol Field）**：8位元。指出 IP 數據報的 Payload 應送交給上層哪一個傳輸層協定（如 \`6\` 代表 TCP，\`17\` 代表 UDP）。
8.  **標頭總和檢查碼（Header Checksum）**：16位元。僅對 IP 標頭進行錯誤檢測（不包含 Data Payload 提高轉發效率）。
9.  **來源 IP 位址（Source IP Address）**：32位元。
10. **目的 IP 位址（Destination IP Address）**：32位元。`
      },
      {
        id: "ch4-ip-addressing",
        title: "5. IP Addressing & CIDR: 最長前綴匹配與路由彙整",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### 基礎觀念
*   **32位元 IP 位址**：採用層級化結構（Hierarchical Layout），由**網路號前綴（Subnet Prefix）**與**主機號（Host Number）**兩部分構成。
*   **介面（Interface）**：主機/路由器與物理鏈路之間的邊界連接點。路由器通常具有多個介面，每個介面各配備一個獨立唯一的 IP 地址。
*   **子網路（Subnet）**：
    *   定義：各介面之間在物理上不經過任何 Layer 3 路由器，而能直接在 Layer 2 互通的介面集合。
*   **無類別域間路由（Classless Inter-Domain Routing, CIDR）**：
    *   位址格式：\`a.b.c.d/x\`，其中 \`/x\` 為**子網遮罩（Subnet Mask）**，指出前 $x$ 位元為子網號。例如：\`200.23.16.0/23\` 代表前 23 位為子代號，剩餘 9 位可分配給主機。其 IPv4 的位址總容量為 $2^{32}$ 個。

### 最長前綴匹配（Longest Prefix Matching）
當路由器在 Forwarding Table 中查找目的 IP 的匹配項時：
> **最長前綴匹配規則**：若目的 IP 同時匹配了轉發表中的多個子網前綴項，路由器**必須選擇與其匹配前綴位元數最多（即網路遮罩 /x 最大、最精準）**的介面發出。
*   *例子*：目的 IP 為 \`11001000 00010111 00011000 10101010\` 的封包。
    *   路由項 A: \`11001000 00010111 00011000 /23\` 匹配（前 23 位一致）。
    *   路由項 B: \`11001000 00010111 00011000 1 /25\` 匹配（前 25 位一致）。
    *   *決定*：選擇路由項 B 轉發（匹配長度 25 > 23）。

### 路由彙整（Route Aggregation）
利用 CIDR 前綴，將多個細碎子網合併為單一前綴發送宣告，從而縮小骨幹路由表。
*   *例子*：\`200.23.16.0/24\`、\`200.23.17.0/24\`、\`200.23.18.0/24\`、\`200.23.19.0/24\` 可合併為 \`200.23.16.0/22\`（因為前 22 位完全一致）。`
      },
      {
        id: "ch4-dhcp-detail",
        title: "6. DHCP: 動態配置主機通訊協定",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### 什麼是 DHCP？
**動態主機設定協定（Dynamic Host Configuration Protocol）**允許主機接入網路時，自動獲取 IP 位址，並支持 IP 地址的「租借與回收」。
*   運作在應用層，底層依賴 **UDP port 67 (Server)** 與 **port 68 (Client)**。

### 經典 DHCP 交互四步驟（必考英文步驟！）
*主機剛加入網路，不具備 IP，故全部以 IP 廣播發送通訊：*
1.  **DHCP Discover（發現）**：
    *   Client -> Server 廣播尋找 DHCP 伺服器。
    *   \`Src IP: 0.0.0.0, Dst IP: 255.255.255.255\`
2.  **DHCP Offer（提供）**：
    *   Server -> Client 廣播提議提供配置方案（內含預定 IP、租約期等）。
    *   \`Src IP: Server IP, Dst IP: 255.255.255.255\`
3.  **DHCP Request（請求）**：
    *   Client -> Server 廣播選取該 Offer，向該伺服器請求。
    *   \`Src IP: 0.0.0.0, Dst IP: 255.255.255.255\`
4.  **DHCP ACK（確認）**：
    *   Server -> Client 廣播最終確認分配。
    *   \`Src IP: Server IP, Dst IP: 255.255.255.255\`

### DHCP 提供的「四大基本組態參數」
透過 DHCP ACK，新加入網路的主機一次性打包獲得：
1.  **分配的 IP 位址**
2.  **子網遮罩（Subnet Mask）**
3.  **預設閘道器（Default Gateway）的 IP 位址**
4.  **DNS 伺服器的 IP 位址**`
      },
      {
        id: "ch4-nat-detail",
        title: "7. NAT: 網路地址轉換之運作與穿透",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### 運作原理與優點
**網路地址轉換（Network Address Translation）**旨在解決 32-bit IPv4 地址短缺。它允許整個私網（內部家庭、企業網，如使用保留內網 IP：\`192.168.0.0/16\`、\`10.0.0.0/8\`）在向外部公網進行通訊時，**全部共享一個（或極少數個）全球唯一的公網 IP 位址**。

*   **NAT 路由器核心三步驟**：
    1.  **替換源**（Outgoing）：改寫封包中的私網 \`(Source IP, Source Port)\` -> \`(Public IP, NAT Assigned Port)\`。
    2.  **填寫表**（Translation Table）：將映射規則存入 **NAT Translation Table**：
        $$\\text{Map: (10.0.0.1, 3345) } \\longleftrightarrow \\text{ (138.76.29.7, 5001)}$$
    3.  **替換目**（Incoming）：當公網伺服器回覆封包抵達公網接口時，NAT 查表，將目的公網 IP 與埠號改寫回原本對應的內網私有 IP 與埠。

### NAT 的優點
1.  **節省公網地址資源**：一整座辦公大樓只需 1 個世界 IP 的開口。
2.  **加強安全性**：外部公網無法在未建立映射前，主動向內網機器發起直接連線（保護內網主機隱私）。
3.  **靈活性**：內網隨意更換內部主機設備，不需向外網重新申請註冊 IP。

### 爭議點
*   **違反端到端原則（End-to-End Argument）**：路由器本不該觸碰 Layer 4 傳送層的埠號（Port），這造成網路分層概念的污染混雜。

### NAT 穿透（NAT Traversal）與 Port Forwarding
當外網主機 A 想主動連接內網主機 B（如架設網遊伺服器）時，會因 NAT Table 查無對應項而被丟包，此時有兩種解決手段：
1.  **靜態孔道設定 / 埠口對應（Port Forwarding）**：在 NAT 路由器上手動鎖定：只要外界連到公網 Port 8888，一律主動轉交給內網 \`192.168.1.100:80\`。
2.  **UPnP 技術**：允許主機上的程序動態、自動通知 NAT 路由器，為其在 NAT 表中打通動態埠口轉向。`
      },
      {
        id: "ch4-ipv6",
        title: "8. IPv6 Feature & Tunneling: 轉移隧道技術",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### IPv6 設計重點
*   **128位元超大位址空間**（共提供 $2^{128}$ 個位址，免去 NAT 緊箍咒）。
*   **40位組固定長度首部（Fixed-length 40-byte Header）**：捨棄了不常使用的欄位（如 Checksum、Fragmentation 欄位），加速硬體路由器進行轉發。
*   **各主要欄位定義**：
    *   **流量類別（Traffic Class）**：8位元。類似 IPv4 TOS，用以實行優先權分流限制。
    *   **流標籤（Flow Label）**：20位元。將同一「流」上發出的封包打上一致標記，獲得專屬轉發待遇。
    *   **下一標頭（Next Header）**：8位元。指出承載 payload 的上層協定（如 TCP、UDP）或擴充標頭（Extension Header）的指引。
    *   **跳數限制（Hop Limit）**：8位元。同 IPv4 TTL。
*   **IPv6 與 IPv4 的核心對比變革**：
    *   **無 Checksum**：完全依賴端到端（L4 TCP/UDP、L2 Ethernet）進行校驗，大幅減輕路由器開銷，提高轉發吞吐量。
    *   **無路由器分片（No Router-side Fragmentation）**：路由器若發現封包太大而無法通過鏈路，直接棄置並發送 ICMP 向源主機反映，路由器自身絕不主動分片。

### 隧道技術（Tunneling）
當 IPv6 數據流在向目的地運送途中，必須橫跨不相容的「純 IPv4 骨幹網路」時：
> **隧道技術做法**：當 IPv6 封包準備穿越 IPv4 子網時，在邊界路由器上將**整個完整的 IPv6 封包當作普通資料載荷（Payload），封裝裝在一個標準的外層 IPv4 封包中**。外層 IPv4 封包的源 IP 與目的 IP 指向隧道的兩端。中間的 IPv4 路由器將其視為一般封包，原封不動送達隧道出口，在出口處剝除 IPv4 標頭，還原為原始的 IPv6 封包。`
      },
      {
        id: "ch4-openflow-generalized",
        title: "9. Generalized Forwarding / OpenFlow: 廣義轉發(Match+Action)",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### 廣義轉發 (Generalized Forwarding) 原理
傳統轉發僅看 Layer 3 目的 IP 來匹配出埠。
**廣義轉發／OpenFlow** 則採取 **Match-Action（匹配＋動作）** 架構，在每一台 OpenFlow 交換器內定義一組 **流表（Flow Table）**。

### Flow Table 的三個組成：
1.  **匹配欄位（Match Fields）**：可匹配多個層級封包的首部參數：
    *   *Layer 1 (物理)*：輸入埠。
    *   *Layer 2 (鏈路)*：Source/Destination MAC、Ethernet Type、VLAN Tag。
    *   *Layer 3 (網路)*：Source/Destination IP、IP Protocol。
    *   *Layer 4 (傳送)*：Source/Destination TCP/UDP Port。
2.  **動作（Actions）**：當匹配成功後，執行對應操作：
    *   **轉發（Forward）**：送往特定輸出埠。
    *   **丟棄（Drop）**：直接捨棄（可實行防火牆）。
    *   **修改（Modify）**：改寫 IP / Port 或 L2 標頭（可實行 NAT / 標記 VLAN）。
    *   **發送至控制器（Send to Controller）**：送交 SDN 控制處理。
3.  **統計數據（Counters）**：封包計數器與位元組計數器，用來作計費與監路。

### 多功能合一的 Match-Action
藉由配置不同的 Match-Action 表格，OpenFlow 還能替代各類專用設備：
*   **Router 作用**：Match L3 Dst IP, Action Forward.
*   **Switch 作用**：Match L2 Dst MAC, Action Forward/Flood.
*   **Firewall 作用**：Match 特定 L4 TCP Port, Action Drop.
*   **NAT 作用**：Match 特定 IP/Port, Action Modify fields & Forward.`
      },
      {
        id: "ch4-middleboxes",
        title: "10. Middleboxes & IP Hourglass: 中介設備與沙漏定律",
        isHighFreq: false,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### 什麼是 Middlebox？
**中介設備（Middlebox）**是指在 IP 數據報傳輸路徑中，除了標準 IP 常規路由器轉發外，還對封包資料流提供其他額外客製修改 and 流管處理的任何設備（硬體 or 虛擬機）：
*   **常見中介設備類型**：
    1.  **NAT**：進行 IP 首部 IP/Port 的雙向重寫。
    2.  **防火牆（Firewall）**：基於 ACL 策略進行封包匹配並過濾棄置。
    3.  **入侵檢測系統（IDS）**：進行封包特徵檢測與惡意流量攔截。
    4.  **負載平衡器（Load Balancer）**：代理並重定向多條伺服器流量。
    5.  **快取緩衝器（Cache）**：在本地代理儲存 HTTP 文件快取。

### End-to-End Argument (端到端論點)
*   **論點原意**：有些網路功能（例如：可靠傳輸、安全性功能）**只能在網路的兩個最終端點（End Hosts, Application level）上完成並得到完善保證**。在中介節點上試圖做完備處理是既多餘且昂貴的。
*   *與 Middlebox 的衝突*：NAT、Firewall 等 Middlebox 大量打破了端到端原則，在中途竄改甚至阻斷了封包，阻礙新協定的推行。

### IP Hourglass (IP 沙漏結構)
Internet 的核心結構被形容為一個「Hourglass」（沙漏，或稱 IP 鐘擺結構）：
*   **上層（Top）**：有無數種應用層協定（HTTP, DNS, SMTP, Skype...）。
*   **下層（Bottom）**：有無數種實體鏈路層協定（Ethernet, Wi-Fi, LTE, Optical...）。
*   **沙漏的中腰核心（Narrow Waist）**：**唯有 IP 協定**！所有上層、下層的銜接轉換都必須藉助且統一收斂到 IP，這正是 IP 能兼容世界、千變萬化、化繁為簡的根本性物理之美。`
      }
    ]
  },
  {
    id: ChapterId.CH5,
    title: "Chapter 5: Network Layer - Control Plane（網路層：控制平面）",
    concepts: [
      {
        id: "ch5-routing-basics",
        title: "1. Routing Protocols & Graph Abstraction: 路由與圖論抽象",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### 路由器的算路目標
將封包從源節點導向目的節點，並尋求一條**最精實、最快、最不塞車（Least Cost, Fastest, Least Congested）**的最佳路徑。

### 圖論抽象化（Graph Abstraction）
網路可用一個圖來表示：
$$G = (N, E)$$
*   $N$: 路由器（Nodes / 節點）的集合。
*   $E$: 物理鏈路（Edges / 邊）的集合。
*   $c_{a,b}$: 節點 $a$ 到節點 $b$ 之間的**鏈路代價（Link Cost）**。當兩者無物理相連，其代價定義為 $c_{a,b} = \\infty$。
*   物理代價計算通常與實體線路頻寬（如 10Gbps 頻寬的代價小於 100Mbps 線路）、或者實體經緯距離呈倒數關係。`
      },
      {
        id: "ch5-dijkstra",
        title: "2. Dijkstra’s Link-State Algorithm: 集中式算路與複雜度",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### 鏈路狀態路由演算法（Link-State Algorithm, LS）
*   **特點**：全域集中式（Centralized）。所有路由器透過**鏈路狀態廣播（Link-State Broadcast）**洪泛其鄰近代價，最終**全網每一台路由器都擁有完整的拓撲資訊（具有相同的一張 $G$ 圖）**。然後，在本地運作 Dijkstra 演算法計算最短路徑。

### Dijkstra 符號定義
*   $D(v)$：當前，從源節點（Source）出發到目的地節點 $v$ 的累加預估最小路徑代價。
*   $p(v)$：節點 $v$ 最短路徑的前驅（Parent / Predecessor）節點。
*   $N'$：已獲得確定性最小代價的節點子集合。
*   $c_{x,y}$：直接相鄰節點間的代價。

### 核心鬆弛公式（Relaxation）
挑出當前未移入 $N'$ 且擁有最小 $D(w)$ 的點 $w$，將其合圍移入 $N'$，然後立即更新其存活鄰居 $v$ 的路徑：
$$D(v) = \\min \\big( D(v), D(w) + c_{w,v} \\big)$$

### 演算法複雜度（Complexity）
1.  **時間複雜度**：
    *   直覺搜尋方式：每次循環遍历 $n$ 個點尋找最小，共遍歷 $n$ 次，複雜度為 $$O(n^2)$$。
    *   以二元堆積（Binary Heap / Priority Queue）優化查找：複雜度能進一步優化至：
        $$O((n+e) \\log n)$$（其中 $n$ 為節點數，$e$ 為鏈路邊數）。
2.  **訊息複雜度（Message Complexity）**：
    *   在洪泛廣播過程中，每個節點向其他所有節點發送宣告包，需要發送的控制封包量為：
        $$O(n \\times e)$$。

### 振盪問題（Oscillation Problem）
*   若 Link Cost 與「當前承載流量（Traffic Volume）」掛鉤，Dijkstra 會因為路徑回饋過於劇烈，導致全網流量在多條備選線路間來回切換、引發網路抖動。這稱為**路由振盪（Oscillation）**，通常藉由「不要讓代價與流量過分即時相關」來防範。`
      },
      {
        id: "ch5-bellman-ford",
        title: "3. Distance Vector & Bellman-Ford: 距離向量分散式演算法",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: true,
        contentMarkdown: `### 距離向量路由演算法（Distance-Vector Routing, DV）
*   **特點**：分散式（Distributed）、非同步（Asynchronous）、自發收斂的（Self-stopping）。每個節點只跟直接相鄰的鄰居交換自身的「預估距離向量」。

### Bellman-Ford 遞迴方程式（必考！）
設 $D_x(y)$ 為從特定節點 $x$ 出發前往遠端目的地 $y$ 的最小路徑代價預估。其公式為：
$$D_x(y) = \\min_v \\big\\{ c_{x,v} + D_v(y) \\big\\}$$
*   其中 $\\min$ 作用在與 $x$ 緊密直接相鄰的鄰居 $v$ 的集合之上。

### 致命漏洞與病理
*   **好消息傳得極快（Good news travels fast）**：當鏈路代價下降或修復，DV 網路能在極短時間、毫無代價地重新收斂。
*   **壞消息傳得極慢（Bad news travels slow）**：當鏈路發生嚴重惡化甚至完全斷開，會引發「**計數到無窮大問題（Count-to-Infinity Problem）**」。
*   *成因*：鄰居間彼此「聽說」對方有通往終點的路軌，在斷路一剎那互相递归套娃，累計推高成本，引發 **路由環路（Routing Loop）**。這會造成嚴重的**錯誤傳播（Error Propagation）**。
*   **毒性反轉（Poisoned Reverse）限制**：若 A 前往 Z 是經由 B 轉介，則 A 向 B 宣告自己有 $D_A(Z) = \\infty$。這防止了 B 在斷開時走回 A。但此招**僅能消滅「雙節點環」**的計數無窮，對 3 個以上節點組成的複雜環迴，毒性反轉依然束手無策。`
      },
      {
        id: "ch5-ls-vs-dv",
        title: "4. LS vs DV Comparison: 兩種路由抉擇矩陣對比",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### 全方位特性大比拼（期末高發簡答題！）

每一項指標均是學期末考試論述題的重點對象：

| 評測維度 | 鏈路狀態演算法（LS / OSPF） | 距離向量演算法（DV / Bellman-Ford） |
| :--- | :--- | :--- |
| **訊息複雜度** | **較高**。需將 LS 洪泛至全網。發送控制包複雜度為 $O(n \\times e)$。 | **僅與鄰居交換**。速度視收斂週期而定。 |
| **收斂速率** | **極快**。本地有一致地圖，直接跑 Dijkstra $O(n^2)$ 收斂。 | **較慢**。可能遭遇 Count-to-infinity 退化、無限迴圈。 |
| **健壯性（Robustness）** | **強**。路由器壞掉只會廣播壞掉埠，其他點算路避開，影響局部。 | **差**。一台錯誤配置的 DV 路由器會向全網廣播「錯誤前往目的之低代價」，引發**全網黑洞效應（Black-holing）**與**全網性錯誤路由擴散（Error Propagation）**。 |
| **振盪與環路** | **可能會有 Oscillation（若 Cost 與 Traffic 同意掛鉤）**，但無 persistent L2/L3 loops。 | **面臨嚴重的 Routing Loops** 與 Count-to-Infinity 退化。 |`
      },
      {
        id: "ch5-scalable-routing",
        title: "5. Scalable Routing: 自治系統 (AS) 階層設計",
        isHighFreq: false,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### 為什麼需要 Autonomous System（AS）？
若網際網路沒有區域阻隔、全網採用單一扁平的路由演算法：
1.  **表格大小爆炸**：骨幹路由表將塞入數十億個 IP 條目，記憶體和最長前綴匹配無法運行。
2.  **管理不一致**：不同企業、國家不願透露內部網絡結構，也不想被外國路由支配。

### 階層路由架構
網際網路將路由器群落劃分為多個**自治系統（Autonomous System, AS）**：
*   **域內路由（Intra-AS Routing）**：同一 AS 內部的路由器一律運行相同的路由協定（如 OSPF），各個 AS 的管理具有絕對自主權。
*   **域間路由（Inter-AS Routing）**：跨越不同 AS 之間的路由運作，全球統一使用 BGP。
*   **閘道器路由器（Gateway Router）**：位於 AS 的物理最邊緣，同時擁有一條 or 多條實體對外連線，負責與外接 AS 進行 BGP 握手通告，代表 AS 與世界溝通。
*   **政策、規模與效能取捨**：
    *   *Intra-AS*：追求最極致的**傳輸效能（Performance / Cost）**與速度。
    *   *Inter-AS*：在政策宣告（Policy）上寸土不讓，商業談判限制（安全、合約）高於純物理性能算路。`
      },
      {
        id: "ch5-ospf",
        title: "6. OSPF: 自治系統內最短路徑優先",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### OSPF 理論特性
**開放最短路徑優先協定（Open Shortest Path First）**：
*   **公有多項標準協定**：向全球開源透明，承載於 IP 段之上（協定號 89）。
*   **底層演算法**：使用集中式的**鏈路狀態協定（Link-State）**，全網洪泛 Link-State Advertisements (LSA)，並以 Dijkstra 繪製 SPF 最短路徑樹。
*   **多重度量值（Multiple Link Cost Metrics）**：鏈路代價可依管理員自定義：頻寬、實體跳數或延遲。
*   **安全認證（Authentication）**：防範非法機器冒用 OSPF LSA 汙染網路，封包含有密碼或 **MD5 數位簽名**。

### 階層式 OSPF（Hierarchical OSPF）
為了在中大型 AS 中實現高擴展度，OSPF 支援進一步將單一 AS 切為多層區域：
*   **骨幹區域（Backbone Area, Area 0）**：整網的中樞核心。所有局部區之間的流量，必須要親自走過骨幹區 Area 0 進行中轉。
*   **局部區域（Local Area）**：LS 洪泛僅限。這極大限制了 LSA 控制封包佔據不必要網段。
*   **關鍵路由器元件**：
    1.  **區域邊界路由器（Area Border Router, ABR）**：同時連通 Area 0 與局部 Area，負責將區域內的拓撲摘要、彙整併通宣告入骨幹。
    2.  **邊界路由器（Boundary Router / ASBR）**：連接其他外來 AS 協定。`
      },
      {
        id: "ch5-bgp",
        title: "7. BGP: 網際網路骨幹邊界網關協定 (TCP Port 179)",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### 網際網路的黏合劑
**邊界網關協定（Border Gateway Protocol, BGP）**是唯一事實上的域間路由標準。它採用**路徑向量協定（Path Vector Protocol）**。
*   **iBGP（Internal BGP）**：在同一個 AS 內部，對等傳播從外界學得的可達性與屬性前綴（Prefix）。
*   **eBGP（External BGP）**：在相鄰的不同自治系統邊界節點間交換可達路徑。
*   **傳輸層綁定**：BGP 鄰居（BGP Peers）建構於 **TCP Port 179** 上進行。

### BGP 四大訊息類型（Message Types）
1.  **OPEN**：建立 BGP 對等 TCP 連線並進行初始化認證。
2.  **UPDATE**：宣告新路由前綴，或者宣告**撤銷（Withdraw）**因斷線而不復存在的舊路由。
3.  **KEEPALIVE**：在無更新時維持連線活性（Keep Connection Alive）。
4.  **NOTIFICATION**：回報錯誤或主動關閉連線。

### 首部重要屬性與宣告（Attributes）
通告路由包含：'Prefix + Attributes'。其中關鍵屬性有：
*   **AS-PATH**：包含此則通告已經穿越的所有 AS 序號。若路由器收到其自己的 AS 號出現在 AS-PATH 中，**斷定有路由環路，直接捨棄！**
*   **NEXT-HOP**：指向下一個跨 AS 出口 IP 位址。

### 商業政策與宣告
*   **Import / Export Policy (匯入/匯出政策)**：管理員自行配置「我不願意為某競爭對手轉發數據」或「我這條路不能路徑公告給他」，是 BGP 的核心政策算路特色。

### BGP 路由選擇優先順序（必考高頻核心順序！）
當一台 BGP 路由器面對多條可前往相同前綴的目的路徑時，會嚴格按照以下優先級挑選最佳路（Best Route）：
1.  **局部優先度值（Local Preference Attribute）**：由 AS 管理設定，屬於純**政策層面（Policy Decision）**。數值越高越優。
2.  **最短的自治系統路徑（Shortest AS-PATH）**：跨越越少 AS 的路徑越好。
3.  **最近的 NEXT-HOP 路由器代價值**：這便會觸發**熱馬鈴薯路由（Hot Potato Routing）**！
4.  **其餘附加標準**：如 BGP 的 Router ID。

> **熱馬鈴薯路由（Hot Potato Routing）**：在 AS 內一秒也不想多承載封包，將其交給 AS 內 OSPF 代價最小的前往 NEXT-HOP 出口路徑。這不考慮出 AS 後的漫長跨海成本，只求降低本地 AS 內資源的消耗。`
      },
      {
        id: "ch5-icmp",
        title: "8. ICMP: 控制通報與 Traceroute 精妙運作",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### ICMP 協定功能
**網際網路控制訊息協定（Internet Control Message Protocol）**被主機和路由器用來傳遞網路層錯誤通報和診斷訊息。

*   **經典 Type碼 對比：**
    *   **Type 3, Code 0**：目的網路不可達（Destination Network Unreachable）。
    *   **Type 3, Code 1**：目的主機不可達（Destination Host Unreachable）。
    *   **Type 3, Code 3**：目的通訊埠不可達（Destination Port Unreachable，Traceroute 終點判定！）。
    *   **Type 11, Code 0**：在傳輸中 TTL 過期遞減至 0（TTL Expired in Transit）。
    *   **Type 8, Code 0**：Echo Request（即 Ping 請求發射）。
    *   **Type 0, Code 0**：Echo Reply（即 Ping 做出回應）。

### Traceroute（追蹤路由）運作機制
這是一段將 TTL 與 ICMP 玩轉到極致的藝術實作：
1.  發送端向目的主機發送一系列 UDP 封包，並故意**將外層 IP 標頭的 TTL 先設為 1**。
2.  當此封包穿過第一個三層路由器時，路由器將 TTL 遞減 1 變為 0。路由器依法**丟棄封包**並向源端傳回 **ICMP Type 11, Code 0（TTL過期）** 錯誤。
3.  發送端由此收悉並紀錄第一跳路由器的真實 IP 與其往返延時（RTT）。
4.  隨後發送端發送下一波 **TTL = 2** 封包，在第二跳發生過期，得到第二台路由器的 IP。
5.  重複上述動作直至抵達目的主機（TTL = 3, 4, ...）。
6.  **結束終止條件**：發送端發送 UDP 封包時，會對目的主機**故意指派一個不可能存在的超極高傳送層埠號（如 33434）**。當封包抵達目的主機時，由於主機是最終歸宿，不再因 TTL 過期報錯，而是發現本地「根本沒開這個 Port」，因而向源端發回 **ICMP Type 3, Code 3（目的通訊埠不可達）**。發送端主機抓到這個代碼，判定已大功告成，停止探查。`
      }
    ]
  },
  {
    id: ChapterId.CH6,
    title: "Chapter 6: Link Layer and LANs（鏈路層及區域網路）",
    concepts: [
      {
        id: "ch6-basics",
        title: "1. Link Layer Basics: 鏈路層基礎與網卡職責",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### 基礎名詞定義
為了精準理解 Chapter 6，必須搞懂底層的術語界定：
*   **節點（Node）**：任何連接在網路中、執行鏈路層協定的端主機及三層路由器。
*   **鏈路（Link）**：連接兩物理相鄰節點之間的物理通訊通道。
*   **訊框（Frame）**：鏈路層傳輸的最小基本協議數據單元（PDU），將 IP 數據報封裝在內。

### 鏈路層提供的服務
1.  **成幀（Framing）**：將 Layer 3 IP 數據報封裝在其訊框 Payload 中，加上 L2 訊框首部和尾部。
2.  **鏈路存取控制（Link Access）**：如果是共用多重進接頻道，需要協商解決何時可以發送。
3.  **相鄰節點間可靠傳輸（Reliable Delivery）**：藉由 ACK/NAK 和重傳，在相鄰的兩個實體物理端點間做到保證無誤傳遞，通常用在無線網等高出錯率鏈路。乙太網路等有線網路不提供 reliable delivery。
4.  **錯誤檢測（Error Detection）與 錯誤糾正（Error Correction）**：透過附加校驗位元檢測位元電磁干擾翻轉，甚至直接在本地修正復原。
5.  **半雙工與全雙工（Half & Full Duplex）**：
    *   *半雙工*：線路兩端主機皆能收發，但**同一時刻僅能有一個方向**發電訊，否則會碰撞。
    *   *全雙工*：兩端可於**同一時刻並行**收發，不發生碰撞。
*   **網路介面卡（NIC/網卡）**：鏈路層主要是在網卡硬體晶片內實現，部分韌體跑在 OS Driver 內。`
      },
      {
        id: "ch6-error",
        title: "2. EDC, 2D Parity, & CRC Algorithm: 兩大防錯校驗公式與手算",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### 1. 二維奇偶校驗（Two-Dimensional Parity）
在傳統單一奇偶校驗中，如果發生奇數個 bit 位元翻轉，能判定出錯，但無法定位。
*   **2D校驗做法**：將 $d$ 位元資料排列成行列矩陣。對**每一行**與**每一列**分別計算一個奇偶校驗位（Parity Bit）。
*   **錯誤定位與糾正**：當網路傳輸中僅發生了**單一位元（Single-bit）的錯誤翻轉**時，該翻轉位置對應的**行校驗與列校驗將會雙重報錯不吻合**。藉由該行列交叉的橫縱坐標，接收端能一秒精準抓住壞死 bit 的位置，並將其電壓直接取反還原（0 變 1, 1 變 0），**做到無重傳就地糾正（Error Correction）**。

---

### 2. 循環冗餘檢驗碼（Cyclic Redundancy Check, CRC）
這是乙太網路與 Wi-Fi 最核心的訊框防錯算法。

#### CRC 數學表達公式與變數定義
*   $D$: 原始長度為 $d$ 的二進位數據。
*   $G$: 系統約定的長度為 $r+1$ 位的生成多項式（Generator）。
*   $R$: 我們即將求算並拼接在 $D$ 後面的 $r$ 位元校驗餘數（Remainder）。
*   **公式表現**：
    $$\\langle D, R\\rangle = D \\cdot 2^r \\oplus R$$
    此合成數據必須可以**被 $G$ 在模二除法中整除（Remainder 為 0）**。

#### CRC 直式計算程序手算三部曲
$$R = \\text{remainder} \\Big[ \\frac{D \\cdot 2^r}{G} \\Big] \\pmod 2$$
1.  **補零**：將原始二進制數 $D$ 後面補上 $r$ 個 \`0\`（相當於 $D \\cdot 2^r$）。
2.  **模二長除法**：以 $G$ 為除數進行直式除法。每一步除算時，使用 **XOR（互斥或，不進位、不借位：\`1^1=0, 0^0=0, 1^0=1, 0^1=1\`）**。
3.  **獲取餘數**：長除法最後算出的最末 $r$ 位即為 $R$，將 $R$ 直接替換補上去那 $r$ 個 \`0\` 位置發送出去即可。

*手算演示可前往「手算動態模擬器」專區練習，秒懂除法退位規律。*`
      },
      {
        id: "ch6-multiple-access",
        title: "3. Multiple Access Protocols: 多重進接協議三大流派",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `物理廣播通道（Broadcast Link，如公用空中無線 Wi-Fi、粗同軸電纜）中，若多個節點同時傳送，會造成訊號混雜毀滅的**碰撞（Collision）**。
**MAC（Multiple Access Control）協定**旨在調度和化解衝突。理想的 MAC 協定在總頻寬為 $R$ bps 下應有：高負載下每人均分 $R/N$ 頻寬，而低負載單人能暴漲吃滿 $R$ bps，且協定應去中心化而無單極故障。

### 三大 MAC 協定家族
1.  **頻道劃分協定（Channel Partitioning Protocols）**：
    *   將頻道資源（時間、頻率、編碼）靜態切工。
    *   *缺點*：在低負載時若多數 Slot 閒置，會造成極大的頻寬閒置浪費（沒物盡其用）。
2.  **隨機存取協定（Random Access Protocols）**：
    *   全速不切分！當有封包時一律以 $R$ bps 飆速發送。碰上衝突時事後再檢測、指數避讓。
    *   *優點*：在低流量、低負載下效率極致。
3.  **輪流存取協定（Taking Turns Protocols）**：
    *   兼顧兩者，各用戶輪流享有專用權利。`
      },
      {
        id: "ch6-channel-partitioning",
        title: "4. Channel Partitioning: TDMA / FDMA / CDMA 與正交編碼",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### 1. TDMA（時分多重進接）
*   將時間切為 rounds，每個 round 進一步切為若干專屬 slots。
*   分配給特定用戶在對應 slot 獨家發售。

### 2. FDMA（頻分多重進接）
*   將整個實體頻道頻譜劃分為多個固定頻譜頻寬 of 子頻道。
*   各介面一直能發送，但只能在指派給它的子頻道頻段發送。

### 3. CDMA（碼分多重進接）
*   所有裝置**可在同一個時間、在同一個波段頻率**並行發送，不發生衝突！
*   **正交編碼（Chipping Sequence / Orthogonal Codes）**：
    *   為每個用戶分配一個特定的 $M$-bit 正交向量偏碼序列（Chipping code $c_i$）。
    *   接收端對混合的類比電壓信號進行向量**內積（Inner Product）**擴展。因為 $c_i$ 與 $c_j$ 正交（$c_i \\cdot c_j = 0$），接收端能完璧解讀出指定介面的信號，消解碰撞。常用於 3G 行動網。`
      },
      {
        id: "ch6-random-access",
        title: "5. Random Access: CSMA/CD 與 CSMA/CA 碰撞迴避規律",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### 1. CSMA（載波偵聽多重進接）
*   **先聽後送（Listen before transmit）**：發送訊框前先監聽頻道。
    *   若判定頻道空閒：立刻全速發射封包。
    *   若頻道忙碌：必須推遲等待。
*   **為什麼還會有碰撞？**：
    *   因為有**傳播延遲（Propagation Delay）**！A 剛送，訊號尚未通達 B 物理處，B 以為沒人發也發送了，兩波段在中途重疊發生碰撞。

### 2. CSMA/CD（碰撞檢測，有線網路乙太網專屬）
*   **一邊偵聽一邊發射（Collision Detection）**：
    *   如果在發射中偵聽到電壓值異常表明發生了物理**碰撞（Collision）**。
    *   **立刻停止發送**以挽救頻寬，並發送一串 **Jam Signal（擾塞訊號）** 通知全網避讓。
*   **二進位指數退避算法（Binary Exponential Backoff）**：
    *   碰撞終止後，需等待一個隨機時間。
    *   連續碰撞第 $m$ 次後工作站由下述集合隨機挑選出等待因子 $K$：
        $$K \\in \\big\\{\\, 0,\\, 1,\\, 2,\\, \\dots,\\, 2^{\\min(m, 10)} - 1 \\,\\big\\}$$
    *   計算獲得，裝置必須精確等待 **$K \\times 512$ 位元時間（Bit Times）**之後再度重新進接偵聽。隨著連續碰擊，集合呈幾何指數暴漲，能完美平滑塞車洪流。

### 3. CSMA/CA（碰撞避免，無線網 Wi-Fi 專屬）
*   **為什麼無線網不支援 CSMA/CD？**：
    *   因為**無法同時進行偵聽與發射（半雙工天線）**。
    *   且有**隱蔽站問題（Hidden Terminal Problem）**：A 與 C 在一牆兩隔，皆與 AP 通信，兩者無法直接聽到彼此，故無從檢測碰撞。
*   **解決機制**：使用 CSMA/CA，透過預先申請 **RTS（Request to Send）與 CTS（Clear to Send）** 完成。`
      },
      {
        id: "ch6-arp",
        title: "6. ARP: 地址解析協定與跨網段封包傳遞全流向",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### 網路界兩大定址體系
*   **IP 位址（32-bit / 128-bit）**：**邏輯定址、階層化結構**。無可攜性（插上不同 Subnet，IP 保證更變）。負責網路層**端到端（End-to-End）**路算。
*   **MAC 位址（48-bit）**：**平面型結構（Flat）**。出廠固化在 ROM 中具有**永久可攜性**。負責局域網段內**相鄰單一 HOP** 傳遞。

### ARP（地址解析協定）
將局域網內指定的 Layer 3 IP 轉換為 Layer 2 的物理 MAC 碼。
*   **ARP 表（ARP Table）**：快取 $(IP, MAC, TTL)$ 映射項目。

### ARP 查詢兩大步：
1.  **ARP Request（廣播發送）**：本機查無 Dst MAC，向當前子網發射 \`FF-FF-FF-FF-FF-FF\` 廣播訊框，吼問：「誰是 IP x.x.x.x？請把你的 MAC 報上來！」
2.  **ARP Reply（單播回應）**：目標在子網內收悉，單步發送單播訊框告訴發起方自家的實體 MAC。

---

### 期末經典不敗必考大題：A 經由 R 傳送到 B 跨網段全動態
> **題目場景**：Host A 在網段 1（MAC_A, IP_A），Router R 有面向網段 1 的介面 R1 (MAC_R1, IP_R1) 與面向網段 2 的介面 R2 (MAC_R2, IP_R2)，Host B 在網段 2（MAC_B, IP_B）。A 發送封包給 B。

#### 封包及首部長度代換規律：
1.  **起跑階段 (Subnet 1)**：
    *   A 判定目的 IP_B 與自己不同子網，故下一跳為預設閘道器 IP_R1。
    *   A 查找底層 ARP，獲取 IP_R1 的 MAC_R1。
    *   訊框封裝：
        *   **Layer 3 IP Datagram**：\`Source IP = IP_A\`（端端端保持不變），\`Destination IP = IP_B\`（不曾改變）。
        *   **Layer 2 Ethernet Header**：\`Source MAC = MAC_A\`，\`Destination MAC = MAC_R1\`。
2.  **路由器 R 介面 R1 捕獲**：
    *   R1 扒去 L2，讀取 L3 IP_B，在自家對應 L3 轉發表中匹配。
    *   最長前綴匹配（LPM）判定下行出口為 R2 埠。R2 調用 Subnet 2 的 ARP 表，查得 IP_B 的 MAC_B。
3.  **重新封裝出閘 (Subnet 2)**：
    *   此時包上**全新**的 Layer 2 首部：
        *   **Layer 3 IP Datagram**：保持一致，\`Source IP = IP_A\`，\`Destination IP = IP_B\`（NAT 以外保持不變）。
        *   **Layer 2 Ethernet Header**：\`Source MAC = MAC_R2\`，\`Destination MAC = MAC_B\`！
4.  **Host B 接收**：MAC_B 匹配，解裝拆箱送上層。
*   **終極真理**：**IP地址全程雷打不動，MAC位址每一跳（Hop-by-hop）都在路由器處慘遭扒除重封變更！**`
      },
      {
        id: "ch6-ethernet",
        title: "7. Ethernet Frame: 乙太網路結構特性",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### 乙太網路（Ethernet）
現代最主宰的有線內部區域網路技術。

### 乙太網路訊框結構 (Ethernet Frame)
標準 802.3 乙太網路訊框首尾含有：
1.  **前導碼（Preamble）**：8節組（7 bytes 為 \`10101010\` 交錯，最末 1 byte 為 \`10101011\`）。用作接收端進行發送端與接收端的**時鐘同步（Clock Synchronization）**。
2.  **目的 MAC 位址（Destination MAC）**：6節組（48位元）。
3.  **來源 MAC 位址（Source MAC）**：6節組（48位元）。
4.  **類型（Type Field）**：2節組。指出承載的 L3 協定類型（例如 \`0x0800\` 代表 IPv4），方便接收端進行解交織分流（Demultiplexing）。
5.  **資料（Data / Payload）**：承載 IP 數據報，一般有有線網路 MTU 下限 $46$ 節組與上限 $1500$ 節組要求。
6.  **循環冗餘檢驗（CRC）**：4節組，位於接收端校驗幀尾。

### 乙太網通訊風格三大定性
*   **無連接的（Connectionless）**：發送端與接收端網卡間，沒有任何握手起跑協定。想發直接發。
*   **不可靠的（Unreliable）**：網卡**不提供任何 ACK 或者是 NAK 回執**！若 CRC 判定出錯，直接丟棄。重傳的工作完全交給上層傳送層 **TCP 的重傳機制** 或者是應用層客製，L2 概不負責！
*   **多重存取控制**：使用隨機存取 **CSMA/CD with Exponential Backoff**。`
      },
      {
        id: "ch6-switch",
        title: "8. Switch: Layer 2 交換器自學原理與對比",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### Layer 2 開關設備
**交換器（Switch）**是完全運行在 **Layer 2** 的透明中轉設備。

### 核心運作規律
*   **儲存後轉發（Store-and-Forward）**：完整接完一個訊框，檢查 CRC 判定無出錯，方能轉發出去。
*   **透明（Transparent）**：主機完全不知道交換器的存在，把封包當直達發送。
*   **插拔即用（Plug-and-Play）**：不需要管理員配寫任何路由，拿來就用。

### 核心自學機制（Self-Learning）
交換器內裝有一張 **Switch Table**，用以記錄：\`(MAC Address, Interface, Timestamp)\`：
*   **自學原理**：每當交換器從物理介面 $x$ 收到一個訊框：
    1.  交換器立刻去讀取訊框中的 **來源 MAC 地址（Source MAC）**。
    2.  將該「MAC 位址 與 介面 $x$ 及 當前時間戳」存入或更新至 Switch Table。
*   **轉發抉擇流（Filtering & Forwarding）**：當交換器收到訊框要往其 **目的 MAC（Destination MAC）** 發送時，立即查表：
    1.  **若目的 MAC 在表，且記載介面就是 input 埠**：直接**過濾過濾丟棄**（目的地就在這，沒理由發出去）。
    2.  **若目的 MAC 在表，且記載介面是另一個埠 $y$**：精準將訊框**單播（Unicast）**從 $y$ 介面扔出去。
    3.  **若目的 MAC 完全查無**：進行**氾洪（Flooding）**防丟包，向除 input 之外的所有其他介面全部複製發送一份！

### 高頻考點：Switch vs Hub vs Router 對比
*   **集線器 (Hub)**：物理層（L1）設備。無視 MAC、無視 IP。從一埠流入的電壓訊號，原樣複製放大給所有其他埠。面臨極其嚴重的碰撞。
*   **交換器 (Switch)**：L2 設備，看 MAC 地址，支持全雙工、各自埠口獨霸碰撞網域，不會發生碰撞。
*   **路由器 (Router)**：L3 設備，看 IP 標頭，負責隔離廣播域與計算法則。`
      },
      {
        id: "ch6-vlan",
        title: "9. VLAN: 虛擬區域網路與 802.1Q 幹線標記",
        isHighFreq: true,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### VLAN 產生的痛點背景
在傳統乙太網路中，全交換器同屬單一廣播域，ARP Request 氾洪、安全隱私洩漏是老大難問題。
**虛擬區域網路（Virtual LAN, VLAN）**藉由一塊物理開關板子，在軟體定義上切分出多個邏輯廣播域。

### 類型與流控
*   **連接埠型 VLAN（Port-based VLAN）**：例如：設定網口 $1 \\sim 8$ 劃歸給 CS 科系，網口 $9 \\sim 16$ 劃歸 EE 科系。CS 內部的 ARP 廣播訊框，交換器在硬體上嚴禁其流竄到 EE 埠口。
*   **跨越 VLAN 通訊**：CS 與 EE 若強烈想通訊，**必須要穿插一個 Layer 3 設備（路由器或三層交換器）**，如同跨網段那樣，剥去 L2、走三層算路轉載才能送達！

### 幹線埠（Trunk Port）與 802.1Q 信道
若有台實體交換器 A、B，各自設備均有 CS、EE 自訂 VLAN：
*   A 與 B 之間如果各拉一根線接 CS、接 EE，線路會造成極大耗損浪費。
*   解決方案：在兩台交換器間留出一條特定共享實體線路，稱為 **幹線鏈路接口（Trunk Port）**。它可同時承載所有不同 VLAN 的封包。
*   **IEEE 802.1Q 幀結構**：
    *   為了解決跨實體交換機後，對方仍能識別訊框應屬於哪一個 VLAN，Trunk 出閘時，會在 DataFrame 發送中，**強插上一個 4-byte Tag 標籤首部**。
    *   此 Tag 中含有一個 **12-bit 的 VLAN ID（VLAN Identifier）**，可支持 $4096$ 個子 VLAN 標記。
    *   抵達對方開關入埠分流時，由硬體晶片**剝除 Tag 標籤**還原，再派發給指定 Port 上的主機。此過程對 Client 端是完美的隱藏、高度透明。`
      },
      {
        id: "ch6-datacenter",
        title: "10. Datacenter Networks: 資料中心 bento 網路互連",
        isHighFreq: false,
        isMustKnow: true,
        isWarning: false,
        contentMarkdown: `### 內部拓撲架構
現代資料中心網路（Datacenter Network）包含了成千上萬個伺服器（Blade hosts），需要極高的吞吐量和冗餘：
*   **伺服器機櫃（Server Racks）**：每一機櫃插入數十台伺服器。
*   **櫃頂交換器（Top of Rack Switch, TOR Switch）**：掛在每一機櫃頂部，連接所有內部伺服器板。
*   **多級開關階層（Tier-2 & Tier-1 Switches）**：
    *   櫃頂交換器向上接入多台 **Tier-2 交換器**。
    *   Tier-2 再向上匯聚至 **Tier-1 核心骨幹交換器** 與 **邊界路由器（Border Routers）**，進而連向網際網路骨幹。

### 資料中心三大應戰神兵
1.  **多路徑轉發（Multipath Forwarding）**：
    *   在 Tier-2、Tier-1、TOR 交換器之間放置多個對稱的備份物理互連開關。
    *   當其中一條線路滿了或損壞，流量可自動流向其他的通路。這可消除單一實體故障。
2.  **負載平衡器（Load Balancer / L7 Switch）**：
    *   對外暴露單一公網 IP 虛名，遮擋內部各台主機 IP。
    *   將外界成千上萬的連線，透過客製指派（Application layer requests），代理配送到當前內部資源充裕的某個物理伺服器。
3.  **高通量高可靠（High Throughput & Reliability）**。`
      }
    ]
  }
];

export const EXAM_SCOPE_INFO = {
  date: "2026 年 6 月 9 日（6/9）14:10 – 17:00",
  scope: [
    "Chapter 4 Network Layer: Data Plane (資料平面)",
    "Chapter 5 Network Layer: Control Plane (控制平面，僅至 Slide Page 72 之前！)",
    "Chapter 6 Link Layer and LANs (連結層與區域網路)",
    "涵蓋至 6/2 所有課堂材料、HW2、課本內容與 past paper"
  ],
  excluded: [
    "Chapter 5 page 72 之後內容（SDN 控制平面、網路管理、組態等）今年不列入必考考題！",
    "考古題中的「SDN control plane」其特定實作與訊息交換格式在今年可跳過不做。",
    "Homework 3（網路層控制平面後半與其延伸）不在考試內。"
  ],
  format: "10 題手寫簡答題（Short-Answer Questions） ＋ 10 題單選選擇題（Multiple-Choice Questions）"
};
