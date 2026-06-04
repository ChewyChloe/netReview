import { Question, ChapterId, QuestionType, Difficulty } from "../types";

export const QUIZ_BANK: Question[] = [
  // ==================== CHAPTER 4 (21 Questions: q1 ~ q21) ====================
  {
    id: "q1",
    chapter: ChapterId.CH4,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "Data Plane vs Control Plane",
    questionText: "What is the primary difference in function and execution location between the Data Plane and the Control Plane?",
    options: [
      "(A) Data plane is local and handles routing; Control plane is network-wide and handles forwarding",
      "(B) Data plane is local and handles forwarding; Control plane is network-wide and handles routing",
      "(C) Data plane runs in the central switch; Control plane runs in the edge interfaces",
      "(D) Both planes perform same operations but data plane uses software and control plane uses hardware"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "資料平面（Data Plane）執行本地的轉發，控制平面（Control Plane）執行全網的路由。",
      reviewRef: "對應複習重點：投影片 Ch4 Page 4 'Data vs Control Plane'。\n- Forwarding: local, nanosecond scale, hardware-based.\n- Routing: network-wide, millisecond scale, software-based.",
      optionsAnalysis: {
        "A": "錯誤，字眼完全反轉錯置。",
        "B": "正確，資料平面是 local 轉發（Forwarding），控制平面是 network-wide 路由（Routing）。",
        "C": "錯誤，資料平面是在路由器內部，而控制平面分布或集中於控制器。",
        "D": "錯誤，資料平面使用硬體晶片（ASIC）加速，控制平面則使用軟體計算。"
      }
    }
  },
  {
    id: "q2",
    chapter: ChapterId.CH4,
    type: QuestionType.SHORT,
    difficulty: Difficulty.MEDIUM,
    topic: "Forwarding vs Routing",
    questionText: "Explain the difference between forwarding and routing using a clear road trip analogy.",
    correctAnswer: "Forwarding is like taking a single exit; Routing is like planning the whole trip.",
    explanation: {
      concept: "轉發（Forwarding）與路由（Routing）的本質動作對策。",
      reviewRef: "轉發（Forwarding）是本地查表轉移封包的單一動作，路由（Routing）則是全網路路徑規劃的全盤思維。",
      perfectTemplate: "【100分答題模板】\n1. **轉發 (Forwarding)**: 類似車輛通過單一十字路口。路由器根据本地表將封包從輸入埠移動到對應輸出埠。屬於 Local / Hardware 級動作。\n2. **路由 (Routing)**: 類似旅遊前规划整趟地圖與省道。決定封包從源端抵達終端所經過的整條鏈路途徑。屬於 Global / Software 級規劃。\n- **關鍵字**: Local Action, Network-wide Path, Hardware, Software."
    }
  },
  {
    id: "q3",
    chapter: ChapterId.CH4,
    type: QuestionType.MCQ,
    difficulty: Difficulty.EASY,
    topic: "Best-effort service model",
    questionText: "Which of the following guarantees is provided by the Internet's IP Best-Effort service model?",
    options: [
      "(A) Guarantees packet delivery order",
      "(B) Guarantees bandwidth reservations",
      "(C) Guarantees maximum transfer latency",
      "(D) No guarantees are provided for delivery, order, or bandwidth"
    ],
    correctAnswer: "D",
    explanation: {
      concept: "網際網路 IP 盡力而為（Best-Effort）服務模型無任何承諾保證之現實。",
      reviewRef: "對應複習重點：Ch4 Page 12 'IP Service Model'。Best-effort 代表不保證成功抵達、不保證時延、不保證頻寬、不保證順序。",
      optionsAnalysis: {
        "A": "錯誤，IP 層不保證順序，可能發生亂序。",
        "B": "錯誤，IP 不提供頻寬保留（這屬於虛卡線路或 QoS 機制）。",
        "C": "錯誤，時延無上限限制，可能有極大時延抖動。",
        "D": "正確，盡力而為代表沒有任何具體交付、順序或頻寬的硬件保證。"
      }
    }
  },
  {
    id: "q4",
    chapter: ChapterId.CH4,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "Router Architecture Ports",
    questionText: "At which component of a router is the decentralized lookup and lookup-based forwarding table matching typically executed to achieve line-speed?",
    options: [
      "(A) Routing Processor",
      "(B) Input Ports",
      "(C) Output Ports",
      "(D) Switching Fabric"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "路由器在輸入埠（Input Ports）本地實施去中心化最長匹配以達成線路速度傳輸。",
      reviewRef: "對應複習：Ch4 'Input Port Processing'。為了保障超高線速，會將轉發表複製到每個 Input Port 進行快速本地 LPM 查表，避免 CPU 單點樽頸。",
      optionsAnalysis: {
        "A": "錯誤，路由處理器（CPU）僅負責控制協定與建表，不參與主線查表。",
        "B": "正確，輸入埠（Input Port）本地進行快速最長前綴查找（Decentralized Lookup）。",
        "C": "錯誤，輸出埠主要執行 Buffer 管理與排程發送。",
        "D": "錯誤，交換結構僅執行搬移拷貝動作，不進行邏輯目的地查表。"
      }
    }
  },
  {
    id: "q5",
    chapter: ChapterId.CH4,
    type: QuestionType.MCQ,
    difficulty: Difficulty.HARD,
    topic: "Switching fabric",
    questionText: "Which switching fabric architecture avoids bus contention and allows multiple packets to be forwarded in parallel as long as they target different outputs?",
    options: [
      "(A) Switching via Memory",
      "(B) Switching via Bus",
      "(C) Switching via Interconnection Network (Crossbar)",
      "(D) Switching via Trunk Grouping"
    ],
    correctAnswer: "C",
    explanation: {
      concept: "交叉二維互連架構（Crossbar）的並行轉發排阻能力。",
      reviewRef: "對應複習：Ch4 Page 18 'Switching Fabrics'。Crossbar 藉由平行線接點閉合，實現去匯流排爭用的並行包傳輸。",
      optionsAnalysis: {
        "A": "錯誤，記憶體交換受限於共享記憶體匯流排讀寫次數瓶頸。",
        "B": "錯誤，Shared Bus 有匯流排競爭，一次僅容許單包穿行。",
        "C": "正確，互連網（Crossbar）能在不同目的地時，並行搬移多個封包。",
        "D": "錯誤，Trunk 是鏈路層的多條併合技術，非路由器交換結構項目。"
      }
    }
  },
  {
    id: "q6",
    chapter: ChapterId.CH4,
    type: QuestionType.SHORT,
    difficulty: Difficulty.MEDIUM,
    topic: "HOL blocking",
    questionText: "Define Head-of-the-Line (HOL) blocking in router inputs and identify its root cause.",
    correctAnswer: "A queued packet at the front blocks adjacent packets destined for free outputs.",
    explanation: {
      concept: "隊首阻塞（HOL Blocking）的定義與發生原因。",
      reviewRef: "對應複習：Ch4 Page 21 'Input Port Queueing'。輸入埠佇列中，隊首封包因目標輸出埠繁忙被堵，牽連塞在後方、本欲往空閒出口的封包前行。",
      perfectTemplate: "【100分答題模板】\n1. **定義**: 當輸入佇列最前面的封包（隊首封包）因為欲往的輸出埠忙碌而等待時，後方原本要去「空閒輸出埠」的封包也被其連帶擋住、無法前行的現象。\n2. **根源原因**: 交換結構速度慢於輸入總吞吐，或單個輸入埠共享同一個單一先入先出（FIFO）物理儲存佇列。\n- **關鍵字**: Head of Queue, Free Output, Blocked, Non-interlocking queue."
    }
  },
  {
    id: "q7",
    chapter: ChapterId.CH4,
    type: QuestionType.CALC,
    difficulty: Difficulty.MEDIUM,
    topic: "Buffering Formula",
    questionText: "A link has a capacity of C = 10 Gbps and a round-trip time RTT = 100 ms. According to the traditional rule of thumb, how much buffering capacity (in Megabits) is required at the output router port?",
    correctAnswer: "1000 Mb",
    explanation: {
      concept: "輸出埠緩衝容量傳統拇指計演算法 $B = RTT \\times C$。",
      reviewRef: "對應公式：Ch4 'How much buffering'。代入計算所得即可。",
      perfectTemplate: "【100分答題模板】\n1. **給定條件**: $C = 10\\text{ Gbps} = 10 \\times 10^9\\text{ bps}$， $RTT = 100\\text{ ms} = 0.1\\text{ s}$。\n2. **套用公式**: $B = RTT \\times C = 0.1\\text{ s} \\times 10 \\times 10^9\\text{ bps} = 1 \\times 10^9\\text{ bits}$。\n3. **單位換算**: $10^9\\text{ bits} = 1000\\text{ Megabits (Mb)}$。\n4. **最終答案**: 1000 Mb（若問 Byte 則是 125 MB）。"
    }
  },
  {
    id: "q8",
    chapter: ChapterId.CH4,
    type: QuestionType.CALC,
    difficulty: Difficulty.HARD,
    topic: "Buffer Size with Multiple Flows",
    questionText: "Assume a router link has capacity C = 40 Gbps and average RTT = 200 ms. If there are N = 100 independent TCP connections flowing through this link, what is the required buffer size B (in Megabits) using the decentralized scaling formula?",
    correctAnswer: "800 Mb",
    explanation: {
      concept: "多流共存下，輸出埠緩衝容量縮小估算法： $B = (RTT \\times C) / \\sqrt{N}$。",
      reviewRef: "對應文獻：Ch4 Page 23 'Buffering scaling with flows'。",
      perfectTemplate: "【100分答題模板】\n1. **已知條件**: $C = 40\\text{ Gbps} = 40,000\\text{ Mbps}$, $RTT = 0.2\\text{ s}$, $N = 100$。\n2. **使用公式**: $B = \\frac{RTT \\times C}{\\sqrt{N}}$。\n3. **計算過程**: \n   - 分子: $RTT \\times C = 0.2 \\times 40,000\\text{ Mbps} = 8,000\\text{ Mb}$。\n   - 分母: $\\sqrt{100} = 10$。\n   - $B = \\frac{8,000\\text{ Mb}}{10} = 800\\text{ Mb}$。\n4. **最終答案**: 800 Mb 元。"
    }
  },
  {
    id: "q9",
    chapter: ChapterId.CH4,
    type: QuestionType.CALC,
    difficulty: Difficulty.MEDIUM,
    topic: "Weighted Fair Queuing",
    questionText: "A router uses Weighted Fair Queuing (WFQ). Three sessions flow through the active output port with assigned weights: w1 = 4, w2 = 3, w3 = 1. If the outgoing link is fully saturated in a long run, calculate the percentage of bandwidth allocated to Session 2.",
    correctAnswer: "37.5%",
    explanation: {
      concept: "WFQ 頻寬劃分比例公式計算： $w_i / \\sum w_j$。",
      reviewRef: "對應複習：Ch4 Page 26 'Weighted Fair Queueing (WFQ)'。",
      perfectTemplate: "【100分答題模板】\n1. **已知條件**: 系統權重分別為 $w_1=4$, $w_2=3$, $w_3=1$。\n2. **使用公式**: $Session_2\\,\\text{Share} = \\frac{w_2}{w_1 + w_2 + w_3}$。\n3. **計算過程**: \n   - $\\sum w = 4 + 3 + 1 = 8$。\n   - 對應比例: $\\frac{3}{8} = 0.375 = 37.5\\%$。\n4. **最終答案**: 37.5% 的物理頻寬資源。"
    }
  },
  {
    id: "q10",
    chapter: ChapterId.CH4,
    type: QuestionType.MCQ,
    difficulty: Difficulty.EASY,
    topic: "IPv4 datagram fields",
    questionText: "Which IPv4 header field is modified by routers to prevent packets from looping endlessly in the network?",
    options: [
      "(A) Type of Service (TOS)",
      "(B) Identification",
      "(C) Time to Live (TTL)",
      "(D) Header Checksum"
    ],
    correctAnswer: "C",
    explanation: {
      concept: "存活時間（TTL）欄位防路由環路無窮迴圈的遞減原則。",
      reviewRef: "對應複習：Ch4 Page 31 'TTL'。封包每過一台路由器，其 TTL 會被強制減 1。歸 0 時被丟棄並回報 ICMP 訊息。",
      optionsAnalysis: {
        "A": "錯誤，TOS 用於排程與優先權處理（QoS）。",
        "B": "錯誤，ID 主要用於封包分割重組（Fragmentation）。",
        "C": "正確，TTL 會逐跳減 1，為防止封包死循環的底牌。",
        "D": "錯誤，Checksum 的確會相應重新計算，但它只是保護資料正確性的校驗，不是防環的核心控制字段。"
      }
    }
  },
  {
    id: "q11",
    chapter: ChapterId.CH4,
    type: QuestionType.CALC,
    difficulty: Difficulty.HARD,
    topic: "IP Fragmentation",
    questionText: "An IP datagram of 4000 bytes (including 20-byte IP header) arrives at a link with an MTU of 1500 bytes. How many fragments are created, and what are their respective payload lengths and offset values?",
    correctAnswer: "3 fragments. Lengths: 1480, 1480, 1020. Offsets: 0, 185, 370",
    explanation: {
      concept: "IP 分片計算：資料負載分割與 Offset 模八除算規定。",
      reviewRef: "對應複習：Ch4 'IP Fragmentation'。 每個小片的 payload 必須是 8 的倍數。標頭佔 20 Byte。",
      perfectTemplate: "【100分答題模板】\n1. **已知條件**: 總長 $4000\\text{ B}$ (20B 標頭, 3980B 資料), $MTU = 1500\\text{ B}$。每片含有自己的 20B 標頭，故最大數據負載長度 = $1480\\text{ B}$ ($1480$ 可被 8 整除)。\n2. **拆解計算**: \n   - **第一片**: 載荷 $1480\\text{ B}$ (總長 $1500\\text{ B}$)，offset = $0 / 8 = 0$, $MF = 1$。\n   - **第二片**: 載荷 $1480\\text{ B}$ (總長 $1500\\text{ B}$)，offset = $1480 / 8 = 185$, $MF = 1$。\n   - **第三片**: 剩餘載荷 = $3980 - 1480 - 1480 = 1020\\text{ B}$ (總長 $1040\\text{ B}$)，offset = $(1480+1480) / 8 = 370$, $MF = 0$。\n3. **最終答案**: 共有 3 個分片；長度（不含標頭載荷）各為 1480、1480、1020 bytes，Offset 各為 0, 185, 370。"
    }
  },
  {
    id: "q12",
    chapter: ChapterId.CH4,
    type: QuestionType.MCQ,
    difficulty: Difficulty.EASY,
    topic: "IP addressing Subnet",
    questionText: "An IP address is defined as 192.168.1.130/26. How many total usable host addresses can be assigned in this subnet?",
    options: [
      "(A) 64",
      "(B) 62",
      "(C) 30",
      "(D) 32"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "子網路可用主機位址數計算： $2^{32-x} - 2$ 。",
      reviewRef: "對應學理：Ch4 Page 42 'Subnets'。須扣除網段位址（Network address）與廣播位址（Broadcast address）。",
      optionsAnalysis: {
        "A": "錯誤，64 是該網段的總 IP 上限（含網路與廣播），非可用主機 IP 數。",
        "B": "正確， $2^{32-26} - 2 = 64 - 2 = 62$ 。",
        "C": "錯誤，這是 /27 網段對應的主機數。",
        "D": "錯誤，這是把總長計錯或未扣天地的結果。"
      }
    }
  },
  {
    id: "q13",
    chapter: ChapterId.CH4,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "CIDR Prefix",
    questionText: "Which of the following describes the core purpose of Classless Inter-Domain Routing (CIDR)?",
    options: [
      "(A) To allocate IP addresses strictly in blocks of 256, 65536, or 16777216 to avoid subnetting",
      "(B) To allow arbitrary link sizes of subnet masks, facilitating efficient routing table aggregation",
      "(C) To enforce encryption at the IP header before forwarding",
      "(D) To map public IP addresses to private networks automatically"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "無類別域間路由（CIDR）取消傳統分類、支援任意前綴長度以達成路由聚合的目的。",
      reviewRef: "對應：Ch4 Page 46 'CIDR'。利用前綴來表徵網路號，支援彈性分配。",
      optionsAnalysis: {
        "A": "錯誤，這是傳統 A/B/C 類分類（Classful）限制，CIDR 克服了它。",
        "B": "正確，CIDR 採用 `a.b.c.d/x` 前綴表達法，便於路由聚合（Route aggregation），緩解全網轉發表膨脹。",
        "C": "錯誤，加密屬於 IPSec 範疇，非 CIDR 職能。",
        "D": "錯誤，公私映射是 NAT 的功能。"
      }
    }
  },
  {
    id: "q14",
    chapter: ChapterId.CH4,
    type: QuestionType.CALC,
    difficulty: Difficulty.MEDIUM,
    topic: "Longest Prefix Matching",
    questionText: "Suppose a router has the following forwarding table entries:\n- 128.8.0.0/16 -> Link Interface 1\n- 128.8.64.0/20 -> Link Interface 2\n- 128.8.80.0/20 -> Link Interface 3\n- Default -> Link Interface 4\nTo which interface will a packet destined for 128.8.65.10 be forwarded?",
    correctAnswer: "Link Interface 2",
    explanation: {
      concept: "最長前綴匹配（LPM, Longest Prefix Matching）轉發決策。",
      reviewRef: "對應複習：Ch4 'Longest Prefix Matching'。比對目的位址之二進制二維前置位元匹配長度多寡。",
      perfectTemplate: "【100分答題模板】\n1. **分析目的 IP**: $128.8.65.10$。前16位皆吻合 $128.8.*$。\n2. **拆解比對第3字節**: $65 = 01000001_2$。\n   - 條目1: /16。匹配長度 16 位。\n   - 條目2: /20 ($128.8.64.0/20$)。前 20 位代表第3字節前4位必須為 $64_{10} = 0100_2$。$65_{10}$的前4位為 $0100_2$，完全匹配！匹配長度 20 位。\n   - 條目3: /20 ($128.8.80.0/20$)。前 4 位為 $80_{10} = 0101_2$。而目的 $65$ 的前4位為 $0100$，不相配。\n3. **比較匹配長度**: /20 比 /16 更長。因此最大匹配長度命中為 $128.8.64.0/20$。\n4. **最終答案**: 送往 **Link Interface 2**。"
    }
  },
  {
    id: "q15",
    chapter: ChapterId.CH4,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "DHCP DORA",
    questionText: "What are the correct sequence and destination port settings for the DHCP DORA process?",
    options: [
      "(A) Discover (unicast, 68) -> Offer (unicast, 67) -> Request (unicast, 68) -> ACK (unicast, 67)",
      "(B) Discover (broadcast, 67) -> Offer (broadcast, 68) -> Request (broadcast, 67) -> ACK (broadcast, 68)",
      "(C) Discover (broadcast, server 67) -> Offer (broadcast/unicast, client 68) -> Request (broadcast, server 67) -> ACK (broadcast/unicast, client 68)",
      "(D) Discover (unicast, client 68) -> Offer (broadcast, server 67) -> Request (unicast, client 68) -> ACK (broadcast, server 67)"
    ],
    correctAnswer: "C",
    explanation: {
      concept: "DHCP 客戶端與伺服器互動 DORA（Discover-Offer-Request-ACK）四信號埠之作用原理。",
      reviewRef: "對應複習：Ch4 Page 48 'DHCP: Dynamic Host Configuration Protocol'。\n- Server UDP Port = 67, Client UDP Port = 68.\n- Discover / Request 均為 Broadcast（因為 Client 當下尚無合法 IP）。",
      optionsAnalysis: {
        "A": "錯誤，客戶端無 IP，不可能是單播通訊。",
        "B": "錯誤，連接埠設定完全反，不對應規範細節。",
        "C": "正確，Discover & Request 發往網段 Broadcast，Server 端監聽 UDP 67，Offer & ACK 回應並裝載到 Client 68 監聽口。",
        "D": "錯誤，Discover 不能是單播。"
      }
    }
  },
  {
    id: "q16",
    chapter: ChapterId.CH4,
    type: QuestionType.CALC,
    difficulty: Difficulty.MEDIUM,
    topic: "NAT translation table",
    questionText: "An internal client (10.0.0.1:5000) sends a packet to a web server (128.119.40.186:80) through a NAT router with public IP 138.76.29.7. If the NAT router assigns external port 12000, describe the entries (Source IP:Port, Dest IP:Port) of the packet both inside and outside the NAT.",
    correctAnswer: "Inside: (10.0.0.1:5000, 128.119.40.186:80). Outside: (138.76.29.7:12000, 128.119.40.186:80)",
    explanation: {
      concept: "NAT 表項轉譯與首部重寫計算實例。",
      reviewRef: "對應複習：Ch4 Page 54 'NAT'。NAT 會改寫 Local IP 為 NAT Router 的 Public IP，並更換 TCP Port 以複用連線。",
      perfectTemplate: "【100分答題模板】\n1. **已知條件**: 內網 IP = $10.0.0.1:5000$, 外部 Web = $128.119.40.186:80$, NAT 外網公有 IP = $138.76.29.7$, 新配埠口 = $12000$。\n2. **重寫分析**: \n   - **NAT 內側（Inside NAT）**: 封包尚未經過轉換。源端 = $(10.0.0.1:5000)$；目的端 = $(128.119.40.186:80)$。\n   - **NAT 外側（Outside NAT）**: 路由器改寫源端。源端改寫為公網 = $(138.76.29.7:12000)$；目的端不變 = $(128.119.40.186:80)$。\n3. **最終答案**: Inside: (10.0.0.1:5000, 128.119.40.186:80). Outside: (138.76.29.7:12000, 128.119.40.186:80)。"
    }
  },
  {
    id: "q17",
    chapter: ChapterId.CH4,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "NAT controversy",
    questionText: "Which of the following is considered a primary architectural controversy of NAT routers?",
    options: [
      "(A) It increases IP address depletion",
      "(B) It violates the end-to-end connectivity principle and manipulates transport headers at the network layer",
      "(C) It prevents multiple private hosts from sharing a single public address",
      "(D) It forces all LAN cables to use optical fiber connections"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "NAT 網路翻譯違反端到端（End-to-End Argument）大原則學理之爭議。",
      reviewRef: "對應複習：Ch4 Page 56 'NAT Controversy'。網路層路由器本不該偷看或修改 Transport 層（Port）的標頭內容。",
      optionsAnalysis: {
        "A": "錯誤，它反而大大延緩了 IPv4 枯竭時限。",
        "B": "正確，它打破了網路層不介入傳送層首部修改（Port）的層級透明性（Layer Transparency），破壞端端直通。",
        "C": "錯誤，共用 IP 是 NAT 最大物理功績。",
        "D": "錯誤，完全與物理介質無關限制。"
      }
    }
  },
  {
    id: "q18",
    chapter: ChapterId.CH4,
    type: QuestionType.MCQ,
    difficulty: Difficulty.EASY,
    topic: "IPv6 header",
    questionText: "Which of the following fields present in the IPv4 header was completely removed from the IPv6 base header to streamline routing hardware forwarding?",
    options: [
      "(A) Source IP Address",
      "(B) Payload Length",
      "(C) Header Checksum",
      "(D) Hop Limit (formerly TTL)"
    ],
    correctAnswer: "C",
    explanation: {
      concept: "IPv6 基礎標頭移除 Header Checksum 以提升光速查表转发率的變革。",
      reviewRef: "對應複習：Ch4 Page 58 'IPv6 Header Changes'。 去除了分片字段（Fragmentation）與校驗和（Checksum）。",
      optionsAnalysis: {
        "A": "錯誤，源地址永遠有，升級為 128 位元。",
        "B": "錯誤，Payload Length 取代了原有的 Total Length，依然重要。",
        "C": "正確，Checksum 被移除，因為 Layer 2 & 4 皆已有極強保護，消減該項能省下中繼點重算的成本。",
        "D": "錯誤，Hop Limit 對等原本的 TTL，是不可或缺的防圈死保護。"
      }
    }
  },
  {
    id: "q19",
    chapter: ChapterId.CH4,
    type: QuestionType.SHORT,
    difficulty: Difficulty.MEDIUM,
    topic: "IPv4 vs IPv6",
    questionText: "Highlight three main differences between IPv4 and IPv6 headers.",
    correctAnswer: "IPv6 has larger addresses (128-bit), fixed 40-byte size, no checksum, and no fragmentation fields in the base header.",
    explanation: {
      concept: "IPv4 與 IPv6 機制三大革新差異整理。",
      reviewRef: "對應投影片：Ch4 Page 57-60 比較對照。",
      perfectTemplate: "【100分答題模板】\n1. **位址長度**: IPv4 佔 $32\\text{-bit}$；IPv6 佔 $128\\text{-bit}$（極大空間擴增）。\n2. **標頭結構**: IPv4 為變長（20~60B）；IPv6 為固定固定 40B 長度（去除了 Options 作為 Extension Headers處理）。\n3. **處理效率**: IPv6 base header 剔除了 **Header Checksum**，且移除了路由器本地的**分片功能**（全面改由 End-host 探查路徑重組）。\n- **關鍵字**: 128-bit, 40-byte Fixed, No Checksum, No Fragmentation at router."
    }
  },
  {
    id: "q20",
    chapter: ChapterId.CH4,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "Tunneling",
    questionText: "How does Tunneling facilitate transmission of IPv6 packets over an existing IPv4-only network infrastructure?",
    options: [
      "(A) By automatically slicing the IPv6 address down to 32 bits before sending",
      "(B) By encapsulating the entire IPv6 datagram inside the payload of an IPv4 packet",
      "(C) By converting the physical fiber optic signals to radio wavelengths",
      "(D) By routing all IPv6 requests via a central Satellite gateway link"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "隧道技術（Tunneling）將高層或對手協定（IPv6）當作載荷封裝入同層/底層協定（IPv4）穿越舊網路。",
      reviewRef: "對應：Ch4 Page 60 'Tunneling'。將整個 IPv6 封包當作普通 Payload，塞在以 IPv4 為首的主體大車之中。",
      optionsAnalysis: {
        "A": "錯誤，不可毀棄 128 位的完整路由語意。",
        "B": "正確，藉由把 IPv6 裝載成 IPv4 包內 Payload 行進，抵達支援點後再解讀釋出。",
        "C": "錯誤，這屬於物理層訊號變化，與 Tunneling 網絡層邏輯無關。",
        "D": "錯誤，無須衛星轉發干預。"
      }
    }
  },
  {
    id: "q21",
    chapter: ChapterId.CH4,
    type: QuestionType.MCQ,
    difficulty: Difficulty.HARD,
    topic: "Symmetric Match Action",
    questionText: "In the SDN generalized forwarding 'Match + Action' abstraction, which of the following combined actions is NOT officially supported in standard flows?",
    options: [
      "(A) Forward the packet to specific outgoing physical interfaces",
      "(B) Drop (discard) the packet immediately if match criteria fail",
      "(C) Send the matched packet to the application layer to rebuild a native TCP socket",
      "(D) Rewrite designated IP or MAC headers before sending"
    ],
    correctAnswer: "C",
    explanation: {
      concept: "泛化轉發 Match+Action 技術的動作行為域邊界。",
      reviewRef: "對應：Ch4 'OpenFlow Match + Action abstraction'。支援 Forward, Drop, Rewrite 欄位修改。但決不容許普通 Data Plane 路由器自主強插重構完整的 TCP Socket 應用層數據。",
      optionsAnalysis: {
        "A": "錯誤，Forward 乃核心基本動作。",
        "B": "錯誤，Drop 常用於防火牆規則。",
        "C": "正確， generalized data abstraction 無法也嚴格禁止將高速硬體流直接回授重構頂級通訊協議 socket（那是主機應用的任務）。",
        "D": "錯誤，轉寫（NAT、VLAN 改寫）已被 Match-Action 全面完美支援。"
      }
    }
  },

  // ==================== CHAPTER 5 (21 Questions: q22 ~ q42) ====================
  {
    id: "q22",
    chapter: ChapterId.CH5,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "Routing state oscillation",
    questionText: "What is the primary cause of link-state routing algorithm oscillations (traffic instability) when computing paths based on link load?",
    options: [
      "(A) Using static weights that never change during convergence",
      "(B) The routing metrics (link costs) dynamically change with traffic loading, causing synchronized flow shifting",
      "(C) Routers crashing randomly across different Autonomous Systems",
      "(D) The routing table becoming too large for the memory space"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "以鏈路負載（Load-sensitive）為代價度量指標時引起的 LS 演算法振盪（Oscillation）現象。",
      reviewRef: "對應複習：Ch5 'Dijkstra Oscillations'。當 Cost 隨流量擁堵動態變更，Dijkstra 計算將使大量流量同時往空閒路由傾斜，隨即將空閒處塞死，逼其下一次再攜手移走，從而往復震盪。",
      optionsAnalysis: {
        "A": "錯誤，靜態權重永不會引發動態算路振盪。",
        "B": "正確，Cost 隨負載改變，使得路由器同步計算避開高 Cost，反向製造了新擁堵。解決方案是限制 Dijkstra 隨機時間啟動算路。",
        "C": "錯誤，跟系統當機無直接誘發關係限制。",
        "D": "錯誤，路由表尺寸膨脹不會引致物理路徑交互搖擺振盪。"
      }
    }
  },
  {
    id: "q23",
    chapter: ChapterId.CH5,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "Bellman-Ford equation",
    questionText: "What mathematical formula defines the core operation of Distance Vector routing algorithms like RIP?",
    options: [
      "(A) D(v) = min(D(v), d(v,u) + D(u))",
      "(B) Dx(y) = min_v { c(x,v) + Dv(y) }",
      "(C) B = RTT * C / sqrt(N)",
      "(D) p(v) = N' / D(v)"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "Bellman-Ford 方程式定義距離向量（Distance Vector）演算法的遞迴運算關係。",
      reviewRef: "對應學理：Ch5 Page 18 'Bellman-Ford Equation'。 $D_x(y) = \\min_{v}\\{ c(x,v) + D_v(y) \\}$，其中 $v$ 是所有相鄰鄰居。",
      optionsAnalysis: {
        "A": "錯誤，這是 Dijkstra 鬆弛迭代的內部表達形式，非 BF 式。",
        "B": "正確，Bellman-Ford 遞迴方程式，求去往目的地 $y$ 的最優代價。",
        "C": "錯誤，這是 TCP 緩衝大小計算公式。",
        "D": "錯誤，無物理意義的無用組合字串。"
      }
    }
  },
  {
    id: "q24",
    chapter: ChapterId.CH5,
    type: QuestionType.SHORT,
    difficulty: Difficulty.HARD,
    topic: "Count-to-Infinity",
    questionText: "Explain the link cost change asymmetric behavior in Distance Vector (Count-to-inf / Poison Reverse).",
    correctAnswer: "Good news travels fast, bad news travels slow because of routing loops in disconnected status.",
    explanation: {
      concept: "距離向量長度升等（壞消息）引起的計數到無窮大（Count-to-Infinity）本因與毒性逆轉（Poison Reverse）反制。",
      reviewRef: "對應投影片：Ch5 Page 22-25 'Distance Vector: Link Cost Changes'。",
      perfectTemplate: "【100分答題模板】\n1. **不對稱現象**: 當鏈路成本變好（Good News），全網能光速更新收斂（Good news travels fast）；但若鏈路成本大幅變壞（Bad News），節點間會陷入彼此欺騙，在不知道彼此成環路的情況下循環累加 1 探測，極度緩慢遞增至系統無窮大（Bad news travels slow）。\n2. **解決方案**: **Poison reverse（毒性逆轉）**。若 $Z$ 通向 $X$ 的最優路徑是經由 $Y$，$Z$ 會主動向 $Y$ 隱瞞或謊報 $D_z(X) = \\infty$，阻止 $Y$ 走回 $Z$ 發起路由環圈。\n- **關鍵字**: Good news fast, Bad news slow, Routing loop, Poison Reverse, Infinite metric."
    }
  },
  {
    id: "q25",
    chapter: ChapterId.CH5,
    type: QuestionType.MCQ,
    difficulty: Difficulty.EASY,
    topic: "LS vs DV Comparison",
    questionText: "Which of the following is correct regarding the comparison of Link-State (LS) and Distance Vector (DV) routing?",
    options: [
      "(A) LS has global network knowledge but converges slower due to O(N^2) complexity of DV",
      "(B) LS is highly prone to massive localized loops; DV is entirely immune to loops",
      "(C) LS utilizes global topology information; DV is decentralized and learns only from adjacent neighbors",
      "(D) In LS, a faulty router can advertise incorrect path cost to any destination globally, poisoning the entire net's DB"
    ],
    correctAnswer: "C",
    explanation: {
      concept: "LS 與 DV 路由演算法代表理念大對比。",
      reviewRef: "對應：Ch5 Page 28 'LS vs. DV comparison'。 LS 看全局，DV 只看鄰居。",
      optionsAnalysis: {
        "A": "錯誤，LS 的 O(N^2) 多採用優化堆，且比 DV 整體容易解決瞬時環路，收斂一般在複雜拓撲更穩健。",
        "B": "錯誤，DV 常受成環干擾，LS 內大腦看完整地圖不可能在穩定狀態有本地環路。",
        "C": "正確，LS 使用 Link-State Advertisement 共享全局地圖；DV 則是 'tell neighbors about entire net'。",
        "D": "錯誤，LS 中路口只公布自己的 Link linkCost 僅限直連；而 DV 中若給了錯的全局路由，毒素會極快汙染整條鏈路。"
      }
    }
  },
  {
    id: "q26",
    chapter: ChapterId.CH5,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "Autonomous Systems",
    questionText: "Why is the global Internet structured into Autonomous Systems (AS) instead of a single giant flat router group?",
    options: [
      "(A) Global routers must all use different physical wiring standards",
      "(B) Scale and Administrative autonomy: to avoid explosive routing table sizes and maintain policy boundaries",
      "(C) To enforce strict decryption processes at each country's state boundaries",
      "(D) Since routers only support 100 ports maximum due to memory chip limitations"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "自治系統（AS）的導入動機：規模可擴展性（Scale）與管理自治權（Administrative autonomy）。",
      reviewRef: "對應：Ch5 Page 29 'Hierarchical Routing'。 解決路由表條目過大問題，並在邊界隔離各家 ISP 管理政策。",
      optionsAnalysis: {
        "A": "錯誤，IP 層就是大一統相容物理規格。",
        "B": "正確，尺度縮小與政治獨立，是引進分層 AS 系統的兩大黃金理由。",
        "C": "錯誤，安全控制並非 AS 劃分的核心科學誘因。",
        "D": "錯誤，硬體埠數不限制控制平面拓撲聚合。"
      }
    }
  },
  {
    id: "q27",
    chapter: ChapterId.CH5,
    type: QuestionType.MCQ,
    difficulty: Difficulty.EASY,
    topic: "Intra AS vs Inter AS",
    questionText: "Which of the following correct describes the different focus of Intra-AS and Inter-AS routing protocols?",
    options: [
      "(A) Intra-AS focuses on political policy; Inter-AS focuses purely on speed cost performance",
      "(B) Intra-AS focuses on high physical performance; Inter-AS focuses on commercial routing policy and administrative borders",
      "(C) Both protocols are identical in algorithms and metric parameters",
      "(D) Intra-AS uses BGP; Inter-AS uses OSPF"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "系統內（Intra-AS）與系統間（Inter-AS）選路協定之相異設計核心。",
      reviewRef: "對應：Ch5 'Why different Intra- and Inter-AS routing?'。",
      optionsAnalysis: {
        "A": "錯誤，剛好講反。AS內要性能，AS外要政策。",
        "B": "正確，Intra-AS（OSPF）要快、要物美價廉不吃寬頻；Inter-AS（BGP）重商業利益（Policy）。",
        "C": "錯誤，完全因情境改寫兩大協定內核設計。",
        "D": "錯誤，Intra 使用 OSPF，Inter 邊界使用 BGP。"
      }
    }
  },
  {
    id: "q28",
    chapter: ChapterId.CH5,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "OSPF Basics",
    questionText: "Which transport protocol and encapsulation method is utilized by OSPF to deliver its Link-State Advertisements (LSA)?",
    options: [
      "(A) Encapsulated inside UDP packets destined for port 520",
      "(B) Encapsulated directly inside IP packets with protocol ID set to 89",
      "(C) Encapsulated in standard TCP packets to ensure end-to-end reliable handshake",
      "(D) Carried as part of DNS response payload"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "OSPF 訊息遞送之實體封裝結構。",
      reviewRef: "對應複習：Ch5 Page 32 'OSPF: Open Shortest Path First'。 OSPF 選擇不走 UDP/TCP，直接自建可靠傳遞，直套 IP Payload（協定號 89）。",
      optionsAnalysis: {
        "A": "錯誤，UDP 520 是 RIP 協定所使用。",
        "B": "正確，直接用 IP 包承載，IP Header 的 Protocol Type = 89。",
        "C": "錯誤，TCP 開銷過大不適合在本地路由器相鄰高洪泛鏈路運轉。",
        "D": "錯誤，與 DNS 解析用途無任何相交工作線路。"
      }
    }
  },
  {
    id: "q29",
    chapter: ChapterId.CH5,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "Hierarchical OSPF Area",
    questionText: "In OSPF, what is Area 0.0.0.0 designated as, and what is the responsibility of an Area Border Router (ABR)?",
    options: [
      "(A) Private testing subnet; ABR forwards only video data",
      "(B) Backbone area; ABR aggregates local area routes and advertises them to other areas on the backbone",
      "(C) Encryption area; ABR decrypts packet streams",
      "(D) Multicast boundary; ABR blocks all DNS traffic"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "階層 OSPF 骨幹區（Backbone Area）以及 Area Border Router (ABR) 機制職責。",
      reviewRef: "對應複習：Ch5 'Hierarchical OSPF'。 Area 0.0.0.0 是主幹骨幹區，所有非骨幹區必須與它連通。ABR 負責聚合本地 Area 資訊並發送至 Backbone 區段中。",
      optionsAnalysis: {
        "A": "錯誤，Area 0 是全網主幹，任何非零 Area 互動皆須穿過它進行。",
        "B": "正確，Area 0 為 Backbone Area。A與A ABR 做跨區銜接數據和 LSA 資訊匯聚。",
        "C": "錯誤，ABR 不需在路由時強制行使應用數據解密操作。",
        "D": "錯誤，ABR 轉發普通數據是不管也絕不隨便截殺普通 DNS packets 的。"
      }
    }
  },
  {
    id: "q30",
    chapter: ChapterId.CH5,
    type: QuestionType.MCQ,
    difficulty: Difficulty.EASY,
    topic: "BGP basics",
    questionText: "What transport protocol does BGP (Border Gateway Protocol) run on to establish its reliable peering connections?",
    options: [
      "(A) UDP, port 179",
      "(B) TCP, port 179",
      "(C) Direct IP packets, protocol 89",
      "(D) ICMP Echo Messages"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "BGP Peering Session 靠 TCP 179 來取得 100% 可靠底牌連結。",
      reviewRef: "對應：Ch5 Page 42 'BGP Basics'。與 OSPF 自建傳遞不同，跨 AS 的 BGP 使用可靠的 TCP port 17Peering。",
      optionsAnalysis: {
        "A": "錯誤，UDP 沒有可靠三次握手，易遭大表溢出丟波。",
        "B": "正確，BGP 使用 TCP 埠號 179 起建立 Session 傳送 prefix。",
        "C": "錯誤，直接套 IP 是 OSPF 玩法。",
        "D": "錯誤，ICMP 僅主導錯誤診斷，不傳播骨幹路由。"
      }
    }
  },
  {
    id: "q31",
    chapter: ChapterId.CH5,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "eBGP vs iBGP",
    questionText: "What is the key difference in propagation scope between eBGP and iBGP?",
    options: [
      "(A) eBGP connects physical routers; iBGP connects soft apps inside host cells",
      "(B) eBGP is used to exchange reachability info between peer ASes; iBGP is used to propagate those learned paths to all internal routers within the same AS",
      "(C) eBGP uses encryption; iBGP has no security checks",
      "(D) eBGP uses Dijkstra; iBGP uses Bellman-Ford"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "BGP 體系中 eBGP 與 iBGP 各自的工作定位。",
      reviewRef: "對應複習：Ch5 'BGP Basics: eBGP vs. iBGP'。 外線用 eBGP 領旨，內線用 iBGP 宣旨。",
      optionsAnalysis: {
        "A": "錯誤，都是物理路由器之 BGP 機制執行程式。",
        "B": "正確，eBGP 連接邊境（External）；iBGP 給群組內路由器散播可達表項（Internal）。",
        "C": "錯誤，兩者皆不依靠自身作包載荷加密，可用 MD5 校驗。",
        "D": "錯誤，都基於 Path-Vector 算法，不是 LS/DV 演算法。"
      }
    }
  },
  {
    id: "q32",
    chapter: ChapterId.CH5,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "AS-PATH and Loops",
    questionText: "How does a BGP router detect and prevent routing loops using the AS-PATH attribute?",
    options: [
      "(A) By checking if the dest packet IP is part of its own Subnet",
      "(B) By verifying if its own AS number already appears in the AS-PATH list of the received update; if so, it discards the path",
      "(C) By decrementing the AS-PATH hop limit count down to 0",
      "(D) By routing all loop checks to Area 0"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "BGP 基於 AS-PATH 清單特質進行自我防路由環閉環判斷。",
      reviewRef: "對應學理：Ch5 'BGP Route Attributes'。 AS-PATH 含有沿途穿過的所有 AS ID。一旦在通告中看到自己，即判定成環。",
      optionsAnalysis: {
        "A": "錯誤，目的 IP 不是阻止 BGP 政策宣告成環的核心自學字段。",
        "B": "正確，若收到包的 AS-PATH 含本自治區編號，直接捨棄（Loop Detect）。",
        "C": "錯誤，這屬於 IP 的 TTL 行為，非 BGP AS-PATH 運作細則。",
        "D": "錯誤，BGP 沒有 OSPF 的 Area 0 主幹概念。"
      }
    }
  },
  {
    id: "q33",
    chapter: ChapterId.CH5,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "BGP NEXT-HOP",
    questionText: "What is the critical role of the BGP NEXT-HOP attribute in forwarding packets?",
    options: [
      "(A) It defines the next internal PC client to receive DNS packet stream",
      "(B) It is the IP address of the starting interface of the AS-PATH that begins the next hop hop-by-hop across AS boundaries",
      "(C) It decreases at each internal segment by 1",
      "(D) It maps internal private addresses to standard NAT addresses inside AS"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "BGP 核心屬性 NEXT-HOP 物理語意，代表到達下一跳 AS 首個邊界路口的實體 IP 位址。",
      reviewRef: "對應複習：Ch5 'BGP NEXT-HOP'。BGP 是跨越 AS 級的大組網，NEXT-HOP 指向跨越下一個 AS 的具體對端 IP接口。",
      optionsAnalysis: {
        "A": "錯誤，NEXT-HOP 是路由器出口網路，不是終端客戶端名冊。",
        "B": "正確，它是通告鏈路上，鄰近下個自治區邊界對角路口的起點 IP 地址。",
        "C": "錯誤，它是不會像 TTL 那樣代代減 1 的靜態 IP 字串。",
        "D": "錯誤，這與 NAT 位址代換無本質工作關係。"
      }
    }
  },
  {
    id: "q34",
    chapter: ChapterId.CH5,
    type: QuestionType.MCQ,
    difficulty: Difficulty.HARD,
    topic: "BGP Route Selection",
    questionText: "What is the exact deterministic priority of decision rules used by BGP when selecting the best path among multiple advertised routes?",
    options: [
      "(A) Hot Potato -> Local Preference -> AS-PATH -> shortest OSPF metric",
      "(B) Local Preference -> shortest AS-PATH -> Hot Potato (OSPF cost) -> BGP Router ID",
      "(C) Shortest Dijkstra cost -> Hot Potato -> BGP ID -> Local Pref",
      "(D) Policy Check -> Round Robin -> WFQ -> Random Exit"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "BGP 金字塔選路決策鏈（Deterministic BGP Decision Steps）。",
      reviewRef: "對應：Ch5 Page 48 'BGP Route Selection criteria'。 \n1. Local Preference (管理者定，政策至上)。\n2. AS-PATH 長短 (越短越好)。\n3. Hot Potato Routing (哪條路去下一跳 NEXT-HOP 內網物理代價最小，選它)。\n4. BGP Router ID (作平局打破，破除平手)。",
      optionsAnalysis: {
        "A": "錯誤，順序倒錯，Hot potato 優先度低於 Local pref 和 AS-path 限制。",
        "B": "正確， Local Preference (Policy) -> Shortest AS-PATH -> Hot Potato Routing -> Tie Breaker (ID)。",
        "C": "錯誤，Dijkstra 成本（物理成本）不曾凌駕於商業政治 Local-pref 權重頂峰。",
        "D": "錯誤，無中生有的隨機排程演算法串連。"
      }
    }
  },
  {
    id: "q35",
    chapter: ChapterId.CH5,
    type: QuestionType.SHORT,
    difficulty: Difficulty.MEDIUM,
    topic: "Hot potato routing",
    questionText: "Describe the core heuristic of Hot Potato Routing in inter-domain systems.",
    correctAnswer: "Get the packet out of my AS as quickly as possible through the closest internal gateway.",
    explanation: {
      concept: "熱馬鈴薯選路（Cold/Hot Potato Routing）的商業考量與實體執行思路。",
      reviewRef: "對應規律：Ch5 Page 49 'Hot Potato Routing'。",
      perfectTemplate: "【100分答題模板】\n1. **核心原則**: **「自私（Selfish）原則」**。本 AS 路由器不惜任何手段，以最低本地物理代价（Dijkstra/OSPF cost 最小值），將封包送達最先能踏出本 AS 邊區的那個邊界 ABR，丟給外端同胞，而不考慮對手 AS 面臨的外部時延和成本代價。\n2. **動機**: 能少轉發一跳就少轉發，在最短學區時間內清空本地緩衝、減低本 AS 交換通道的負載與頻寬消耗。\n- **關鍵字**: Selfish, Local Dijkstra least cost, Exit Gateway, Minimizing internal transit."
    }
  },
  {
    id: "q36",
    chapter: ChapterId.CH5,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "BGP Policy Import Export",
    questionText: "Suppose customer network X is connected to two provider transit networks, ISP-A and ISP-B. If ISP-A does not want to route ISP-B's packets destinating for external nodes through its link, how does it implement this via BGP?",
    options: [
      "(A) By applying a strict firewall blocking ICMP",
      "(B) By not advertising any path leading to those destinations to ISP-B in its Export Policy",
      "(C) By increasing OSPF weights inside ISP-A",
      "(D) By configuring the default route prefix to /0"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "BGP 導出政策（Export Policy）與商業獲利手段調控。",
      reviewRef: "對應：Ch5 Page 50 'BGP Policy: Commercial Rules'。 我不幫不是我客戶的人做免費轉發（Transit），因此我就不把我學會的通路宣告（Advertise）給我的鄰居對手。",
      optionsAnalysis: {
        "A": "錯誤，防火牆 ICMP 無法動能調控 BGP 大表的通告，治標不治本。",
        "B": "正確，在 Export Policy 中，只宣布能產生利潤的路由（如自己網段或付費客戶），對於轉發同行（B）數據，不宣告有鏈路出口，使其在 Z 查不到便逼其改道。",
        "C": "錯誤，OSPF 僅控制主體 AS 內，與跨 AS BGP 路由宣染商業走向不相干涉。",
        "D": "錯誤，/0 代表萬能預設路徑，會放行所有大水，造成反向效果。"
      }
    }
  },
  {
    id: "q37",
    chapter: ChapterId.CH5,
    type: QuestionType.MCQ,
    difficulty: Difficulty.EASY,
    topic: "ICMP Basics",
    questionText: "What layer is ICMP (Internet Control Message Protocol) logically situated in, and how are its packets encapsulated?",
    options: [
      "(A) SITUATED in Link Layer; encapsulated directly inside Ethernet Frame payload",
      "(B) SITUATED in Network Layer; encapsulated directly inside IP Datagram payload (Protocol ID 1)",
      "(C) SITUATED in Transport Layer; encapsulated alongside TCP",
      "(D) SITUATED in Application Layer; encapsulated in HTTP"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "網際網路控制報文協定（ICMP）的結構與 IP 承載關係。",
      reviewRef: "對應：Ch5 Page 55 'ICMP'。 ICMP 雖然承載於 IP 包內（協定號 1），但因其負責防錯修訂，仍邏輯歸屬於 Network Layer。",
      optionsAnalysis: {
        "A": "錯誤，不屬於 Layer 2 本地鏈路限速協定。",
        "B": "正確，邏輯隸屬 Network Layer，承載在 IP datagram 之中（協定號 1）。",
        "C": "錯誤，不具備 Transport 埠號多路複用與窗口維持功用。",
        "D": "錯誤，非應用程式之 Payload。"
      }
    }
  },
  {
    id: "q38",
    chapter: ChapterId.CH5,
    type: QuestionType.SHORT,
    difficulty: Difficulty.MEDIUM,
    topic: "Traceroute Mechanism",
    questionText: "Explain the logical workflow of the Traceroute utility relying on ICMP and TTL values.",
    correctAnswer: "Sender sends packets with incremental TTLs (1, 2, 3...). Each router drops and replies with source TTL Time Exceeded ICMP, exposing router IPs.",
    explanation: {
      concept: "探孔路徑 Traceroute 機制與 TTL 故意歸零觸發 ICMP 回報之原理。",
      reviewRef: "對應投影片：Ch5 Page 56 'ICMP: traceroute'。",
      perfectTemplate: "【100分答題模板】\n1. **發送遞增**: 發送端發送一系列 TTL = $1, 2, 3, \\dots$ 的探側 packet（多使用 UDP 發往極冷門 port）。\n2. **逐跳丟棄**: \n   - 第 1 跳路由器收到 TTL=1 扣 1 為 0，將包丟棄，向發送端報回一封 **ICMP Type 11 Code 0 (TTL expired)**。發送者從而得知第 1 跳 IP。\n   - 第 2 跳收 TTL=2，減至 0，由第 2 跳路由器報回 ICMP。發送者即可得知第 2 跳 IP，依此類推。\n3. **終點抵達**: 當到達終點主機，由於連接埠不存在，終點會回報 **ICMP Type 3 Code 3 (Port Unreachable)**，發送端接收立即終止探查。\n- **關鍵字**: TTL Incrementation, Expired ICMP, Port Unreachable, End Host Reach."
    }
  },
  {
    id: "q39",
    chapter: ChapterId.CH5,
    type: QuestionType.MCQ,
    difficulty: Difficulty.HARD,
    topic: "SDN control plane [Skip for this year]",
    questionText: "[Skip for this year] In the SDN controllers Southbound and Northbound Interfaces, how does an external app communicate topology requests or customized traffic engineering rules to the central platform?",
    options: [
      "(A) Through Southbound Interface (e.g. OpenFlow, Netconf)",
      "(B) Through Northbound Interface (e.g. REST API, gRPC)",
      "(C) By directly rewriting the router's Input queue firmware",
      "(D) Through active ARP broadcasting"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "SDN 控制面北向（Northbound）與南向（Southbound）介面之對口用途。本題本學期不納入必考重心複習，標記為 [Skip for this year]。",
      reviewRef: "南向向底下設備（OpenFlow），北向向上對應軟體應用（API）。",
      optionsAnalysis: {
        "A": "錯誤，南向是控制轉發單元（Switches）查表配置的。",
        "B": "正確，北向介面（Northbound Interface）用以讓上層 APP 與大腦控制器互動調用算路（REST to Control）。",
        "C": "錯誤，不能胡亂代寫硬體韌體。",
        "D": "錯誤，ARP 屬鏈路層。本學年不考，標示跳過。"
      }
    }
  },
  {
    id: "q40",
    chapter: ChapterId.CH5,
    type: QuestionType.MCQ,
    difficulty: Difficulty.HARD,
    topic: "BGP Customer Provider Rules",
    questionText: "Under the standard commercial policy rules in BGP, which of the following peering paths is valid to carry data traffic?",
    options: [
      "(A) Provider accepts data from Peer-A, and routes it across to its rival Peer-B for free transit",
      "(B) Customer advertises provider routes to another peer customer to become a transit ISP",
      "(C) Provider advertises its routes learned from customer to other providers to generate revenue",
      "(D) Peers advertise customer routes to non-paying external providers"
    ],
    correctAnswer: "C",
    explanation: {
      concept: "BGP 商業金律：使用者付費與路權通告隔離限制。",
      reviewRef: "對應：Ch5 Page 50-51 'BGP Policy Rules'。\n- Customer pays Provider ($$). So Provider is willing to transit Customer packets to ANYWHERE.\n- Peer-A and Peer-B are equal rivals (No fees). So Peer-A will NEVER route traffic from Peer-B to another Peer-C.",
      optionsAnalysis: {
        "A": "錯誤，同業競爭間（Peers）無利益往來，絕不提供免費中轉流量。",
        "B": "錯誤，付費用戶（Customer）絕無意願幫外人打工做 transit 增加自己的線路頻寬負荷。",
        "C": "正確，Provider 替付費客戶（Customer）做全球宣傳。這符合商業交易合約，是 BGP 運轉的財政推動力。",
        "D": "錯誤，同商業邏輯相背。"
      }
    }
  },
  {
    id: "q41",
    chapter: ChapterId.CH5,
    type: QuestionType.CALC,
    difficulty: Difficulty.HARD,
    topic: "Dijkstra Forwarding Table Construction",
    questionText: "Based on the shortest path tree from x computed using Dijkstra's algorithm:\n- cost to y is 6 via path x -> y\n- cost to v is 5 via path x -> v\n- cost to w is 6 via path x -> w\n- cost to u is 7 via path x -> v -> u\n- cost to t is 8 via path x -> v -> u -> t\nDefine the corresponding forwarding table entry at router x for destination t.",
    correctAnswer: "Destination t -> Next Hop interface v",
    explanation: {
      concept: "由 Dijkstra 算出的最短路徑路程樹提取並建立本地轉發表（Forwarding Table）。",
      reviewRef: "對應複習：Ch5 'Dijkstra table to Forwarding Table'。 x 為本路由器，前往任一目的，查表時只需看他的「出發第一跳（First Hop/Interface）」是誰即可。",
      perfectTemplate: "【100分答題模板】\n1. **找到去往目的的路徑**: 前往終點 $t$ 的最優路徑是 $x \\rightarrow v \\rightarrow u \\rightarrow t$。\n2. **尋找下一跳（First Hop）**: 從 $x$ 出發，這條最優長路的第一跳（Immediate Next Hop）是開往 **$v$**（此時 $x-v$ 直連，出口 Interface 為指向 $v$ 的接頭）。\n3. **建表對應**: 轉發表只負責指向第一步。目的地（Destination）為 $t$，與其掛鉤連結的本地轉發端口對口指標即是 $v$。\n4. **最終答案**: 轉發表對目 $t$ 對應之接口為 **v**。"
    }
  },
  {
    id: "q42",
    chapter: ChapterId.CH5,
    type: QuestionType.MCQ,
    difficulty: Difficulty.EASY,
    topic: "Graph abstraction notation",
    questionText: "In the graph abstraction G = (N, E) of routing network topologies, what do the elements N and E represent physically?",
    options: [
      "(A) N is the network cost; E is the encryption standard",
      "(B) N is the set of routers; E is the set of physical links connecting those routers",
      "(C) N is the total host count; E is the Ethernet frame size limit",
      "(D) N is the switching fabric bus; E is the buffer queue capacity"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "圖論對網路拓撲之標準抽象描述（Graph Abstraction）。",
      reviewRef: "對應：Ch5 Page 4 'Graph Abstraction G = (N, E)'。",
      optionsAnalysis: {
        "A": "錯誤，N 與 E 為圖論核心架構術語。",
        "B": "正確，N（Nodes）代路由器（Routers）；E（Edges）代實體連線（Links）。",
        "C": "錯誤，無機對比。",
        "D": "錯誤，路由器內硬體物件，非全網拓撲概念。"
      }
    }
  },

  // ==================== CHAPTER 6 (20 Questions: q43 ~ q62) ====================
  {
    id: "q43",
    chapter: ChapterId.CH6,
    type: QuestionType.MCQ,
    difficulty: Difficulty.EASY,
    topic: "Link layer services",
    questionText: "Where is the Link Layer completely implemented on an end-system parent device?",
    options: [
      "(A) Fully inside the central CPU kernel memory",
      "(B) Inside the Network Interface Card (NIC) / Host chipset adapter",
      "(C) Within the local Chrome browser cache database",
      "(D) On the external fiber optic interface transceivers only"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "鏈路層（Link Layer）實體裝署位置，由網卡（NIC / Network Interface Card）硬軟體共同承接。",
      reviewRef: "對應複習：Ch6 Page 6 'Where is the link layer implemented?'。 幾乎完全整合在 NIC 網卡片上。",
      optionsAnalysis: {
        "A": "錯誤，作業系統 CPU 僅作驅動調度，主要 bit-level 計算在網卡晶片。",
        "B": "正確，裝配於 Network Interface Card (NIC)，包含硬體封裝、MAC 解碼與 Checksum 高速晶片硬算。",
        "C": "錯誤，軟體瀏覽器與此物理硬體底層不沾邊。",
        "D": "錯誤，Transceiver 只做光電轉換，不解碼 Ethernet frame。"
      }
    }
  },
  {
    id: "q44",
    chapter: ChapterId.CH6,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "Parity Checks",
    questionText: "What is the limitation of a Single-bit Parity error check, and how is it improved by a Two-Dimensional Parity Check?",
    options: [
      "(A) Single-bit parity cannot detect any errors; 2D parity can detect all burst errors",
      "(B) Single-bit parity detects odd errors but cannot correct; 2D parity can detect and correct a single-bit error",
      "(C) Single-bit parity corrects single bit errors; 2D parity has no recovery option",
      "(D) Both parity checks are identical but 2D is slower"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "單同位元校驗（Single Parity Check）與二維校驗限制對話（Two-Dimensional Parity）。",
      reviewRef: "對應：Ch6 Page 9 'Parity Checking'。 2D 二維藉由行列十字交叉點定位，具備 1-bit 錯糾正功能。",
      optionsAnalysis: {
        "A": "錯誤，單同尾可精準抓取奇數個 bit 反轉。",
        "B": "正確，單個同位元只察不糾；而 2D 二維校驗交叉定位行列錯格，擁有一位元錯主動修復的能力。",
        "C": "錯誤，剛好講反。",
        "D": "錯誤，技術演進結構不同。"
      }
    }
  },
  {
    id: "q45",
    chapter: ChapterId.CH6,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "CRC concept",
    questionText: "In Cyclic Redundancy Check (CRC), for a generator G of bit-length r+1, what divisor length is appended to the packet data D before performing theModulo-2 calculation?",
    options: [
      "(A) r+1 bits of zeros",
      "(B) r bits of zeros",
      "(C) 32 bits of zeros always",
      "(D) 0 bits"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "CRC 校驗位寬與預補零個數之決定公式： $r$ 個零。",
      reviewRef: "對應：Ch6 Page 11 'CRC: Cyclic Redundancy Check'。 生成多項式 $G$ 長度為 $r+1$，則補 $r$ 個零，得餘數 $R$ 長度亦為 $r$ 位元。",
      optionsAnalysis: {
        "A": "錯誤，若發送補 $r+1$ 零會令餘數混入溢出數據，爆出額外 1 位錯碼。",
        "B": "正確，補 $r$ 個零（$r = G\\text{.length} - 1$）。",
        "C": "錯誤，變長生成項不限定 32。",
        "D": "錯誤，不補零將使除法失去移位對齊校正功效。"
      }
    }
  },
  {
    id: "q46",
    chapter: ChapterId.CH6,
    type: QuestionType.MCQ,
    difficulty: Difficulty.EASY,
    topic: "Multiple Access Protocols",
    questionText: "How are the three main classes of Multiple Access Protocols defined, and what is their taxonomy?",
    options: [
      "(A) LAN, WAN, Internet",
      "(B) Channel Partitioning, Random Access, and 'Taking Turns'",
      "(C) Wired, Wireless, Cellular",
      "(D) Priority, FCFS, Round Robin"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "多路接取（Multiple Access Protocols）三大底層調度分類。",
      reviewRef: "對應學科：Ch6 Page 13 'Multiple Access Protocols'。",
      optionsAnalysis: {
        "A": "錯誤，這是地理網絡規模分類。",
        "B": "正確，分別為信道劃分（TDMA/FDMA/CDMA）、隨機接取（CSMA/ALOHA）、輪流接取（Polling/Token-ring）。",
        "C": "錯誤，這是傳輸物理媒介分類。",
        "D": "錯誤，這是路由器內調排程術語。"
      }
    }
  },
  {
    id: "q47",
    chapter: ChapterId.CH6,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "TDMA FDMA",
    questionText: "Which of the following describes the key difference between TDMA and FDMA?",
    options: [
      "(A) TDMA shares physical space; FDMA shares time frames only",
      "(B) TDMA allocates dedicated time slots of a single channel; FDMA allocates dedicated frequency bands",
      "(C) TDMA uses binary polynomial matrix multiplication; FDMA has no mathematical rules",
      "(D) TDMA is only for high-speed fiber; FDMA is for wireless exclusively"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "TDMA 與 FDMA 信道劃分技術之核心分割維度（時間、頻率）。",
      reviewRef: "對應學界：Ch6 Page 14 'TDMA / FDMA'。",
      optionsAnalysis: {
        "A": "錯誤，共享空間是無用學術字眼。",
        "B": "正確，TDMA 是時分複用（時間切片）；FDMA 是頻分複用（分配獨立頻段）。",
        "C": "錯誤，CDMA 才是利用數學編碼（Chipping codes）去隔開的。",
        "D": "錯誤，兩者在有線、無線及蜂巢式網路皆被完美採納。"
      }
    }
  },
  {
    id: "q48",
    chapter: ChapterId.CH6,
    type: QuestionType.CALC,
    difficulty: Difficulty.HARD,
    topic: "CDMA math calculation",
    questionText: "Two users share a CDMA channel. User 1 has chip sequence (1, -1, 1, 1). User 2 has code (1, 1, -1, 1). If both send simultaneously, User 1 sends binary '1' (expressed as 1) and User 2 sends '0' (expressed as -1). Calculate the composite vector received at the receiver.",
    correctAnswer: "(0, -2, 2, 0)",
    explanation: {
      concept: "碼分多址（CDMA）編碼向量疊加算法（Orthogonal Multiplexing Summation）。",
      reviewRef: "對應公式：Ch6 'CDMA Code Division Multiple Access'。 $Z = d_1 \\times P_1 + d_2 \\times P_2$。 $d_i$ 擴展為 1 或 -1。",
      perfectTemplate: "【100分答題模板】\n1. **已知條件**: \n   - 用戶 1 序列: $C_1 = (1, -1, 1, 1)$，發送位 $d_1 = 1 \\rightarrow S_1 = 1 \\times (1, -1, 1, 1) = (1, -1, 1, 1)$。\n   - 用戶 2 序列: $C_2 = (1, 1, -1, 1)$，發送位 $d_2 = -1$ (代表二進制 '0') $\\rightarrow S_2 = -1 \\times (1, 1, -1, 1) = (-1, -1, 1, -1)$。\n2. **向量疊加 (Summation)**: \n   - $Z = S_1 + S_2 = (1 + (-1), \\, -1 + (-1), \\, 1 + 1, \\, 1 + (-1))$。\n   - $Z = (0, -2, 2, 0)$。\n3. **最終答案**: 實體介面接收疊加向量為 **(0, -2, 2, 0)**。"
    }
  },
  {
    id: "q49",
    chapter: ChapterId.CH6,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "CSMA sense",
    questionText: "What is the core rule of Carrier Sense Multiple Access (CSMA), and why can collisions still occur in CSMA?",
    options: [
      "(A) It sends regardless of state; collisions occur due to router buffer drops",
      "(B) It listens before talking (LBT); collisions occur due to signal propagation delay",
      "(C) It relies on token passing; collisions happen if token gets lost",
      "(D) It only uses satellite signals; weather noise causes collisions"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "載波監聽多路存取（CSMA）的「先聽後發」心法及因信號傳播延遲（Propagation Delay）所導致的碰撞黑盒。",
      reviewRef: "對應學科：Ch6 Page 18 'CSMA: Carrier Sense Multiple Access'。 傳播延時使兩端無法在第一時間聽到對方已發包，從而跟進發出，撞毀線路上。",
      optionsAnalysis: {
        "A": "錯誤，聽都不聽是 Aloha 協定的行為。",
        "B": "正確，CSMA 規則為 'Listen before transmit'（聽了再說）。但因光電傳播存在延時（Propagation delay），一端起點發出後尚未傳抵對端，對端聽信道以為空閒隨即也發送，導致於信道中途「碰撞」。",
        "C": "錯誤，Token-ring 才有令牌環，非 CSMA 機制。",
        "D": "錯誤，一般區域網路協定，與外天空衛星無涉。"
      }
    }
  },
  {
    id: "q50",
    chapter: ChapterId.CH6,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "CSMA CD",
    questionText: "Why is CSMA/CD highly popular and successful in wired Ethernet, while CSMA/CA must be used in wireless Wi-Fi (802.11) networks instead?",
    options: [
      "(A) Wireless cards cannot support battery power for CD",
      "(B) In wireless, collision detection is hard due to active path attenuation and the 'hidden terminal problem', so collision avoidance is preferred",
      "(C) Wired systems have much higher propagation delay than wireless air channel",
      "(D) CSMA/CD is legally restricted only for telephone links"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "CSMA/CD 與 CSMA/CA 設計取捨：無線通道碰撞難測性與隱端問題（Hidden Terminal Problem）。",
      reviewRef: "對應複習：Ch6 WI-FI 碰撞避免。 無線網卡天線自發自收時，本地發射強度遠大於遠端接收強度，極難偵測微弱衝突；且受隱藏終點威脅。",
      optionsAnalysis: {
        "A": "錯誤，與電池耗能無本質限制干涉。",
        "B": "正確，隱端問題（Hidden terminal）與信號衰減阻止無線網卡精準邊發邊聽偵測 Collision，所以改採 CA 預約機制（AVOIDANCE）。",
        "C": "錯誤，有線傳播常與同級介質基本契合，且 CA 就是因空氣複雜度而生。",
        "D": "錯誤，法令對其無此不符學理的封建規約。"
      }
    }
  },
  {
    id: "q51",
    chapter: ChapterId.CH6,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "CSMA/CD propagation",
    questionText: "In CSMA/CD, if host A transmits a frame, and propagation delay to the furthest host B is d. What is the minimum frame size transmission time required on host A to ensure all possible collisions are completely detected by link nodes?",
    options: [
      "(A) Equals d",
      "(B) Equals 1.5 * d",
      "(C) Equals 2 * d",
      "(D) Equals 4 * d"
    ],
    correctAnswer: "C",
    explanation: {
      concept: "乙太網 CSMA/CD 要能偵測碰撞之最低訊框傳輸時間限制： $2 \\times$ 傳播延遲（ $2d$ / round-trip slot time）。",
      reviewRef: "對應學理：Ch6 'Ethernet CSMA/CD'。當 A 在時間點 $0$ 發出，極端情形：在即將抵達 $B$ （時 $d$）前一瞬間 $B$ 起頭發送。碰撞爆出後，衝突火花回彈傳回 A 本端已耗時 $2d$，此時 A 必須仍未發完大包才能精準捕捉，故發送時間 $\\ge 2d$。",
      optionsAnalysis: {
        "A": "錯誤，若只為 $d$，A 早在 $d$ 宣告發完，即便 $B$ 發射回震 A 也聽不見，會誤判為成功。",
        "B": "錯誤，未能覆蓋最壞回程總時延線上。",
        "C": "正確，極致嚴謹推導，發送時間最少得維持 $2d$ 往返時間長（Slot Time）。",
        "D": "錯誤，過寬，不符合極限最優代代要求。"
      }
    }
  },
  {
    id: "q52",
    chapter: ChapterId.CH6,
    type: QuestionType.MCQ,
    difficulty: Difficulty.HARD,
    topic: "Binary Exponential Backoff",
    questionText: "In Ethernet's binary exponential backoff algorithm, after experiencing the 4th consecutive collision, what is the set of integers from which a router randomly picks its backoff slot K?",
    options: [
      "(A) {0, 1, 2, 3}",
      "(B) {0, 1, ..., 7}",
      "(C) {0, 1, ..., 15}",
      "(D) {0, 1, ..., 31}"
    ],
    correctAnswer: "C",
    explanation: {
      concept: "二進位指數退避演算法（Binary Exponential Backoff）之隨機等待區間 $[0, \\dots, 2^n-1]$ 計算。",
      reviewRef: "對應：Ch6 Page 32 'Ethernet: CSMA/CD backoff'。 碰撞次數 $n=4$，故退避常數 $K$ 隨機取自 $[0, 2^n - 1]$。",
      optionsAnalysis: {
        "A": "錯誤，這是第 2 次碰撞對應的取值集合範疇限制。",
        "B": "錯誤，對應第 3 次碰撞。",
        "C": "正確， $n=4 \\rightarrow [0, \\, 2^4-1] = [0, \\, 15]$。包含 16 個離散槽點整數。",
        "D": "錯誤，對應第 5 次碰撞。"
      }
    }
  },
  {
    id: "q53",
    chapter: ChapterId.CH6,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "ARP Same Subnet",
    questionText: "How does ARP (Address Resolution Protocol) operate when a sender resolved a destinating MAC address in the SAME subnet, and what is the broadcast target?",
    options: [
      "(A) Sends a unicast query to the router; destination router returns unicast ARP reply",
      "(B) Broadcasts an ARP query containing destination IP (to FF-FF-FF-FF-FF-FF); target node unicasts back its MAC address",
      "(C) Floods the DNS server directly to look up MAC mapping database",
      "(D) Uses TCP三次握手 to retrieve physical mac values"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "同網段 ARP 運作二部曲：廣播請求、單播響應。",
      reviewRef: "對應複習：Ch6 Page 37 'ARP: Address Resolution Protocol'。 「誰有 IP X？請向我回報你的 MAC。」目標聽到即一對一單播回覆。",
      optionsAnalysis: {
        "A": "錯誤，ARP Query 當下因無 Dst MAC，不可能是 Unicast，必須走 L2 廣播（FF-FF-FF-FF-FF-FF）。",
        "B": "正確，ARP 請求為 Broadcast 送達同網網段內所有人；ARP 響應只有一對一單播（Unicast）回來，省下本端頻寬費。",
        "C": "錯誤，DNS 管理域名，ARP 解析實體 MAC，井水不犯河水。",
        "D": "錯誤，ARP 載在 Link Frame，完全不用也不可能套用 TCP 機制運前置握手。"
      }
    }
  },
  {
    id: "q54",
    chapter: ChapterId.CH6,
    type: QuestionType.SHORT,
    difficulty: Difficulty.HARD,
    topic: "Different Subnet ARP",
    questionText: "Discuss the step-by-step header changes when Host A sends a packet to Host B situated in a DIFFERENT subnet, separated by router R.",
    correctAnswer: "A encapsulates packet with Destination MAC of R's interface. Router R unpacks, changes Source MAC to R's egress MAC, Destination MAC to B's MAC.",
    explanation: {
      concept: "跨網段子網傳遞下，實體乙太網訊框首部中 Src/Dst MAC 的逐躍（Hop-by-hop）變換與 IP 固定不變特性。",
      reviewRef: "對應複習之精華要害：Ch6 Page 41-45 'ARP: routing to another LAN'。",
      perfectTemplate: "【100分答題模板】\n1. **IP 鐵律保持**: 沿途途中，源端 IP ($IP_A$) 與目的端 IP ($IP_B$) **永久、絕對保持不變**！\n2. **第一跳封裝 (LAN A)**: Host A 發現 B 在外網，將訊框的目的 MAC 封裝為本網段連接 A 的**路徑路由器閘道 R 埠口的 MAC** ($MAC_{R-in}$)，源 MAC 為 $MAC_A$。透過 ARP 本地解析出來。\n3. **第二跳轉化 (LAN B)**: 路由器 R 剝理訊框、提取 IP 包，重算出 TTL 後，在出口端**重新封裝一個全新的 L2 訊框**：目的 MAC 寫成 Host B 物理 MAC ($MAC_B$)，源 MAC 改寫成路由器出站口 MAC ($MAC_{R-out}$)。\n- **關鍵字**: Payload IP Constant, Gateway MAC encapsulated, Router Re-encapsulation, Dynamic MAC hop translation."
    }
  },
  {
    id: "q55",
    chapter: ChapterId.CH6,
    type: QuestionType.MCQ,
    difficulty: Difficulty.EASY,
    topic: "Ethernet structure",
    questionText: "Ethernet provides which of the following combined transmission services in terms of connection state and reliability?",
    options: [
      "(A) Connectionless and fully reliable with local TCP-like handshakes",
      "(B) Connectionless and unreliable (no local acknowledgments)",
      "(C) Connection-oriented and highly reliable",
      "(D) Fully authenticated with encrypted MAC address lists"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "乙太網（Ethernet）典型不穩定與無連接特徵（Connectionless & Unreliable）。",
      reviewRef: "對應：Ch6 Page 45 'Ethernet'。 有線網故障率小，無須耗費巨量開銷做 Layer 2 可靠確認，丟包或壞字元直接扔，留給上層 TCP 糾正。",
      optionsAnalysis: {
        "A": "錯誤，連結層絕不在每幀裝類似 TCP ACK 的複檢對帳窗連線手續。",
        "B": "正確，乙太網無本地握手（Connectionless），CRC 查出錯直接默默丟掉不補發，不給 ACK，屬於 Unreliable（無可靠度保証）。",
        "C": "錯誤，與乙太網路設計初衷相反。",
        "D": "錯誤，MAC 地址無內置政治性加密，純屬硬件出廠扁平字串列。"
      }
    }
  },
  {
    id: "q56",
    chapter: ChapterId.CH6,
    type: QuestionType.MCQ,
    difficulty: Difficulty.EASY,
    topic: "Hub vs Switch",
    questionText: "What is the primary difference in operational domain and collision isolation between a Hub and a Switch?",
    options: [
      "(A) Hub works at Network Layer; Switch works at Transport Layer",
      "(B) Hub is a physical layer repeater that broadcasts everything (one collision domain); Switch is active at Link layer and isolates collision domains on each port",
      "(C) Hub uses encryption; Switch is open code design",
      "(D) Switch blocks all ARP queries while Hub allows them"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "集線器（Hub）與交換器（Switch）工作級別與衝突網域（Collision Domain）隔離差異。",
      reviewRef: "對應：Ch6 Page 48 'Hubs vs. Switches'。 Hub 傻爪廣播（1大網碰撞域）；Switch 按表轉發（Port-level 衝突阻斷）。",
      optionsAnalysis: {
        "A": "錯誤，工作級比正常定位反，Hub 屬 Layer 1，Switch 屬 Layer 2。",
        "B": "正確，Hub 乃實體層放大器，收到任何 bit 暴力洪泛所有口（Collision 域連打）；Switch 智慧快取 MAC 表，各埠口物理隔離各自的 Collision 域。",
        "C": "錯誤，無加密學關係限制。",
        "D": "錯誤，兩者皆為二層傳輸設備，必放行 ARP。"
      }
    }
  },
  {
    id: "q57",
    chapter: ChapterId.CH6,
    type: QuestionType.SHORT,
    difficulty: Difficulty.MEDIUM,
    topic: "Switch self learning",
    questionText: "Discuss the Switch Self-Learning principle showing how the switch table is built automatically.",
    correctAnswer: "Switch records incoming source MAC and port of received frames. Future packets destined to this MAC are unicast to that port.",
    explanation: {
      concept: "交換器自學（Self-Learning）機制建表之流程。",
      reviewRef: "對應：Ch6 Page 52 'Switch: Self-Learning'。 「無須網管介入，即動能編組 MAC-Port 索引表。」",
      perfectTemplate: "【100分答題模板】\n1. **監聽來源**: 當交換器在第 $7$ 埠口，收到一個源 MAC = $MAC_A$ 的乙太網路訊框，交換器大腦會立即在本地表格寫入一條註冊映射：$[ MAC_A \\rightarrow \\text{Port } 7, \\, T ]$。\n2. **查表分流**: 當以後有第三人要發包給 $MAC_A$ 時，交換器查表得知其已被歸位第 $7$ 口，遂即將該封包**精準單播（Unicast）**送出 $7$ 號口，避免其他無關埠口遭受垃圾覆蓋蹂躪。\n3. **時效老化 (Aging)**: 表項附屬 TTL。超時未活化即自動抹除，確保搬遷時開關仍行自學更新。\n- **關鍵字**: Source MAC Record, Active Port Sniffing, Selective Forwarding, Aging TTL."
    }
  },
  {
    id: "q58",
    chapter: ChapterId.CH6,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "Switch Forwarding Actions",
    questionText: "What are the three forwarding actions executed by a Switch when a frame destined for MAC address X arrives at port Y?",
    options: [
      "(A) Send, Drop, Encrypt",
      "(B) Forwarding (unicast), Filtering (discard), and Flooding (broadcast to all except source)",
      "(C) Read, Write, Format",
      "(D) Open, Close, Hold"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "交換器查表轉發時的三大策略行為：轉發（Forwarding）、過濾（Filtering）、洪泛（Flooding）。",
      reviewRef: "對應：Ch6 Page 51 'Switch Forwarding'。 查表命中且不同口：Forward；查表命中且同埠：Filter；查表未命中：Flood。",
      optionsAnalysis: {
        "A": "錯誤，無 L2 本地專屬硬體學術分流術語。",
        "B": "正確，分別為查明即打（Forward）；在同埠內默默丟掉不必出閘（Filter）；找不到人就全家大喊廣播洪泛（Flood）。",
        "C": "錯誤，混淆計算機系統內核文件檔案系統命令。",
        "D": "錯誤，無大腦動作映射。"
      }
    }
  },
  {
    id: "q59",
    chapter: ChapterId.CH6,
    type: QuestionType.MCQ,
    difficulty: Difficulty.MEDIUM,
    topic: "Switch vs Router",
    questionText: "Compare the essential characteristics of Switches and Routers. Which statement is correct?",
    options: [
      "(A) Switches are layer 3 and run Dijkstra; Routers are layer 2 and build flat MAC cards",
      "(B) Switches operate at Layer 2 and forward based on MAC addresses; Routers operate at Layer 3 and route based on IP addresses",
      "(C) Switches require manual configuration for IP networks; Routers are plug-and-play to find MACs",
      "(D) Switches are only for long-distance optical trunk; Routers are for home WiFi only"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "交換器（Switch）與路由器（Router）核心分工與運作層（Layer 2 vs Layer 3）之根本差異。",
      reviewRef: "對應複習指南：Ch6 Page 55 'Switches vs. Routers'的黃金對照表。",
      optionsAnalysis: {
        "A": "錯誤，兩者二維層級剛好劃分顛倒。",
        "B": "正確，交換器為 L2 電路產品（插拔即自學自轉）；路由器為 L3 計算層大腦（看 IP 表聚類算大路）。",
        "C": "錯誤，交換器天生即即插即用（Plug-and-play）；路由器多需要精細管理網關 IP 子遮罩宣告。",
        "D": "錯誤，這混淆了硬體市場地理部署特質範圍。"
      }
    }
  },
  {
    id: "q60",
    chapter: ChapterId.CH6,
    type: QuestionType.MCQ,
    difficulty: Difficulty.EASY,
    topic: "VLAN Motivation",
    questionText: "What is the primary motivation for implementing Virtual Local Area Networks (VLANs)?",
    options: [
      "(A) To replace all hardware switches with software interfaces to cut cost",
      "(B) To isolate broadcast domains, optimize bandwidth, and enforce administrative grouping over the same physical cabling",
      "(C) To double the speed of Ethernet cables dynamically",
      "(D) To encrypt all internet access using VPN"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "虛擬區域網路（VLAN）導入主因：隔離廣播網域、健全組織網格。 否則全網大一統廣播會造成頻寬重傷。",
      reviewRef: "對應複習：Ch6 Page 58 'VLANs'。 物理一統而虛擬分權，多使用單一交換器虛設多個 Broadcast Boundary。",
      optionsAnalysis: {
        "A": "錯誤，VLAN 同樣深深依賴高速乙太網交換芯片配置。",
        "B": "正確，隔離巨型辦公室沒用的 ARP/廣播流量洪泛風暴（Isolate broadcast domains），落實不同部門安全壁壘。",
        "C": "錯誤，物理網線媒介帶寬不受軟體設定隔離而能增肥。",
        "D": "錯誤，VLAN 與網路層端端 VPN 隧道加密無屬性相加關係。"
      }
    }
  },
  {
    id: "q61",
    chapter: ChapterId.CH6,
    type: QuestionType.MCQ,
    difficulty: Difficulty.HARD,
    topic: "802 1Q trunk",
    questionText: "How does the IEEE 802.1Q standard handle multi-switch VLAN routing over a physical Trunk Port?",
    options: [
      "(A) By compressing the packet payload into half size",
      "(B) By inserting a 4-byte VLAN tag (containing a 12-bit VLAN ID) into the Ethernet frame header",
      "(C) By allocating a dedicated fiber optic line to each VLAN group",
      "(D) By routing all VLAN traffic via the default local router first"
    ],
    correctAnswer: "B",
    explanation: {
      concept: "802.1Q 幹線協定（Trunk / Tagging）的工作原理。",
      reviewRef: "對應：Ch6 Page 60 '802.1Q VLAN Tagging'。 為了讓不同 VLAN 幀走同一根 Trunk 線，必須在 Ethernet 幀首中強插 Tag 作印章區分。",
      optionsAnalysis: {
        "A": "錯誤，無這項低速壓縮動作要求。",
        "B": "正確，在 MAC Src 與 Type/Len 間強行插入一套 $4\\text{-byte}$ 的 $802.1Q\\text{ Tag}$，內藏 $12\\text{-bit}$ 寬的 VLAN ID。 可完美支持多達 4096 個獨立局部虛網隔離。",
        "C": "錯誤，Trunk 就是為了解決「不想多拉線，一根共用」的線路成本問題才誕生的。",
        "D": "錯誤，同交換器內不同埠，直接在二層 Trunk 接應區隔轉發，不需要特意上發至三層 Router 繞路耗能。"
      }
    }
  }
];
