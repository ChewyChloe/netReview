import { ChapterData, ChapterId } from "../types";

export const ch5Data: ChapterData = {
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
* $N$: 路由器（Nodes / 節點）的集合。
* $E$: 物理鏈路（Edges / 邊）的集合。
* $c_{a,b}$: 節點 $a$ 到節點 $b$ 之間的**鏈路代價（Link Cost）**。當兩者無物理相連，其代價定義為 $c_{a,b} = \\infty$。

### 💯 100分申論題答題模板（手寫專用）
在網路層的控制平面中，路由算路的核心基礎是將真實的網路拓撲進行「圖論抽象化（Graph Abstraction）」。我們將全網表示為一個圖 $G = (N, E)$，其中節點集合 $N$ 代表所有參與算路的路由器，而邊集合 $E$ 則代表連接相鄰路由器的實體鏈路。每條實體鏈路都會被賦予一個「鏈路代價（Link Cost，表示為 $c$）」，這個代價通常與實體線路的頻寬呈反比，或與延遲時間呈正比。若兩節點未直接相連，其代價則標記為無限大。路由演算法（如 Dijkstra 或 Bellman-Ford）的核心任務，就是在這個抽象圖上，為任意一對源節點與目的節點，計算出一條「總代價最小（Least Cost）」的端到端最佳路徑，以此作為建立轉發表的數學依據。

### ✍️ 老師眼中的奪分關鍵（背誦提示）
* **圖論三大元素**：節點（Router）、邊（Link）、代價（Cost/頻寬或延遲）。
* **無連線的定義**：代價為無限大（$\\infty$）。
* **終極目標**：尋求端到端累加代價最小的最佳路徑。`
    },
    {
      id: "ch5-dijkstra",
      title: "2. Dijkstra’s Link-State Algorithm: 集中式算路與複雜度",
      isHighFreq: true,
      isMustKnow: true,
      isWarning: false,
      contentMarkdown: `### 鏈路狀態路由演算法（Link-State Algorithm, LS）
* **特點**：全域集中式（Centralized）。所有路由器透過**鏈路狀態廣播（Link-State Broadcast）**洪泛其鄰近代價，最終**全網每一台路由器都擁有完整的拓撲資訊（具有相同的一張 $G$ 圖）**。

### 核心鬆弛公式（Relaxation）
挑出當前未移入 $N'$ 且擁有最小 $D(w)$ 的點 $w$，將其合圍移入 $N'$，然後立即更新其存活鄰居 $v$ 的路徑：
$$D(v) = \\min \\big( D(v), D(w) + c_{w,v} \\big)$$

### 💯 100分申論題答題模板（手寫專用）
鏈路狀態（Link-State, LS）演算法（經典實作為 Dijkstra 演算法）是一種「集中式」的路由計算機制。其運作核心在於，網路中的每一台路由器都會主動向全網進行「鏈路狀態洪泛廣播（Broadcast）」，宣告自己與相鄰節點的連線代價。當洪泛完成後，全網每一台路由器都會建構出一張完全一致的全域網路拓撲圖。接著，每台路由器會在本地獨立運行 Dijkstra 演算法，透過反覆迭代的「鬆弛（Relaxation）」公式，逐步將最短路徑確定的節點納入集合中，最終生成一棵以自己為根節點的最短路徑樹。其基礎時間複雜度為 $O(n^2)$，若使用優先佇列優化可達 $O((n+e) \\log n)$。然而，若將鏈路代價與即時流量掛鉤，LS 演算法容易引發嚴重的「路由振盪（Oscillation）」問題，導致流量在多條路徑間劇烈切換。

### ✍️ 老師眼中的奪分關鍵（背誦提示）
* **集中式與地圖**：靠洪泛廣播（Broadcast）讓大家擁有一模一樣的全局地圖。
* **數學複雜度**：務必寫出 $O(n^2)$ 或 $O((n+e) \\log n)$。
* **致命缺點**：如果 Cost 看流量，會引發路由振盪（Oscillation）。`
    },
    {
      id: "ch5-bellman-ford",
      title: "3. Distance Vector & Bellman-Ford: 距離向量分散式演算法",
      isHighFreq: true,
      isMustKnow: true,
      isWarning: true,
      contentMarkdown: `### 距離向量路由演算法（Distance-Vector Routing, DV）
* **特點**：分散式（Distributed）、非同步、自發收斂。每個節點只跟直接相鄰的鄰居交換「預估距離向量」。

### Bellman-Ford 遞迴方程式
$$D_x(y) = \\min_v \\big\\{ c_{x,v} + D_v(y) \\big\\}$$

### 💯 100分申論題答題模板（手寫專用）
距離向量（Distance-Vector, DV）演算法是基於 Bellman-Ford 方程式的一種「分散式與非同步」路由機制。與 LS 演算法不同，DV 路由器並不知道全網拓撲，它僅依賴與「直接相鄰的鄰居」交換距離向量（即抵達各目的地的預估代價）來進行更新。DV 演算法具有「好消息傳得快，壞消息傳得慢」的病理特徵：當網路發生斷線或代價暴增時，相鄰路由器可能會因為彼此引用對方過期的舊路由，導致代價在更新過程中無限遞增，此即著名的「計數到無窮大（Count-to-Infinity）」與路由環路問題。雖然實務上可透過「毒性反轉（Poisoned Reverse）」——即若 A 經由 B 前往目的，則 A 向 B 宣告該路徑代價為無限大——來解決雙節點間的環路，但對於三個以上節點所構成的複雜環路，毒性反轉依然無法徹底防範。

### ✍️ 老師眼中的奪分關鍵（背誦提示）
* **分散式特性**：不知道全貌，只能「聽鄰居說」（依賴 Bellman-Ford 方程式）。
* **致命缺陷（必考）**：Count-to-Infinity（計數到無窮大）與 Routing Loop（路由環路）。
* **解法與限制**：Poisoned Reverse（毒性反轉），但只能解 2 個節點的環。`
    },
    {
      id: "ch5-ls-vs-dv",
      title: "4. LS vs DV Comparison: 兩種路由抉擇矩陣對比",
      isHighFreq: true,
      isMustKnow: true,
      isWarning: false,
      contentMarkdown: `### 全方位特性大比拼（期末高發簡答題！）

| 評測維度 | 鏈路狀態演算法（LS / OSPF） | 距離向量演算法（DV / Bellman-Ford） |
| :--- | :--- | :--- |
| **訊息複雜度** | **較高**。需將 LS 洪泛至全網。發送控制包複雜度為 $O(n \\times e)$。 | **較低**。僅與鄰居交換。 |
| **收斂速率** | **極快**。本地有一致地圖，直接跑 Dijkstra $O(n^2)$ 收斂。 | **較慢**。可能遭遇 Count-to-infinity 退化。 |
| **健壯性（Robustness）** | **強**。路由器壞掉只會廣播壞掉埠，影響局部。 | **差**。錯誤路由會擴散全網（Error Propagation）。 |

### 💯 100分申論題答題模板（手寫專用）
在評估 LS 與 DV 兩種網路層路由演算法時，我們主要從訊息複雜度、收斂速度與網路健壯性三個維度進行對比。在「訊息複雜度」上，LS 需要向全網洪泛廣播（複雜度 $O(n \\times e)$），佔用較高頻寬；而 DV 僅與相鄰節點交換資訊，較為節省。在「收斂速度」上，LS 因具備全域地圖，能在本地瞬間執行 Dijkstra 演算法完成收斂，速度極快；反觀 DV 則需要多個週期的鄰居交換，且在鏈路故障時極易陷入「計數到無窮大」的無限迴圈，收斂緩慢。在「健壯性（Robustness）」方面，LS 具備極高的容錯能力，單一路由器的計算錯誤僅影響自身，不會拖垮全網；然而 DV 演算法存在嚴重的「錯誤傳播（Error Propagation）」漏洞，一台散佈錯誤低代價的故障路由器，會引發全網流量誤導（黑洞效應），因此 LS 的整體穩定性遠優於 DV。

### ✍️ 老師眼中的奪分關鍵（背誦提示）
* **比較題必寫三維度**：訊息量、速度、健壯性（容錯）。
* **誰比較穩？**：LS 穩（錯誤被隔離），DV 糟（錯誤會像病毒傳染給鄰居）。`
    },
    {
      id: "ch5-scalable-routing",
      title: "5. Scalable Routing: 自治系統 (AS) 階層設計",
      isHighFreq: true,
      isMustKnow: true,
      isWarning: false,
      contentMarkdown: `### 階層路由架構
網際網路將路由器群落劃分為多個**自治系統（Autonomous System, AS）**：
* **域內路由（Intra-AS Routing）**：如 OSPF。追求最極致的**傳輸效能**與速度。
* **域間路由（Inter-AS Routing）**：如 BGP。政策宣告（Policy）與商業利益高於效能。
* **閘道器路由器（Gateway Router）**：代表 AS 與世界溝通。

### 💯 100分申論題答題模板（手寫專用）
網際網路中的自治系統（Autonomous System，簡稱 AS）是指在全球網際網路架構下，由同一個單一行政實體所管轄、擁有相同路由政策的一組路由器與網路群落。網際網路之所以揚棄扁平化架構、改採 AS 的階層式設計，核心原因有二：第一是為了解決「規模擴展性」的硬體瓶頸，防止全球骨幹路由表因塞入數十億個 IP 條目而導致記憶體爆炸；第二是基於「管理獨立性與安全政策」的考量，不同企業不願透露內部真實網路拓撲，更需依據商業合約控制流量去向。在這種階層架構下，AS 內部運作「域內路由（Intra-AS Routing，如 OSPF）」，核心目標是追求最極致的傳輸效能與速度；而跨 AS 之間則運作「域間路由（Inter-AS Routing，如 BGP）」，其算路邏輯以商業談判與政策宣告為最高指導原則。最終，位於 AS 邊緣的「閘道器路由器」負責與外界進行 BGP 握手通告，完美實現了全球網路黏合與隱私隔離。

### ✍️ 老師眼中的奪分關鍵（背誦提示）
* **兩大痛點（為何需要）**：防止路由表爆炸（擴展性問題）與滿足管理隱私/商業政策。
* **域內（Intra-AS） vs 域間（Inter-AS）**：Intra 求物理性能（OSPF）；Inter 求商業政策（BGP）。`
    },
    {
      id: "ch5-ospf",
      title: "6. OSPF: 自治系統內最短路徑優先",
      isHighFreq: true,
      isMustKnow: true,
      isWarning: false,
      contentMarkdown: `### OSPF 理論特性
* **底層演算法**：使用集中式的**鏈路狀態協定（Link-State）**。
* **安全認證**：封包含有密碼或 **MD5 數位簽名**。
* **階層式設計**：支援劃分**骨幹區域（Backbone Area, Area 0）**與局部區域（Local Area）。

### 💯 100分申論題答題模板（手寫專用）
開放最短路徑優先（OSPF）是目前最主流的域內路由協定（Intra-AS Routing），其底層採用「鏈路狀態（Link-State）」演算法。在 OSPF 網路中，路由器會全網洪泛鏈路狀態通告（LSA），使所有節點獲得一致的地圖，並使用 Dijkstra 演算法計算最短路徑。為了在大規模企業網路中實現極高的可擴展性，OSPF 導入了「階層式架構（Hierarchical Design）」，將單一 AS 進一步劃分為「骨幹區域（Area 0）」與多個「局部區域」。在此架構下，LSA 的洪泛被嚴格限制在局部區域內，大幅降低了不必要的控制流量；而跨區域的通訊則必須強制經過「區域邊界路由器（ABR）」轉交給 Area 0 進行中轉。此外，OSPF 內建了嚴格的 MD5 安全認證機制，有效防範了惡意節點注入假路由的網路攻擊，確保了控制平面的穩定與安全。

### ✍️ 老師眼中的奪分關鍵（背誦提示）
* **演算法基底**：OSPF 骨子裡就是 Link-State (Dijkstra)。
* **階層優化設計**：考卷必提「Area 0 骨幹」與限制洪泛範圍。
* **安全性**：內建 MD5 認證機制防偽造。`
    },
    {
      id: "ch5-bgp",
      title: "7. BGP: 網際網路骨幹邊界網關協定 (TCP Port 179)",
      isHighFreq: true,
      isMustKnow: true,
      isWarning: false,
      contentMarkdown: `### 網際網路的黏合劑
採用**路徑向量協定（Path Vector Protocol）**。分為 iBGP 與 eBGP。建構於 **TCP Port 179** 上。
* **兩大屬性**：
  * **AS-PATH**：包含穿越的 AS 序號（用於防環）。
  * **NEXT-HOP**：指向下一個跨 AS 出口 IP。

### 💯 100分申論題答題模板（手寫專用）
邊界網關協定（BGP）是網際網路中唯一事實上的「域間路由協定（Inter-AS Routing）」，被譽為將全球網路黏合在一起的膠水。BGP 運作於 TCP Port 179 之上，屬於「路徑向量協定（Path Vector Protocol）」。BGP 路由通告中最核心的兩個屬性為 AS-PATH 與 NEXT-HOP：AS-PATH 記錄了該路由前綴所跨越的所有自治系統編號，路由器藉由檢查自己的 AS 號是否已存在於該列表中，完美實現了「路由防環（Loop Prevention）」；而 NEXT-HOP 則指示了離開當前 AS 的確切邊界閘道器 IP。值得強調的是，BGP 的算路核心並非追求物理最短路徑，而是高度依賴「商業政策（Import/Export Policy）」。當面臨多條等價路徑時，BGP 會優先比較人為設定的「局部優先度（Local Preference）」，若皆相同，則會觸發「熱馬鈴薯路由（Hot Potato Routing）」機制，以最快、代價最小的方式將封包踢出自家 AS，以節省內部網路資源。

### ✍️ 老師眼中的奪分關鍵（背誦提示）
* **協定類型與 Port**：Path Vector，跑在可靠的 TCP 179。
* **防環機制**：靠 AS-PATH 屬性，看到自己的名字就丟掉。
* **熱馬鈴薯（Hot Potato）**：內部不想負擔流量，用最快/Cost最低的路徑把封包踢出自家 AS。`
    },
    {
      id: "ch5-icmp",
      title: "8. ICMP: 控制通報與 Traceroute 精妙運作",
      isHighFreq: true,
      isMustKnow: true,
      isWarning: false,
      contentMarkdown: `### ICMP 協定功能
被主機和路由器用來傳遞網路層錯誤通報和診斷。

### Traceroute（追蹤路由）運作機制
利用遞增 TTL 與特定 ICMP 報錯碼探測路徑。

### 💯 100分申論題答題模板（手寫專用）
網際網路控制訊息協定（ICMP）是網路層中負責錯誤通報與網路診斷的關鍵協定，其最精妙的應用體現於 Traceroute（追蹤路由）的實作機制。Traceroute 巧妙地利用了 IP 標頭中的「存活時間（TTL）」欄位與 ICMP 報錯來繪製封包軌跡：發送端首先送出 TTL=1 的 UDP 探測封包，第一跳路由器收到後將 TTL 減至 0，依規丟棄封包並回傳 ICMP Type 11 (TTL Expired) 錯誤，發送端藉此獲得第一跳路由器的 IP 與延遲；接著發送端遞增發送 TTL=2、TTL=3 的封包，逐步揭露沿途所有節點。為了判斷何時抵達最終目的地，發送端會故意將封包導向一個「極高且不存在的 UDP Port號（如 33434）」，當目的主機收到封包且無對應服務時，會向源端回傳 ICMP Type 3, Code 3 (Destination Port Unreachable)。發送端一旦收到此特定錯誤碼，便判定已成功抵達終點，完美終止探測過程。

### ✍️ 老師眼中的奪分關鍵（背誦提示）
* **TTL 遞增探索**：從 TTL=1 開始，利用路由器過期回傳的 ICMP Type 11 (TTL Expired) 沿途做記號。
* **終止探測的巧妙機關**：故意打一個沒開的 Port，逼迫最終主機回傳 Type 3 Code 3 (Port Unreachable)，以此判定結束。`
    }
  ]
};