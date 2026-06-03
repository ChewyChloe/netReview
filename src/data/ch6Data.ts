import { ChapterData, ChapterId } from "../types";

export const ch6Data: ChapterData = {
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
* **節點（Node）**：任何連接在網路中、執行鏈路層協定的端主機及三層路由器。
* **鏈路（Link）**：連接兩物理相鄰節點之間的物理通訊通道。
* **訊框（Frame）**：鏈路層傳輸的最小基本協議數據單元（PDU），將 IP 數據報封裝在內。

### 鏈路層提供的服務
1. **成幀（Framing）**：將 Layer 3 IP 數據報封裝在其訊框 Payload 中，加上 L2 訊框首部和尾部。
2. **鏈路存取控制（Link Access）**：如果是共用多重進接頻道，需要協商解決何時可以發送。
3. **相鄰節點間可靠傳輸（Reliable Delivery）**：藉由 ACK/NAK 和重傳，在無線網等高出錯率鏈路做到保證無誤傳遞。有線網路（如乙太網路）通常不提供此服務。
4. **網路介面卡（NIC/網卡）**：鏈路層主要是在網卡硬體晶片內實現，部分韌體跑在 OS Driver 內。

### 💯 100分申論題答題模板（手寫專用）
資料鏈路層（Layer 2）的核心職責是負責在「物理上直接相鄰的兩個節點」之間，實現高效率且正確的訊框（Frame）傳輸。鏈路層主要實作於網路介面卡（NIC/網卡）的硬體晶片中。它所提供的關鍵服務包括「成幀（Framing）」，即在網絡層 IP 數據報外層包覆 L2 首尾標頭，提供實體定址與錯誤檢測位元。值得注意的是，鏈路層是否提供「可靠傳輸（Reliable Delivery）」取決於實體介質特性：在錯誤率極高的無線網路（如 Wi-Fi）中，鏈路層必須透過硬體級的 ACK/NAK 與局部重傳來保證傳輸品質；而在錯誤率極低的實體有線網路（如乙太網路）中，為了追求極致的吞吐量開銷，鏈路層公然「不提供」可靠傳輸，若偵測到訊框損壞便直接丟棄，將重傳責任全權交給上層的傳送層（TCP）處理。

### ✍️ 老師眼中的奪分關鍵（背誦提示）
* **三大範疇抽象**：節點（Node）、鏈路（Link）、訊框（Frame）。
* **可靠傳輸的因地制宜（必考定性）**：有線網路（Ethernet）**不提供**可靠傳輸（錯了直接丟）；無線網路（Wi-Fi）**提供**可靠傳輸（因為空氣干擾大）。
* **實作位置**：主要在硬體層級的**網路介面卡（NIC）**中跑。`
    },
    {
      id: "ch6-error",
      title: "2. EDC, 2D Parity, & CRC Algorithm: 兩大防錯校驗公式與手算",
      isHighFreq: true,
      isMustKnow: true,
      isWarning: false,
      contentMarkdown: `### 1. 二維奇偶校驗（Two-Dimensional Parity）
將 $d$ 位元資料排列成行列矩陣。對每一行與每一列分別計算一個奇偶校驗位。當傳輸中發生**單一位元（Single-bit）錯誤翻轉**時，該行列校驗將雙重報錯，接收端能精準定位該交叉點，直接取反還原，**做到就地糾正（Error Correction）而不需要重傳**。

### 2. 循環冗餘檢驗碼（Cyclic Redundancy Check, CRC）
這是乙太網路與 Wi-Fi 最核心的訊框防錯算法。
* **公式表現**：
    $$\langle D, R\rangle = D \cdot 2^r \oplus R$$
    此合成數據必須可以**被生成多項式 $G$ 在模二除法中整除（餘數為 0）**。
* **手算三部曲**：
    1. **補零**：將原始二進制數 $D$ 後面補上 $r$ 個 \`0\`。
    2. **模二長除法**：以 $G$ 為除數進行直式除法。每一步除算使用 **XOR（互斥或，不進位、不借位：\`1^1=0, 0^0=0, 1^0=1, 0^1=1\`）**。
    3. **獲取餘數**：最後算出的最末 $r$ 位即為 $R$，將 $R$ 直接替換補上去那 $r$ 個 \`0\` 的位置發送出去。

### 💯 100分申論題答題模板（手寫專用）
在資料鏈路層的錯誤偵測與修正機制中，二維奇偶校驗與循環冗餘檢驗（CRC）各有其獨特的架構優勢。二維奇偶校驗（2D Parity）透過將資料位元排布為二維矩陣，並同時計算橫向與縱向的校驗位，當網路傳輸中發生「單一位元（Single-bit）錯誤」時，藉由行列雙重報錯的縱橫相交座標，接收端能夠就地進行「錯誤糾正（Error Correction）」，免除了昂貴的網路重傳開銷。而在實際局域網（Ethernet/Wi-Fi）中，最廣泛應用的則是 CRC 演算法。CRC 利用「模二除法（Modulo-2 Division）」與 XOR 運算，發送端將原始數據 $D$ 左移 $r$ 位元後除以系統約定的生成多項式 $G$，求得的 $r$ 位元餘數 $R$ 作為校驗碼拼接在資料後方。接收端收到後以相同的 $G$ 進行除算，若餘數為 0 則判定無錯。CRC 具備極高的硬體晶片實作效率，能以百分之百的數學勝率偵測出所有突發性群發錯誤（Burst Errors）。

### ✍️ 老師眼中的奪分關鍵（背誦提示）
* **2D校驗的終極威力**：不僅能偵測（Detect），還能做到**就地修正（Correct）**單一位元錯誤。
* **CRC 的直式計算特徵**：使用的是 **XOR（相異為1，相同為0）**，上下相減時**絕不進位、絕不借位**！
* **CRC 變數定義**：$D$ 是資料，$G$ 是除數（長度為 $r+1$），$R$ 是餘數（長度為 $r$）。`
    },
    {
      id: "ch6-multiple-access",
      title: "3. Multiple Access Protocols: 多重進接協議三大流派",
      isHighFreq: true,
      isMustKnow: true,
      isWarning: false,
      contentMarkdown: `### 廣播通道與衝突
當多個節點在共享的物理廣播通道（如無線廣播、共用同軸電纜）中同時發送，會造成訊號混雜毀滅的**碰撞（Collision）**。

### 三大 MAC 協定家族
1. **頻道劃分協定（Channel Partitioning）**：將頻道資源（時間、頻率、編碼）靜態切分（如 TDMA, FDMA）。
2. **隨機存取協定（Random Access）**：全速不切分。當有封包時一律以最大速率 $R$ bps 飆速發送，碰上衝突時事後再檢測、指數避讓（如 CSMA/CD, CSMA/CA）。
3. **輪流存取協定（Taking Turns）**：各用戶輪流享有專用發射權（如 Token Passing, Polling）。

### 💯 100分申論題答題模板（手寫專用）
多重進接控制（MAC）協定的核心任務，是調度多個節點在共享廣播通道上的發送行為，以防範訊號「碰撞（Collision）」導致的資料毀損。理想的 MAC 協定必須在低負載時允許單一用戶吃滿總頻寬 $R$，並在高負載時讓 $N$ 個活躍用戶均勻平分 $R/N$ 的頻寬，且需維持去中心化架構以防單點故障。三大協定流派在不同情境下表現出顯著的效能取捨（Trade-offs）：頻道劃分協定（如 TDMA/FDMA）透過靜態切分資源，在「高網路負載」下表現極佳，能徹底杜絕碰撞，但在低負載時會造成嚴重的空閒空洞與頻寬浪費；相反地，隨機存取協定（如 CSMA）在「低網路負載」下效率極致，節點無需等待即可全速衝刺，但隨流量飆升，碰撞率會呈幾何級數暴漲，導致吞吐量劇烈下滑；輪流存取協定則試圖透過輪詢或權杖機制，在兩者之間取得折衷。

### ✍️ 老師眼中的奪分關鍵（背誦提示）
* **期末考必考定性比較**：
    * **高負載（High load）下誰最強？** 頻道劃分（TDMA/FDMA），因為排好隊、絕不碰撞。
    * **低負載（Low load）下誰最強？** 隨機存取（CSMA），因為不用排隊，想發就發，沒人跟你撞。
* **高負載下隨機存取的慘狀**：會因為嚴重 Collision 導致有效呑吐量趨近於 0。`
    },
    {
      id: "ch6-channel-partitioning",
      title: "4. Channel Partitioning: TDMA / FDMA / CDMA 與正交編碼",
      isHighFreq: true,
      isMustKnow: true,
      isWarning: false,
      contentMarkdown: `### 1. TDMA（時分多重進接）
將時間切為 rounds，每個 round 進一步切為固定長度的專屬 slots，指派給特定用戶在對應 slot 獨佔發送。

### 2. FDMA（頻分多重進接）
將整個實體頻道頻譜劃分為多個固定頻寬的子頻道，各裝置可在專屬的子頻段內持續發送。

### 3. CDMA（碼分多重進接）
所有裝置**可在同一個時間、在同一個波段頻率**並行發送，完全不發生衝突！
* **正交編碼（Chipping Sequence）**：為每個用戶分配一個特定的 $M$-bit 正交向量偏碼序列（Chipping code $c_i$）。
* 因為不同用戶的編碼序列 $c_i$ 與 $c_j$ 彼此**正交（內積為 0，即 $c_i \cdot c_j = 0$）**，接收端能透過向量內積擴展，完璧解讀出指定介面的信號，消解碰撞。

### 💯 100分申論題答題模板（手寫專用）
在靜態頻道劃分協定中，TDMA 與 FDMA 分別在「時間軸」與「頻率軸」上對實體資源進行了硬性隔離，而 CDMA（碼分多重進接）則展現了更高的維度突破，實現了所有裝置「在相同時間、相同頻率」下並行通訊的非碰撞架構。CDMA 的數學基石在於「正交編碼（Orthogonal Codes）」技術。系統為每個行動裝置指派一個全球唯一的 $M$ 位元晶片序列（Chipping Sequence），這在數學上被視為一個高維向量。關鍵特徵在於，任意兩個裝置的向量互為正交，即其內積結果嚴格等於 0（$c_i \cdot c_j = 0$）；而向量與自身的內積則等於 1。當空中佈滿多路訊號疊加的複合類比電壓時，接收端只需將收到的混雜訊號與目標裝置的晶片序列進行「內積運算」，由於正交特性，其他裝置的干擾信號會被數學消去歸零，從而精準提取出目標用戶的數據，這在 3G 行動通訊中得到了完美的實證。

### ✍️ 老師眼中的奪分關鍵（背誦提示）
* **TDMA/FDMA 的局限**：都是硬性隔離（切時間或切頻率）。
* **CDMA 的無敵三同**：同時間、同頻率、同空間傳輸！
* **CDMA 的數學精髓**：**正交向量（Orthogonal）**。必須寫出公式：不同人內積為 0，同一個人內積為 1。`
    },
    {
      id: "ch6-random-access",
      title: "5. Random Access: CSMA/CD 與 CSMA/CA 碰撞迴避規律",
      isHighFreq: true,
      isMustKnow: true,
      isWarning: false,
      contentMarkdown: `### 1. CSMA（載波偵聽多重進接）
* **先聽後送（Listen before transmit）**：發送前先監聽頻道。若閒置則立刻發射；若忙碌則推遲等待。
* **為什麼還會有碰撞？**：因為有**傳播延遲（Propagation Delay）**！訊號在中途重疊發生碰撞。

### 2. CSMA/CD（碰撞檢測，有線網路專屬）
* **一邊偵聽一邊發射（Collision Detection）**：若在發射中偵聽到電壓異常，**立刻停止發送**以挽救頻寬，並發送 **Jam Signal（擾塞訊號）** 通知全網避讓。
* **二進位指數退避算法（Binary Exponential Backoff）**：連續碰撞第 $m$ 次後，裝置從 $\\{0, 1, \dots, 2^{\min(m, 10)} - 1\\}$ 中隨機挑選出等待因子 $K$，精確等待 **$K \times 512$ 位元時間（Bit Times）**後再度重新偵聽。

### 3. CSMA/CA（碰撞避免，無線網 Wi-Fi 專屬）
* **不支援檢測的原因**：網卡**無法同時進行偵聽與發射（半雙工天線）**，且存在**隱蔽站問題（Hidden Terminal Problem）**。
* **解決機制**：使用隨機避讓，並透過預先申請 **RTS（Request to Send）與 CTS（Clear to Send）** 機制在物理上清空通道。

### 💯 100分申論題答題模板（手寫專用）
隨機存取協定從早期的 CSMA 演進至有線網路的 CSMA/CD 與無線網路的 CSMA/CA，核心都在於解決傳播延遲（Propagation Delay）導致的碰撞代價。在有線乙太網路中，採用的是「碰撞檢測（CSMA/CD）」，裝置具備「邊聽邊送」的能力，一旦偵測到物理電壓碰撞，會立刻終止發送並發射擾塞訊號（Jam Signal）清空線路，隨後觸發「二進位指數退避演算法（Binary Exponential Backoff）」。裝置依碰撞次數 $m$ 指數放大隨機整數 $K$ 的抽選範圍，並精確推遲 $K \times 512$ 位元時間，這能在大流量塞車時完美平滑競爭洪流。然而，此機制在無線 Wi-Fi 網路中完全失效，因為無線網卡天線無法在發射強訊號的同時偵測微弱的碰撞，且受限於一牆兩隔的「隱蔽站問題（Hidden Terminal Problem）」。因此，無線網改採「碰撞避免（CSMA/CA）」，揚棄了事後檢測，改採事前透過短小的 RTS/CTS 握手訊框向基地台（AP）預約虛擬通道，實施強行避讓，完美化解了無線環境的碰撞危機。

### ✍️ 老師眼中的奪分關鍵（背誦提示）
* **CSMA會碰撞的根本原因**：**傳播延遲（Propagation Delay）**。
* **CSMA/CD 指數退避手算常客**：連續撞第 $m$ 次，集合最大值是 $2^m - 1$（上限到第 10 次的 1023）。等待時間單位是 **512 bit times**。
* **為什麼 Wi-Fi 不能用 CSMA/CD？**：1. 無法邊送邊聽（硬體限制）；2. **隱蔽站問題（Hidden Terminal）**導致看得到基地台卻聽不到旁邊的競爭者。因此必須用 **RTS/CTS** 機制。`
    },
    {
      id: "ch6-arp",
      title: "6. ARP: 地址解析協定與跨網段封包傳遞全流向",
      isHighFreq: true,
      isMustKnow: true,
      isWarning: false,
      contentMarkdown: `### 網路界兩大定址體系
* **IP 位址（32-bit）**：**邏輯定址、層級化結構**。無可攜性。負責網路層**端到端（End-to-End）**路徑計算。
* **MAC 位址（48-bit）**：**平面型結構（Flat）**。出廠固化，具**永久可攜性**。負責局域網段內**相鄰單一跳（Hop-by-hop）**傳遞。

### ARP（地址解析協定）
將局域網內指定的 Layer 3 IP 轉換為 Layer 2 的物理 MAC 位址。
* **定性大題必背終極金句**：**「IP 位址全程不變，MAC 位址逐跳（Hop-by-hop）都在變更！」**
* **ARP 的封包特性**：
    * **ARP Request**：目的地是 \`FF-FF-FF-FF-FF-FF\` 的**廣播（Broadcast）**。
    * **ARP Reply**：直接回給發起人，是**單播（Unicast）**。
* **跨網段的第一步**：目的地在外網時，目的 MAC **絕對不是**遠端主機的 MAC，而是**預設閘道器（Default Gateway）的實體 MAC**！

### 💯 100分申論題答題模板（手寫專用）
在跨越不同子網路的端到端資料傳輸中，Layer 3 IP 定址與 Layer 2 MAC 定址扮演著完全不同的層級角色，而 ARP（地址解析協定）則是黏合這兩層的關鍵。IP 位址屬於邏輯層級定址，負責引導封包進行全球端到端（End-to-End）的路徑導向；而 MAC 位址則屬於平面定址，僅負責局域網內單跳（Hop-by-Hop）的點對點實體搬運。當主機 A 欲發送封包給跨網段的目的主機 B 時，A 判定 B 屬於外網，故下一跳鎖定為「預設閘道器（Default Gateway）」的 IP。A 會首先發射一個目的地為全 \`FF-FF-FF-FF-FF-FF\` 的廣播 ARP Request 獲取閘道器的實體 MAC。隨後封包出發：在整段漫長的傳輸旅途中，**封包標頭中的來源與目的 IP 地址全程雷打不動、保持不變（除非經過 NAT）；然而，Layer 2 的 MAC 標頭在每經過一台三層路由器時，都會被無情扒除並重新封裝改寫**，將來源 MAC 替換為當前路由器輸出埠的 MAC，目的 MAC 替換為下一跳的實體 MAC。這條「IP 全程不變，MAC 每跳皆變」的鐵律，正是網路分層架構的精髓所在。

### ✍️ 老師眼中的奪分關鍵（背誦提示）
* **定性大題必背終極金句**：**「IP 位址全程不變，MAC 位址逐跳（Hop-by-hop）都在變更！」**
* **ARP 的封包特性**：
    * **ARP Request**：目的地是 \`FF-FF-FF-FF-FF-FF\` 的**廣播（Broadcast）**。
    * **ARP Reply**：直接回給發起人，是**單播（Unicast）**。
* **跨網段的第一步**：目的地在外網時，目的 MAC **絕對不是**遠端主機的 MAC，而是**預設閘道器（Default Gateway）的實體 MAC**！`
    },
    {
      id: "ch6-ethernet",
      title: "7. Ethernet Frame: 乙太網路結構特性",
      isHighFreq: true,
      isMustKnow: true,
      isWarning: false,
      contentMarkdown: `### 乙太網路訊框結構 (Ethernet Frame)
1. **前導碼（Preamble, 8 bytes）**：用於接收端與發送端進行**時鐘同步（Clock Synchronization）**。
2. **目的與來源 MAC 位址**（各 6 bytes）。
3. **類型（Type, 2 bytes）**：指出承載的 L3 協定（如 \`0x0800\` 代表 IPv4），用作解交織分流（Demultiplexing）。
4. **資料（Data / Payload）**：承載 IP 數據報，有 46 至 1500 bytes 的長度要求（MTU限制）。
5. **循環冗餘檢驗（CRC, 4 bytes）**：位於幀尾，用作錯誤檢測。

### 💯 100分申論題答題模板（手寫專用）
標準 802.3 乙太網路（Ethernet）是現代有線區域網路的主宰技術，其訊框結構與通訊定性充分體現了高吞吐量的極簡設計原則。在訊框標頭中，設計了 8 節組的前導碼（Preamble），透過規律的交錯位元讓接收端網卡鎖定並達成硬體級的「時鐘同步（Clock Synchronization）」。在通訊定性上，乙太網路展現出三大核心定性：第一是「無連接的（Connectionless）」，網卡發送前無需與對方進行任何握手協商，直接將訊框扔上線路；第二是「不可靠的（Unreliable）」，乙太網路網卡**絕不提供任何 ACK 或 NAK 機制**，當幀尾的 4 節組 CRC 校驗判定傳輸發生錯誤時，網卡會毫不留情地直接在硬體層面「過濾並丟棄」該訊框。乙太網路完全不負責丟包重傳，將數據完整性的最終保障責任，高姿態地全權移交給傳送層（TCP）或應用層，從而換取了極致的硬體轉發速率。

### ✍️ 老師眼中的奪分關鍵（背誦提示）
* **前導碼（Preamble）的功能**：為了**時鐘同步（Clock Synchronization）**。
* **乙太網兩大冷酷定性（極常考選擇題判斷）**：
    * **無連接（Connectionless）**：不握手，想發就發。
    * **不可靠（Unreliable）**：**沒有 L2 ACK/NAK**！錯了就丟，重傳是上層 TCP 的事，L2 概不負責。`
    },
    {
      id: "ch6-switch",
      title: "8. Switch: Layer 2 交換器自學原理與對比",
      isHighFreq: true,
      isMustKnow: true,
      isWarning: false,
      contentMarkdown: `### Layer 2 開關設備
**交換器（Switch）**是完全運行在 **Layer 2** 的透明中轉設備。具備儲存後轉發（Store-and-Forward）、插拔即用（Plug-and-Play）特性。

### 核心自學機制（Self-Learning）
交換器內裝有一張 **Switch Table** \`(MAC Address, Interface, Timestamp)\`：
* **自學原理**：每當交換器從實體介面 $x$ 收到一個訊框，它會立即讀取該訊框的 **來源 MAC 地址（Source MAC）**，將其與輸入埠 $x$ 的映射關係存入或更新至 Switch Table。
* **轉發/過濾/氾洪抉擇流（Filtering & Forwarding）**：當要往 **目的 MAC（Destination MAC）** 發送時：
    1. **目的 MAC 在表，且記載介面就是 input 埠**：直接**過濾丟棄（Filtering）**。
    2. **目的 MAC 在表，且記載介面是另一個埠 $y$**：精準將訊框**單播（Unicast）**從 $y$ 介面扔出去。
    3. **目的 MAC 完全查無**：進行**氾洪（Flooding）**，向除 input 之外的所有介面複製發送。

### 💯 100分申論題答題模板（手寫專用）
Layer 2 區域網路交換器（Switch）是一種對終端主機完全透明、具備隨插即用（Plug-and-Play）特性的鏈路層設備。其核心靈魂在於「自學機制（Self-Learning）」與「轉發/過濾抉擇邏輯」。交換器內部維護一張動態交換表（Switch Table）。**當訊框由介面 $x$ 流入時，交換器會「逆向思考」，讀取訊框的『來源 MAC 地址（Source MAC）』**，將該 MAC 與介面 $x$ 的綁定關係記入表中，實現無人值守的自動學習。隨後，當交換器要將訊框轉發至『目的 MAC』時，會進行查表抉擇：若目的 MAC 對應的輸出埠與流入埠相同，代表目標與發起者在同一個物理網段，交換器會直接執行「過濾（Filtering）」將其丟棄以免污染其他埠；若目的 MAC 映射到另一個專屬埠，則執行高效率的「單播（Unicast）」精準投遞；若表中完全查無此目的地，交換器則啟動容錯的「氾洪（Flooding）」機制，向除流入埠外之所有埠廣播複製。與集線器（Hub）將所有流量盲目放大導致嚴重碰撞不同，交換器的每個埠口都獨佔一個獨立的「碰撞網域（Collision Domain）」，並支援全雙工通訊，徹底消滅了區域網路內部的實體衝突。

### ✍️ 老師眼中的奪分關鍵（背誦提示）
* **自學與轉發的看表順序（超級大陷阱，改卷老師最愛抓這個錯！）**：
    * 它是看 **來源 MAC (Source MAC)** 來進行**學習更新**。
    * 它是看 **目的 MAC (Destination MAC)** 來進行**轉發/過濾/氾洪的抉擇**。
* **與 Hub 的本質差異**：Hub 只有一個大碰撞域（L1 設備）；Switch 的**每個埠都是一個獨立的碰撞網域**（L2 設備），支援並行傳輸、不發生衝突。`
    },
    {
      id: "ch6-vlan",
      title: "9. VLAN: 虛擬區域網路與 802.1Q 幹線標記",
      isHighFreq: true,
      isMustKnow: true,
      isWarning: false,
      contentMarkdown: `### VLAN 產生的背景
在傳統區域網路中，全交換器同屬單一廣播域，會面臨嚴重的 ARP 氾洪風暴與安全隱私洩漏。
**虛擬區域網路（Virtual LAN, VLAN）**藉由在交換器上進行軟體配置，在邏輯上切分出多個完全隔離的廣播域。

### 幹線埠（Trunk Port）與 IEEE 802.1Q 幀結構
* 當 VLAN 訊框準備跨越實體交換機、通過共享的 **幹線鏈路（Trunk Link）** 出閘時，交換器會在訊框中**強行插入一個 4-byte Tag 標籤首部**。
* 此 Tag 中含有一個 **12-bit 的 VLAN ID**，可支援 $4096$ 個子 VLAN 標記。
* 當訊框抵達對面交換機入埠分流時，晶片會自動將 **Tag 標籤剝除（Strip）**還原，再派發給指定 Port 上的主機。此過程對終端主機完全透明。

### 💯 100分申論題答題模板（手寫專用）
虛擬區域網路（VLAN）技術的引入，是為了解決傳統有線區域網路中，因地理位置綁定而導致所有主機共處同一個龐大「廣播網域（Broadcast Domain）」所引發的 ARP 氾洪風暴與隱私洩漏痛點。VLAN 允許網管人員在單一實體交換器硬體上，將不同連接埠劃歸不同的邏輯 VLAN（如工程系與商學系）。不同 VLAN 之間的二層流量在硬體層面上被絕對隔離，若兩者強烈需要跨 VLAN 通訊，則流量**必須強制送交 Layer 3 設備（如路由器或三層交換器）執行三層算路路由才能送達**。當 VLAN 架構需要跨越多台實體交換機延伸時，則必須依賴「幹線埠（Trunk Port）」與 IEEE 802.1Q 標準。當訊框由交換機 A 經由 Trunk 鏈路發出時，會在標準乙太網路訊框內強行「注入（Tagging）」一個 4 節組的標籤，內含一個 12 位元的 VLAN ID（用以標示屬於 4096 個子網中的哪一個）；當訊框抵達交換機 B 後，標籤會被自動「剝除（Stripping）」並精準分流。這套注入與剝除的精密流水線，對兩端的主機客戶端而言是完全完美、高度透明的。

### ✍️ 老師眼中的奪分關鍵（背誦提示）
* **VLAN 的硬性隔離防線**：不同 VLAN 之間在 Layer 2 互不相通（連 ARP 廣播都過不去）。要互通**必須跨越 Layer 3 設備**（Router 或 L3 Switch）。
* **IEEE 802.1Q 幹線運作**：在 Trunk 線路傳輸時會**插上 4 bytes 的 Tag**，裡面的 **VLAN ID 佔 12 位元**（所以最多支援 $2^{12} = 4096$ 個 VLAN）。封包進到一般主機前會被**剝除（Strip）**。`
    },
    {
      id: "ch6-datacenter",
      title: "10. Datacenter Networks: 資料中心 bento 網路互連",
      isHighFreq: false,
      isMustKnow: true,
      isWarning: false,
      contentMarkdown: `### 內部拓撲架構
現代資料中心網路（Datacenter Network）包含了成千上萬個伺服器（Blade hosts），需要極高的吞吐量和冗餘：
* **伺服器機櫃（Server Racks）**：每一機櫃插入數十台伺服器。
* **櫃頂交換器（Top of Rack Switch, TOR Switch）**：掛在每一機櫃頂部，連接所有內部伺服器板。
* **多級開關階層（Tier-2 & Tier-1 Switches）**：櫃頂交換器向上接入多台 Tier-2 交換器，Tier-2 再向上匯聚至 Tier-1 核心骨幹交換器與邊界路由器（Border Routers），進而連向網際網路骨幹。

### 資料中心三大應戰神兵
1. **多路徑轉發（Multipath Forwarding）**：在各級交換器之間配置對稱的備份物理互連開關，消除單一實體故障並提供倍增頻寬。
2. **負載平衡器（Load Balancer / L7 Switch）**：對外暴露單一公網 IP，將外界成千上萬的動態請求，代理配送到內部當前資源充裕的某個實體伺服器。
3. **高通量高可靠（High Throughput & Reliability）**。

### 💯 100分申論題答題模板（手寫專用）
現代資料中心網路（Datacenter Networks）架構的設計核心，在於解決海量伺服器之間的高吞吐量通訊（東西向流量）與對外網服務的高可用性（南北向流量）。其拓撲採用多級交換階層（Multi-tier Topology），由伺服器機櫃向上匯聚至櫃頂交換器（TOR Switch），再進一步接入 Tier-2 與 Tier-1 核心骨幹交換器。為了克服單點故障（Single Point of Failure）並因應突發的洪峰流量，資料中心引入了兩大核心技術：第一是「多路徑轉發（Multipath Forwarding）」，透過在各級交換器之間佈署大量對稱的備份實體鏈路，當某條線路擁塞或損壞時，流量能自發分流至其他平行通路，實現高速橫向擴展與容錯；第二是「負載平衡器（Load Balancer）」，它對外隱藏內部真實的伺服器群 IP，僅暴露單一虛擬公網 IP，並在第七層（應用層）動態解析請求，依據各節點的即時資源狀態進行精密配送。這項設計不僅優化了集群的資源利用率，更保證了雲端服務不中斷的高可靠性。

### ✍️ 老師眼中的奪分關鍵（背誦提示）
* **多級拓撲的結構流向**：伺服器 $\rightarrow$ TOR (櫃頂交換器) $\rightarrow$ Tier-2 $\rightarrow$ Tier-1 / Border Router。
* **多路徑轉發（Multipath Forwarding）的價值**：提供冗餘（Redundancy），消滅單點故障，允許並行流量動態分流，大幅優化內部機櫃間的東西向高頻流量。
* **負載平衡器（Load Balancer）的角色**：屬於第七層（L7）的高級交換設備，對外提供統一虛擬 IP 作為單一門面，對內進行智慧型任務均勻分配。`
    }
  ]
};