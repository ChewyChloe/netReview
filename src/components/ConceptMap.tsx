import React, { useState } from "react";
import { 
  ArrowRight,
  CheckCircle2, 
  Layers, 
  MapPin, 
  Network, 
  Globe, 
  ShieldAlert, 
  HelpCircle, 
  Zap, 
  Activity, 
  Cpu, 
  Radio,
  FileText,
  ChevronRight,
  BookOpen,
  Search,
  Eye,
  Check
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
      "**跨 AS 宣告 (eBGP/iBGP)**：BGP Session 運行在 TCP Port 179 上。eBGP 宣告外部 AS-PATH 可達性，iBGP 則在系統內傳播。利用「Hot Potato Routing」路由政策：一旦得知多個跨区出口，OSPF 計算出內部哪條代價低，立刻丟該出口！",
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
    icon: CheckCircle2,
    scope: "L2",
    techs: ["Switch Table", "Self-Learning", "Host Delivery"],
    details: [
      "**交換器自學自轉**：最後子網交換器只看 MAC。透過 `MAC - Port - Timestamp` 的**自學機制 (Self-Learning)**，若命中則單播指向 Host B；若查無則在本 Subnet 進行氾洪廣播 (Flooding)。",
      "**Host B 解封**：Host B 網卡收到訊框，比對其 Dst MAC 吻合，執行 L2 CRC 奇偶校驗無誤，遂開箱扒去 L2，將 IP Datagram 送上 L3；L3 驗對無誤送交 L4 TCP/UDP 組裝、送往套接字 (Socket) 收尾！冒險圓滿完成！"
    ]
  }
];

interface MindmapNode {
  id: string;
  label: string;
  chapter: 4 | 5 | 6;
  category: string;
  shortDesc: string;
  slideRef: string;
  details: string[];
  examQuestion?: {
    q: string;
    options?: string[];
    answer: string;
    explanation: string;
  };
}

