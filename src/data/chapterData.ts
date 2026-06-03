import { ChapterData } from "../types";
import { ch4Data } from "./ch4Data";
import { ch5Data } from "./ch5Data";
import { ch6Data } from "./ch6Data";

export const CHAPTER_REVIEW_DATA: ChapterData[] = [
  ch4Data,
  ch5Data,
  ch6Data
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