const MINDMAP_NODES: MindmapNode[] = [
  {
    id: "router-arch",
    label: "路由器內部 & 緩衝設計定理",
    chapter: 4,
    category: "4.1 路由器架構",
    slideRef: "Chapter 4: Slides 13, 28, 29, 31",
    shortDesc: "解析路由器內部的三種交換結構（記憶體、匯流排、交叉矩陣）與極小化輸出排隊丟包的緩衝計算公式。",
    details: [
      "**交換矩陣分期**：第一代是記憶體 (Memory) 交換；第二代使用共用匯流排 (Bus) 會產生總線衝突限制；第三代為多段交叉矩陣 (Interconnection network/Crossbar)，支援極佳並行轉發。",
      "**Buf 緩衝經典公式**：Rule of thumb $B = RTT \\times C$。若有多條流則為 $B = (RTT \\times C) / \\sqrt{N}$ ，這是骨幹網防止 Bufferbloat 主要依憑準則。"
    ],
    examQuestion: {
      q: "一個輸出埠接收來自三個不同 Priority 優先級流量。若使用 Weighted Fair Queuing (WFQ)，其最核心優勢為何？",
      options: [
        "A. 高優先級流量將完全霸佔並獨享所有輸出輸出頻寬",
        "B. 所有流將以完全平等的 fair 模式不分優先級輪流發送",
        "C. 每個 Class 流量皆依照其 WI 權重配額獲取頻寬承諾，避免飢餓發生",
        "D. 封包會進行自動切片壓縮，大幅提速發送效率"
      ],
      answer: "C",
      explanation: "對應考題第 3 題。WFQ (加權公平佇列) 保證每個類別(Queue)能分到 wij/sum(wj) 比例的頻寬份額，提供最低服務品質(QoS)保證，不會像絕對優先級(PQ)那樣使低優先級的流面臨飢餓發不出去।"
    }
  },
  {
    id: "queuing-policies",
    label: "佇列與封包排程 (WFQ)",
    chapter: 4,
    category: "4.2 流量排程管制",
    slideRef: "Chapter 4: Slides 33-36",
    shortDesc: "解釋 FCFS, Priority, Round Robin 與加權公平排程 (Weighted Fair Queuing) 下的頻寬配額算法。",
    details: [
      "**FCFS/FIFO**：先進先出，完全順序，沒有優先級區分。",
      "**Round Robin (RR)**：循環公平掃描各類佇列，有就發一個，保證類別平等。",
      "**Weighted Fair Queuing (WFQ)**：帶有加權基因的 RR，每個活躍類別 i 獲得保障頻寬比例份額 $w_i / \\sum w_j$。"
    ],
    examQuestion: {
      q: "若 WFQ 系統中，有類別 1、2、3 權重分別為 3, 2, 1。當總頻寬 C = 12 Mbps，且各類別均有源源不絕的封包準備輸出，類別 2 可分配之保證頻寬為多少？",
      options: [
        "A. 2 Mbps",
        "B. 4 Mbps",
        "C. 6 Mbps",
        "D. 8 Mbps"
      ],
      answer: "B",
      explanation: "解法：頻寬份額分配。分母總和為 3 + 2 + 1 = 6。類別 2 的權重佔 2 份，其分享頻寬為 12 Mbps * (2/6) = 4 Mbps。"
    }
  },
  {
    id: "ip-protocol",
    label: "IPv4 結構與 CIDR 彈性定址",
    chapter: 4,
    category: "4.3 IP 網路定址",
    slideRef: "Chapter 4: Slides 41, 44-46",
    shortDesc: "介紹 32-bit 階層式無類別域間路由定址法，寫作 a.b.c.d/x 格式，x 為子網遮罩長度。",
    details: [
      "**IP 標頭開銷**：標準 IPv4 封包首部長度 20 bytes，若與傳送層 TCP（也是 20 bytes）搭配，端到端會產生 40 bytes 的首部 Overhead。",
      "**CIDR 彈性定址**：不再使用類別排班，而是使用 `/x` 彈性前綴主機，可用的主機 IP 容量為 $2^{32-x} - 2$ (須扣除特殊用網路號和局域網廣播 IP)。"
    ],
    examQuestion: {
      q: "在大型網路中，若完全不使用 IP 位址階層結構，僅倚賴 Flat (平面型) MAC 地址來做全球路由轉發，會發生什麼最致命的問題？",
      options: [
        "A. 封包因無法檢碼校驗，會在物理信道中完全遺失",
        "B. 路由器無法進行 IP 首部的 TTL 扣減，導致封包陷入永無止境的環路",
        "C. 路由表和定址管理將完全崩潰，因為 MAC 地址沒有階層性，無法進行子網段劃分與路由彙整",
        "D. NAT 裝置無法對 MAC 地址實施埠口轉換"
      ],
      answer: "C",
      explanation: "對應考題第 14 題。IP位址是階層式編碼（如同郵遞區號），能把相似前綴的龐大設備彙整為一條 CIDR `/20` 路由宣告丟給骨幹，這才使骨幹轉發表行得通；若用物理的 MAC 平面地址，全網路由器必須記錄全球數百億設備的具體指向，路由表直接引爆崩潰。"
    }
  },
  {
    id: "dhcp-protocol",
    label: "DHCP 主機聯網動態配置",
    chapter: 4,
    category: "4.4 主機自動配置",
    slideRef: "Chapter 4: Slides 48-52",
    shortDesc: "解釋 DHCP 為新加入主機發配四大重要 IP 資訊的階段以及 UDP 四部曲流程。",
    details: [
      "**UDP 廣播模式**： Discover (客->廣) -> Offer (伺->廣) -> Request (客->廣) -> ACK (伺->廣)。",
      "**發配的四大金剛**：新主機會同時拿到 **當前配發 IP**、**Subnet Mask**、**Default Gateway IP (第一跳)** 以及 **DNS 伺服器 IP**。"
    ],
    examQuestion: {
      q: "當一主機剛加入網路，其發出的第一個 DHCP Discover 廣播封包中，其 L3 IP Header 的 源IP 與 目的IP 分別為什麼？",
      options: [
        "A. 源: 127.0.0.1, 目: 255.255.255.255",
        "B. 源: 0.0.0.0, 目: 255.255.255.255",
        "C. 源: 0.0.0.0, 目: 192.168.1.254",
        "D. 源: DHCP分配IP, 目: 本地閘道IP"
      ],
      answer: "B",
      explanation: "主機目前尚未取得邏輯學籍(IP)，所以源 IP 寫 0.0.0.0 (未指定)；為了在本地網路中尋找 DHCP Server，目的 IP 使用全球標準 L3 廣播地址 255.255.255.255。"
    }
  },
  {
    id: "nat-traversal",
    label: "NAT 內外網映射與埠號翻轉",
    chapter: 4,
    category: "4.5 網路位址轉換",
    slideRef: "Chapter 4: Slides 59-62",
    shortDesc: "解決全球 IP 短缺的關鍵方案。使用私有網段搭配邊緣路由器的源 Port 與實體埠翻轉儲存。",
    details: [
      "**三大私網位址**：`10.x.x.x/8`, `172.16.x.x/12`, `192.168.x.x/16` 專供局域私網無限複用。",
      "**NAT Mappings**：NAT 網關會將 outgoing 私網 `(Lan IP, Lan Port)` 替換成一個全球唯一的 `(Wan IP, NAT Port)` 寫入對照表，使外部回覆時能原路精準翻譯遞送。"
    ],
    examQuestion: {
      q: "一 NAT 路由器目前將內部主機 192.168.1.10:4321 映射至公共公網地址 140.112.1.5:62000。當該內部主機改用「另一個不同的 Source Port」(例如 192.168.1.10:1234) 發起一個新連線時，下列何者正確？",
      options: [
        "A. 外部伺服器仍會回復到舊的 62000 埠口，不需更新",
        "B. NAT 路由器必須為這個新埠口建立並維護一條全新的轉譯映射對照表",
        "C. 只要內部主機 IP 不變，外部連線用的對應 Port 就無所謂可以自由共用",
        "D. NAT 不能同時支援來自同一個內網主機的多個對外連接"
      ],
      answer: "B",
      explanation: "對應考題第 5 題。NAT (Network Address Translation) 依靠 Table 對應。每一個獨立的連接(由源Port界定)，NAT 路由器在轉發時都一定要分發建立一條獨立的 Mapping 對應紀錄，才能做精確的封包雙向轉譯導流。"
    }
  },
  {
    id: "ipv6-transition",
    label: "IPv6 定址與雙疊瀑隧道技術",
    chapter: 4,
    category: "4.6 IPv6 改進",
    slideRef: "Chapter 4: Slides 64-69",
    shortDesc: "擴充至 128-bit 地址。利用 Tunneling (隧道機制) 讓 IPv6 封包包裝為 L4 負載穿越舊有 IPv4 骨幹鏈路。",
    details: [
      "**IPv6 的精簡**：取消了 Checksum 碼以加速三層硬體轉發、禁止在中間路由器上進行分片/重組、取消 Options 選項。",
      "**隧道機制 (Tunneling)**：當兩邊 IPv6 路由器隔著一片 IPv4 汪洋，直接在邊界將整個 IPv6 封裝到 IPv4 標頭的 Data Payload 中發出，如同建起邏輯暗道。"
    ]
  },
  {
    id: "generalized-forwarding",
    label: "通用轉發與 SDN 控制 entries",
    chapter: 4,
    category: "4.7 generalized 轉發",
    slideRef: "Chapter 4: Slides 72-76",
    shortDesc: "介紹 Match + Action 的 OpenFlow 行為。用一筆 Entry 取代傳統的 Destination-based 轉發。",
    details: [
      "**三合一欄位**：Match 匹配欄 (包含 L2 MAC、L3 IP、L4 Port 六種以上)、Action 行為欄欄、Stats 流動統計 counters。",
      "**OpenFlow 多功合一**：可藉由不同的 Entries 策略，把同一個 Switch 邏輯上當成 Router (匹配最強前綴)、Switch (匹配目的 MAC)、Firewall (匹配 L4 嫌疑埠丟棄) 或是 NAT。"
    ]
  },
  {
    id: "dijkstra-routing",
    label: "Dijkstra 域內 LS 算路 (Q19)",
    chapter: 5,
    category: "5.1 狀態路由算路",
    slideRef: "Chapter 5: Slides 96-104",
    shortDesc: "集中式 Link-State 演算法。全網所有點同步掌握拓撲，路由器建構自己為根的最短路徑樹與 OSPF 轉發表。",
    details: [
      "**演算法核心式**： $D(v) = \\min(D(v), D(w) + c_{w,v})$，並把前驅 parent 指向跳板 w。",
      "**複雜比拼**：一般 Dijkstra 搜尋演算法複雜度為 $O(n^2)$，經過 heap/priority queue 排序後提速至 $O((n+e)\\log n)$。"
    ],
    examQuestion: {
      q: "手算重點對帳：在 Dijkstra 計算中，起點為 x。當 N'={x, v, y, w, u} 時，若 u 對剩餘非 N' 的節點 t 進行 path 鬆弛計算。若 D(u)=7且 c_{u,t}=1，此時 D(t) 的更新結果應為多少？（原 D(t) = 9）",
      options: [
        "A. 9 (維持不變 via v)",
        "B. 8 (更新為 8, 前驅記錄為 u)",
        "C. 7 (更新為 7, 前驅記錄為 v)",
        "D. 無法更新，因為 u 已在確定集中"
      ],
      answer: "B",
      explanation: "對應手算題第 19 題的關鍵步驟。D(t) = min(9, D(u) + c_{u,t}) = min(9, 7+1) = 8。因為 8 比原本的 9 小，故 D(t) 成功被縮小並改寫為 8，其 predecessor 變更記錄為 u。"
    }
  },
  {
    id: "distance-vector",
    label: "Distance Vector 接收演練 (Q20)",
    chapter: 5,
    category: "5.2 距離向量遞迴",
    slideRef: "Chapter 5: Slides 115-118",
    shortDesc: "分散式、迭代、非同步演算法。路由器僅從相連鄰居處收取 D_v 距離表，套用 Bellman-Ford 漸漸靠攏收斂。",
    details: [
      "**Bellman-Ford 式**： $D_x(y) = \\min_{v} \\{ c_{x,v} + D_v(y) \\}$，與全部相連鄰居進行可能性的評估。",
      "**計數到無窮大 (Count-to-Infinity)**：壞消息在 DV 中傳得慢，常造成鄰居間「路由套娃螺旋上漲」悲劇。解法依靠毒性反轉 (Poisoned Reverse) 宣告「你經我到y的路代價為inf」來打破無限套環。"
    ],
    examQuestion: {
      q: "當節點 z 接收到鄰居 v 的距離向量，並準備更新到目標 y 的距離 D_z(y)。已知 c_{z,v}=3，且 v 的宣稱向量 D_v(y)=4。若原本的 D_z(y) = inf，則更新後的 D_z(y) 為何？",
      options: [
        "A. 3",
        "B. 4",
        "C. 7",
        "D. 仍然是 inf"
      ],
      answer: "C",
      explanation: "對應考題第 20 題的第一步。Z 收到了 V 的通知。Z 計算到 y 的路經由 v 點橋接，代價為直接距離 c_{z,v}(3) + v 報稱的距離 D_v(y)(4) = 7，成功縮短並將下一跳指向 v。"
    }
  },
  {
    id: "ospf-routing",
    label: "OSPF 階層架構與骨幹分區",
    chapter: 5,
    category: "5.3 最短優先協定",
    slideRef: "Chapter 5: Slides 139-141",
    shortDesc: "OSPF 經典自治系統內協定。運用 MD5 訊息認證防止篡改，具有兩級多區域(Area)路由隔離特點。",
    details: [
      "**OSPF 安全特性**：所有 OSPF 廣播訊息均有 MD5 散列驗證 (MD5 hash authentication)，防止非法入侵宣告不實路由。",
      "**階層式多區域**：分為 Backbone (Area 0) 與局部區域。各一般區域由區域邊界路由器 (ABR, Area Border Router) 與骨幹 Area 0 進行彙整連接。"
    ],
    examQuestion: {
      q: "在 OSPF 協定中，如果將一個大型企業網路劃分為多個獨立的區域（Areas），其最主要的系統設計目的為何？",
      options: [
        "A. 將全部路由計算的工作完全外包給每個一般單獨主機以減輕壓力",
        "B. 可支持更多不同的自治系統編號和各類三層邊界路由的多點映射翻譯",
        "C. 為了縮減實體傳輸延遲並同時提供更全面、高級的封包加密功能",
        "D. 限制 Link-state 廣播訊息僅在自身區域內傳播，減少網路廣播流量與任何拓撲變更對外部的衝擊"
      ],
      answer: "D",
      explanation: "對應考題第 7 題。Link-state 需要全區域路由器維護相同拓撲圖，若不分區，十萬台設備跑 Dijkstra 記憶體會溢出。劃分區域使 LS 廣播不擴散，ABR 只對 Area 0 宣告彙整距離，既節省廣播流量又隔絕了局部斷線造成的震盪震動衝擊。"
    }
  },
  {
    id: "bgp-routing",
    label: "BGP 多路 AS 宣告與選路政策",
    chapter: 5,
    category: "5.4 自治系統邊界",
    slideRef: "Chapter 5: Slides 143-155",
    shortDesc: "BGP (Border Gateway Protocol) 為全球跨域互聯之魂。利用 TCP Port 179 Session 交換路徑屬性 (Prefix + Attributes)。",
    details: [
      "**路徑防環(AS-PATH)**：當路由宣告跨域傳輸時，會在 AS-PATH 寫下經過的每一個 AS 號（如 AS2, AS3）。路由器若發現收到的路由包含自家 AS 號會直接拒絕（Reject），實現了無 loops 強防護。",
      "**路由首選順序**：Local preference 最優先 (政策控制大於一切) -> 最短 AS-PATH -> 最靠近 Next-hop 的熱馬鈴薯出口。"
    ],
    examQuestion: {
      q: "當跨自治系統進行路由決策時，下列關於邊界網關協定 (BGP) 選路特性的敘述何者正確？",
      options: [
        "A. 始終無條件選擇跳數(Hop count)最短的那個路徑作為發送依據",
        "B. BGP 路由器必須每隔 5 秒鐘向全世界所有其他 peer 發送一次完整路由認證表",
        "C. 運行大量由管理員自訂的「進出口政策 (Routing Policies)」，決定是否接受或宣告某個 prefix 及其路徑屬性",
        "D. 各個 BGP 路由器僅記錄內部私有拓撲，完全不跟外界其他自治系統交互"
      ],
      answer: "C",
      explanation: "對應考題第 8 題。BGP 是商務與防禦政策控制的路由協定而非物理耗損計算。它利用 import/export policy 對收到的路徑(AS-PATH)直接審查過濾，在政治或商務上不能借道、不能承載旁路流量的便直接 Decline 跳過， policy 的權重大於一切物理代價。"
    }
  },
  {
    id: "sdn-controller",
    label: "SDN 集中式控制與 API 切割",
    chapter: 5,
    category: "5.5 軟體定義網路",
    slideRef: "Chapter 5: Slides 164-170",
    shortDesc: "將 Data plane 與 Control plane 徹底解耦。利用控制器下發流表，提高全局路由最佳化的靈活度。",
    details: [
      "**南向界面 (Southbound API)**：控制層對下控制硬體 switches 的協定，如 OpenFlow、SNMP。",
      "**北向界面 (Northbound API)**：控制層對上提供給網路應用(Routing, Firewall, Load-Balancer)調用的 API，最常用 RESTful/Intent 形式。"
    ],
    examQuestion: {
      q: "在大型分散式 SDN 網絡中，若採用「多個協調控制器 (Multi-controller)」的架構，此時最關鍵、最具挑戰性的技術難題是什麼？",
      options: [
        "A. 控制器太多導致底下的主機全部失去動態獲配 IP 的能力",
        "B. 開放的 Web 伺服器再也無法進行 3-Way 手腳握手",
        "C. 每個 physical switch 都必須獨自執行 Dijkstra OSPF 計算，浪費CPU",
        "D. 各控制器間的控制決策必須強同步和一致性維護，否則極易引發轉發衝突和政策矛盾"
      ],
      answer: "D",
      explanation: "對應考題第 9 題。當有多個 Controller 分散在各處發布流表，此時『全局狀態數據庫』的分散式同步難度極高，一旦同步不及時，兩個控制器可能下發矛盾的 Rules，导致封包在兩個 switch 間來回 Ping-pong 環路。"
    }
  },
  {
    id: "icmp-traceroute",
    label: "ICMP 控制回覆 & Traceroute",
    chapter: 5,
    category: "5.6 網絡控制診斷",
    slideRef: "Chapter 5: Slides 179-180",
    shortDesc: "解釋 ICMP 的常見 Type 與 Code 在 Ping 與 Traceroute 中扮演的除錯與診斷職責。",
    details: [
      "**Traceroute 機制**：源端發送 TTL=1, 2, ... 的 UDP 封包，中間路由器發現 TTL 被扣至 0 時，被迫丟棄並回發 `ICMP Type 11 Code 0 (TTL Expired)` 給源，源藉此記錄每一站的 IP 與 RTT 延時。",
      "**探測終點判斷**：發送時會故意挑選一個「完全沒有在跑服務的隨機 High UDP Port」，當最後目的地 Host B 收到時會返回 `ICMP Type 3 Code 3 (Port Unreachable)`，源收到便知道探測結束並停止。"
    ],
    examQuestion: {
      q: "一封包自 Host A 發出，途中經過三個實體路由器（R1->R2->R3），最後順利遞送至 Host B。下列關於 L2 MAC 與 L3 IP 標頭在每一跳（Hop）的更新敘述何者完全正確？",
      options: [
        "A. 每一跳到達時，L3 的 IP Header 裡的 IP 地址與 Payload 皆會被解析重寫，MAC 則保持不變",
        "B. 封包在旅途中 MAC 幀首部在每一跳都會被重新封裝代換，且 L3 IP 標頭中的 TTL 欄位在每經一路由器時均會遞減 1",
        "C. 只有最開始的第一個 Gateway 才會讀改 IP Header；剩下的路由器都只看 L5 應用層",
        "D. MAC 標頭的 Source MAC 會一路毫無更動保留至最尾端主機"
      ],
      answer: "B",
      explanation: "對應考題第 15 題。L3 端到端傳遞：IP 內容及終點始終不變，但代表封包生命週期的 TTL 會扣減（以防止在環路中無限循環轉圈）；而 L2 是單跳 Hop 遞送：每過一個 Router，都要剝除舊訊框、封裝上下一跳 R 的新 MAC 頭（Hop-by-hop MAC rewrite）。"
    }
  },
  {
    id: "error-detection",
    label: "鏈路偵錯 parity ✕ Checksum ✕ CRC",
    chapter: 6,
    category: "6.1 鏈路偵錯校驗",
    slideRef: "Chapter 6: Slides 191-197",
    shortDesc: "對比 L2 各種物理環境除錯技術。重點包含 Parity bit、網際網路 Checksum 與 CRC 模二長除。",
    details: [
      "**二維奇偶同位 (2D Parity)**：不僅能發現特定行/列的奇偶變異，更能精確找到交叉交點位元直接進行 **Bit-error Correction (糾錯)**，無需重傳封包。",
      "**CRC 拼接碼 ⟨D, R⟩**：用以在網卡晶片進行高通量校驗。用模二 XOR 的不進借位特性求取餘數 R，併入發射。整除無餘則代表完美。"
    ],
    examQuestion: {
      q: "進行 CRC 校驗。假設生成除數多項式式 G = 1001，且傳送原始數據 D = 11000111010。經模二直式長除求算，所得的餘數校驗碼 R 值為多少？",
      options: [
        "A. 110",
        "B. 111",
        "C. 011",
        "D. 101"
      ],
      answer: "C",
      explanation: "對應考題第 18 題與 Simulators 中的實算。G 的長度為 4 碼，所以 r = 3。將 D 補 3 個零變為 11000111010000 進行模二除算，最終的最末尾 3 位餘數為 011。符合 C。"
    }
  },
  {
    id: "multiple-access",
    label: "廣播通道與多元存取控制 (MAC)",
    chapter: 6,
    category: "6.2 多路介接協定",
    slideRef: "Chapter 6: Slides 202-214",
    shortDesc: "探討共享物理媒體時，TDMA/FDMA/CDMA (劃分)、CSMA (隨機存取) 與輪巡、權杖傳遞(輪流型)三大類。",
    details: [
      "**頻道剖分式**：TDMA 依時間切片，但在離網、低頻寬利用時會造成多個 Slots 無人使用造成 Idle 浪費。",
      "**輪流型(Taking Turns)缺點**：Polling 需要中央控制器，會產生輪詢開銷、延遲與 Central single point of failure (中央單點崩潰問題)；Token Passing 則有權杖丟失難重啟、持有輪等開銷。"
    ]
  },
  {
    id: "mac-vs-ip",
    label: "MAC ✕ ARP 子網著陸黏合",
    chapter: 6,
    category: "6.3 鏈路定址轉譯",
    slideRef: "Chapter 6: Slides 218-224",
    shortDesc: "探究 48-bit 物理層 MAC 位址之可攜性，並剖析 ARP 作為 L3 IP 往本地 L2 實體 MAC 綁定轉譯快取表。",
    details: [
      "**ARP 廣播查閘**：發送 ARP Request 時採用 L2 實體層廣播 `FF-FF-FF-FF-FF-FF`。若探查目標 IP 判定在外網，**ARP 絕對不會查目標主機 MAC，而是去查預設閘道器 (Default Gateway) 的 MAC 地址**！",
      "**ARP Table 快取機制**：ARP Table 用來暫存 `IP - MAC - TTL` 條目，TTL 約 10~20 分鐘淘汰。其維護在 $L2.5$ 的黏合層位。"
    ],
    examQuestion: {
      q: "當一 Host A 欲發送一個封包給「另一個不同 Subnet 網段主機 B」時。此時 Host A 的本地 ARP Table (快取表) 全空、還沒有建立。下列哪一項最正確地描述了當前網絡與鏈路層之交互行為？",
      options: [
        "A. 網路層直接手動偽造一個任意對方的 MAC 映射發出 package",
        "B. 鏈路層為了繞過 ARP，會強制直接填入廣播地址來直遞目的地",
        "C. 網路層會呼叫 ARP 模組去進行本地廣播 ARP Request，藉此解析、取得其「預設閘道 (Gateway)」接口 MAC 位址",
        "D. 鏈路層直接解析 B 的 IP，再封裝入 index 即可"
      ],
      answer: "C",
      explanation: "對應考題第 16 題。主機與目標在不同子網。按照 LPM 規則，下一跳為 Gateway。這時 ARP Table 為空，所以 Host A 必須調用 ARP 去查『預設閘道閘口』的 MAC 位址(Next-hop MAC)以便包入 Ethernet 訊框的第一跳，而不是去查目標主機 B 的 MAC 位址。"
    }
  },
  {
    id: "ethernet-vlans",
    label: "VLAN 流量隔離與 802.1q 標籤",
    chapter: 6,
    category: "6.4 虛擬鏈路隔離",
    slideRef: "Chapter 6: Slides 233-244, 254-258",
    shortDesc: "回顧 L2 switch 的 Self-learning 自學表轉發，並解碼使用 Port-based 劃分虛擬局域網與 802.1q 中繼跨線 Tagging。",
    details: [
      "**Switch 自學機制 (Self-Learning)**：根據進站訊框的 `Source MAC - Ingress Port` 組自動登記在 Switch Table (TTL=60s)。",
      "**Port-based VLAN**：能將一個 Switch 在軟體上分割成多個邏輯孤島，進行**廣播流量隔離 (traffic isolation)**，其安全性與定標性完全獨立。",
      "**八零二點一 Q 中繼 (802.1q Trunking)**：當多個 VLANs 要借用一條骨幹網線 (Trunk line) 與隔壁交換機交互，必須在原本的 Ethernet header 中，強制插入一個佔有 4 位的 **802.1q Tag Header** (內含其專屬 12-bit VLAN ID)，讓隔壁交換器收悉時能拆封按 VLAN ID 派遣入埠。"
    ],
    examQuestion: {
      q: "下列關於三層網絡層（Network Layer）與二層連結層（Link Layer）在傳輸範疇（Scope）上的差異描述，何者正確？",
      options: [
        "A. 網路層負責跨越多個異質網路的主機端到端(End-to-end)交付，而連結層則僅負責相鄰相鄰節點(Hop-by-hop)單一鏈路間的幀遞送",
        "B. 連結層為端到端(End-to-End)可靠傳輸的主力，而網路層一般只負責實體硬體網卡開機調製",
        "C. 兩層在技術體量上範疇完全相同，都在同一個局域網 LAN 內部運作",
        "D. 網路層不參與路徑尋算，專門包攬所有的雜訊奇偶與 CRC 長除檢校"
      ],
      answer: "A",
      explanation: "對應考題第 17 題。系統全局 Scope 比拼：網路層跨越多網，利用 IP 自治系統路由表把 datagram 送往地極；而 L2 連結層是區域性質，在 NIC（網卡晶片）上維護，把 frame 從當前網卡送到同一 Subnet 下的另一塊相鄰網卡 R，出了這個 local subnet 二層定址便失去作用。"
    }
  }
];

export const ConceptMap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"mindmap" | "journey" | "contrast">("mindmap");
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("router-arch");
  const [chapterFilter, setChapterFilter] = useState<"all" | 4 | 5 | 6>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter mindmap nodes
  const filteredNodes = MINDMAP_NODES.filter((node) => {
    const matchesChapter = chapterFilter === "all" || node.chapter === chapterFilter;
    const matchesSearch = node.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          node.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          node.shortDesc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesChapter && matchesSearch;
  });

  const selectedNode = MINDMAP_NODES.find((n) => n.id === selectedNodeId) || MINDMAP_NODES[0];

  return (
    <div className="space-y-6 font-sans text-slate-905 text-slate-900 select-none animate-fade-in" id="concept-map-container">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-slate-200 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl">
              <Layers className="h-5 w-5 text-blue-600 animate-pulse" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
              NTU 網路期末：三章整合大考全攻略
            </h2>
          </div>
          <p className="text-slate-500 text-xs mt-1 leading-relaxed">
            網際網路 L2, L3, L4 到跨界協定融會貫通。打破 Chapter 4、5、6 的高牆屏障。
          </p>
        </div>
        
        {/* Tab switchers */}
        <div className="flex bg-slate-50 border border-slate-200 p-1 rounded-xl shrink-0 overflow-x-auto scrollbar-none self-start md:self-auto">
          <button
            onClick={() => setActiveTab("mindmap")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "mindmap"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            期末考點互動心智圖
          </button>
          <button
            onClick={() => setActiveTab("journey")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "journey"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            端到端封包歷險記
          </button>
          <button
            onClick={() => setActiveTab("contrast")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "contrast"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            關鍵觀念核心對比
          </button>
        </div>
      </div>

      {activeTab === "mindmap" && (
        <div className="space-y-6">
          
          {/* Filters shelf */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 border border-slate-200 p-4 rounded-2xl gap-3">
            <div className="flex items-center gap-2 flex-wrap select-none w-full sm:w-auto">
              <span className="text-xxs font-bold text-slate-500 font-sans tracking-wide uppercase mr-1">
                篩選章節:
              </span>
              <button
                onClick={() => setChapterFilter("all")}
                className={`px-2.5 py-1 text-xxs font-bold rounded-lg transition-all cursor-pointer ${
                  chapterFilter === "all" ? "bg-slate-800 text-white shadow-xs" : "bg-white text-slate-600 border border-slate-205 hover:bg-slate-100"
                }`}
              >
                全部大考點 ({MINDMAP_NODES.length})
              </button>
              <button
                onClick={() => setChapterFilter(4)}
                className={`px-2.5 py-1 text-xxs font-bold rounded-lg transition-all cursor-pointer ${
                  chapterFilter === 4 ? "bg-blue-605 bg-blue-600 text-white shadow-xs" : "bg-white text-slate-600 border border-slate-205 hover:bg-blue-50/50 hover:text-blue-700"
                }`}
              >
                Ch 4: 數據平面 ({MINDMAP_NODES.filter(n => n.chapter === 4).length})
              </button>
              <button
                onClick={() => setChapterFilter(5)}
                className={`px-2.5 py-1 text-xxs font-bold rounded-lg transition-all cursor-pointer ${
                  chapterFilter === 5 ? "bg-purple-600 text-white shadow-xs" : "bg-white text-slate-600 border border-slate-205 hover:bg-purple-50/50 hover:text-purple-750"
                }`}
              >
                Ch 5: 控制平面 ({MINDMAP_NODES.filter(n => n.chapter === 5).length})
              </button>
              <button
                onClick={() => setChapterFilter(6)}
                className={`px-2.5 py-1 text-xxs font-bold rounded-lg transition-all cursor-pointer ${
                  chapterFilter === 6 ? "bg-emerald-600 text-white shadow-xs" : "bg-white text-slate-600 border border-slate-205 hover:bg-emerald-50/50 hover:text-emerald-700"
                }`}
              >
                Ch 6: 連結與局域網 ({MINDMAP_NODES.filter(n => n.chapter === 6).length})
              </button>
            </div>
            
            {/* Search inputs */}
            <div className="relative w-full sm:w-60 shrink-0">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="搜尋考點、協定、公式..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8.5 pr-4 py-1.5 border border-slate-250 bg-white focus:outline-none focus:ring-1 focus:ring-blue-105 rounded-xl text-xxs font-sans"
              />
            </div>
          </div>

          {/* Interactive Mindmap Dashboard Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left side: Grid based Node mindmap */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xxs font-bold text-slate-500 uppercase tracking-widest font-mono block pl-1">
                聯網全圖核心脈絡 (SELECT KNOWLEDGE NODE)
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[580px] overflow-y-auto pr-1.5 scrollbar-thin">
                {filteredNodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  
                  // Color determination based on chapter
                  const borderClass = isSelected 
                    ? node.chapter === 4 ? "border-blue-500 ring-2 ring-blue-100" 
                      : node.chapter === 5 ? "border-purple-500 ring-2 ring-purple-100"
                      : "border-emerald-500 ring-2 ring-emerald-100"
                    : "border-slate-200 hover:border-slate-350";
                  
                  const bgClass = isSelected
                    ? node.chapter === 4 ? "bg-blue-50/40 text-blue-900 border-2"
                      : node.chapter === 5 ? "bg-purple-50/40 text-purple-900 border-2"
                      : "bg-emerald-50/40 text-emerald-900 border-2"
                    : "bg-white text-slate-700";

                  const tagColor = node.chapter === 4 ? "bg-blue-50 text-blue-700 border-blue-100"
                    : node.chapter === 5 ? "bg-purple-50 text-purple-700 border-purple-100"
                    : "bg-emerald-50 text-emerald-700 border-emerald-100";

                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer space-y-3 shadow-xxs relative group ${borderClass} ${bgClass}`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 border text-[9px] font-mono font-bold rounded-md ${tagColor}`}>
                            {node.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono font-semibold">
                            Ch {node.chapter}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold font-sans tracking-tight">
                          {node.label}
                        </h4>
                        <p className="text-xxs text-slate-500 line-clamp-2 leading-relaxed">
                          {node.shortDesc}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 border-dashed w-full text-[10px] font-mono">
                        <span className="text-slate-400 font-sans italic">{node.slideRef.split(":")[1]?.trim() || "精選"}</span>
                        <span className={`font-sans font-bold flex items-center gap-1 ${
                          isSelected ? "text-blue-600" : "text-slate-405 hover:text-slate-700"
                        }`}>
                          <span>查看詳解</span>
                          <ChevronRight className={`h-3 w-3 transition-transform ${isSelected ? "translate-x-0.5" : ""}`} />
                        </span>
                      </div>
                    </button>
                  );
                })}
                
                {filteredNodes.length === 0 && (
                  <div className="col-span-2 py-12 text-center bg-slate-50 border border-slate-200 border-dashed rounded-3xl">
                    <p className="text-slate-450 text-xs font-sans">無符合當前條件的知識節點</p>
                    <button onClick={() => { setSearchTerm(""); setChapterFilter("all"); }} className="text-xs text-blue-600 font-sans font-bold mt-2 hover:underline cursor-pointer">
                      重置過濾條件
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Thorough Concept & Exam Matching analysis board */}
            <div className="lg:col-span-5">
              <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-5 space-y-6">
                
                {/* Node metadata strip */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className={`px-2.5 py-1 text-xxs font-mono font-bold rounded-lg border uppercase ${
                      selectedNode.chapter === 4 ? "bg-blue-50 border-blue-150 text-blue-800"
                        : selectedNode.chapter === 5 ? "bg-purple-50 border-purple-150 text-purple-800"
                        : "bg-emerald-50 border-emerald-150 text-emerald-800"
                    }`}>
                      Chapter {selectedNode.chapter} · {selectedNode.category}
                    </span>
                    <span className="text-xxs text-slate-400 font-mono font-bold">
                      {selectedNode.slideRef}
                    </span>
                  </div>

                  <h3 className="text-base font-sans font-extrabold tracking-tight text-slate-900 border-b border-slate-200 pb-2.5">
                    {selectedNode.label}
                  </h3>
                </div>

                {/* Subsections: Primary Concepts */}
                <div className="space-y-4">
                  <span className="text-xxs font-sans font-bold tracking-widest text-slate-500 uppercase block">
                    知識核心原理與大綱 (UNDERLYING PRINCIPLE)
                  </span>

                  <div className="space-y-3">
                    {selectedNode.details.map((text, sIdx) => (
                      <div
                        key={sIdx}
                        className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xxs text-xs sm:text-sm text-slate-705 leading-relaxed font-sans"
                        dangerouslySetInnerHTML={{
                          __html: text
                            .replace(/\*\*(.*?)\*\*/g, "<strong class='text-blue-900 font-extrabold font-sans'>$1</strong>")
                            .replace(/`(.*?)`/g, "<code class='font-mono text-xxs bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-amber-800 font-bold'>$1</code>")
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Subsections: Exam Matching Problem (真題對齊) */}
                {selectedNode.examQuestion && (
                  <div className="space-y-4 border-t border-slate-200 pt-5">
                    <span className="text-xxs font-sans font-bold tracking-widest text-amber-700 uppercase flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
                      <span>期末真題對應訓練 (IM3061 FINAL QUESTION)</span>
                    </span>

                    <div className="bg-amber-50/40 border border-amber-200 rounded-2xl p-4.5 space-y-4 shadow-xxs">
                      <p className="text-xs sm:text-sm font-semibold text-slate-805 text-slate-800 font-sans leading-relaxed">
                        {selectedNode.examQuestion.q}
                      </p>

                      {selectedNode.examQuestion.options && (
                        <div className="space-y-2">
                          {selectedNode.examQuestion.options.map((opt, oIdx) => {
                            const optLetter = opt.trim().charAt(0);
                            const isCorrect = optLetter === selectedNode.examQuestion?.answer;
                            return (
                              <div
                                key={oIdx}
                                className={`p-2.5 rounded-xl border text-xs font-sans transition-all leading-relaxed ${
                                  isCorrect 
                                    ? "bg-emerald-50/60 border-emerald-250 text-emerald-900 font-bold shadow-xxs" 
                                    : "bg-white border-slate-200 text-slate-650"
                                }`}
                              >
                                {opt}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Solutions and Explanations */}
                      <div className="bg-emerald-50 p-4 border border-emerald-200 rounded-xl space-y-2 shadow-xxs">
                        <div className="flex items-center gap-1.5">
                          <span className="p-0.5 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded font-mono text-xxs font-bold leading-none select-none">
                            ANS {selectedNode.examQuestion.answer}
                          </span>
                          <span className="text-xxs text-emerald-800 font-sans font-black">
                            學霸助教深度解析:
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-emerald-950 font-sans leading-relaxed">
                          {selectedNode.examQuestion.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      )}

      {activeTab === "journey" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Stepper Left Menu List */}
          <div className="lg:col-span-5 space-y-2">
            <span className="text-xxs font-sans font-bold text-blue-600 tracking-widest uppercase block mb-3">
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
                        ? "bg-blue-50 text-blue-850 border-2 border-blue-400 font-extrabold shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`p-1.5 rounded-lg shrink-0 ${
                        isSelected ? "bg-blue-105 bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
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
                        <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 rounded font-mono text-xxs font-bold">
                          {currentData.scope} 範疇
                        </span>
                        {currentData.techs.map((t) => (
                          <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-150 rounded font-mono text-xxs font-semibold">
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="text-xxs text-slate-405 font-mono font-bold">
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
                    <p className="text-slate-800 font-sans font-semibold text-xs sm:text-sm bg-blue-50/50 border border-blue-200 p-3.5 rounded-xl leading-relaxed">
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
                            className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans shadow-xxs"
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
                      className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-202/80 text-slate-700 text-xxs font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 font-mono uppercase shadow-xxs"
                    >
                      ← Back
                    </button>
                    
                    <div className="flex gap-1 font-mono text-xxs text-slate-350 text-center select-none">
                      {PASSPORT_STEPS.map((s) => (
                        <div
                          key={s.id}
                          className={`h-1.5 w-1.5 rounded-full ${s.id === activeStep ? "bg-blue-600" : "bg-slate-200"}`}
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
      )}

      {activeTab === "contrast" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {/* Compare Card 1: IP vs MAC */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-blue-700 font-sans tracking-wide border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <span className="p-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg"><Layers className="h-4 w-4 text-blue-600" /></span>
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
              <ul className="space-y-2 font-sans text-xs text-slate-650 list-disc list-inside">
                <li><strong className="text-blue-800">ARP Request (廣播)</strong>：在暗處吹口哨。填寫 `FF-FF-FF-FF-FF-FF` 物理廣播位，全子網網卡都將強制收悉解析。</li>
                <li><strong className="text-blue-800">ARP Reply (單播)</strong>：由特定目的主機向發起方答覆，更新本機 ARP Table 存根。</li>
                <li><strong className="text-amber-850 font-bold">跨網必備定律</strong>：若目的 IP 判定為外網，ARP 絕對不查最終主機的 MAC，而是**老老實實查預設閘道 (Default Gateway) 的 MAC 地址**！</li>
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
