import React, { useState, useEffect } from "react";
import { QUIZ_BANK } from "../data/quizBank";
import { Question, ChapterId, QuestionType, Difficulty } from "../types";
import { LatexRenderer } from "./LatexRenderer";
import { AlertCircle, CheckCircle, Search, ArrowRight, RotateCcw, HelpCircle as HelpIcon, Sparkles } from "lucide-react";

interface QuizSectionProps {
  onAddMistake: (id: string) => void;
  onRemoveMistake: (id: string) => void;
  onClearAllMistakes?: () => void;
  mistakesList: string[];
  onlyMistakesMode?: boolean;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  onAddMistake,
  onRemoveMistake,
  onClearAllMistakes,
  mistakesList,
  onlyMistakesMode = false,
}) => {
  const [selectedChapter, setSelectedChapter] = useState<"all" | ChapterId>("all");
  const [selectedType, setSelectedType] = useState<"all" | QuestionType>("all");
  const [selectedDiff, setSelectedDiff] = useState<"all" | Difficulty>("all");
  const [searchTopic, setSearchTopic] = useState("");

  const [pickedAnswers, setPickedAnswers] = useState<{ [qId: string]: string }>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<{ [qId: string]: boolean }>({});
  const [showExplanation, setShowExplanation] = useState<{ [qId: string]: boolean }>({});

  const [shortAnswerInput, setShortAnswerInput] = useState<{ [qId: string]: string }>({});
  const [mistakesDetails, setMistakesDetails] = useState<{ [key: string]: { pickedHistory: string[]; count: number } }>({});

  useEffect(() => {
    try {
      const savedDetails = localStorage.getItem("mistakes_details");
      if (savedDetails) {
        setMistakesDetails(JSON.parse(savedDetails));
      } else {
        setMistakesDetails({});
      }
    } catch {
      setMistakesDetails({});
    }
  }, [mistakesList]);

  // Parse text looking for LaTeX \( ... \) blocks and replace them dynamically
  const parseTex = (text: string) => {
    if (!text) return "";
    const parts = text.split(/(\\\([\s\S]*?\\\)|\$\$[\s\S]*?\$\$)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("\\(") && part.endsWith("\\)")) {
        const math = part.slice(2, -2);
        return <LatexRenderer key={idx} math={math} block={false} />;
      }
      if (part.startsWith("$$") && part.endsWith("$$")) {
        const math = part.slice(2, -2);
        return <LatexRenderer key={part + idx} math={math} block={true} />;
      }
      return <span key={idx} className="font-sans text-slate-800">{part}</span>;
    });
  };

  const pool = onlyMistakesMode
    ? QUIZ_BANK.filter((q) => mistakesList.includes(q.id))
    : QUIZ_BANK;

  const filteredQuestions = pool.filter((q) => {
    if (selectedChapter !== "all" && q.chapter !== selectedChapter) return false;
    if (selectedType !== "all" && q.type !== selectedType) return false;
    if (selectedDiff !== "all" && q.difficulty !== selectedDiff) return false;
    if (
      searchTopic &&
      !q.topic.toLowerCase().includes(searchTopic.toLowerCase()) &&
      !q.questionText.toLowerCase().includes(searchTopic.toLowerCase())
    )
      return false;
    return true;
  });

  const handleOptionClick = (qId: string, optionLetter: string) => {
    if (submittedAnswers[qId]) return; // Block changes after submit
    setPickedAnswers({ ...pickedAnswers, [qId]: optionLetter });
  };

  const handleSubmit = (qId: string, correctAnswer: string) => {
    const userAns = pickedAnswers[qId] || shortAnswerInput[qId] || "";
    if (!userAns.trim()) {
      alert("請先選擇或填寫你的答案！");
      return;
    }

    const isCorrect = userAns.trim().toUpperCase() === correctAnswer.trim().toUpperCase();
    setSubmittedAnswers({ ...submittedAnswers, [qId]: true });
    setShowExplanation({ ...showExplanation, [qId]: true });

    // Save details to localStorage
    const savedDetailsStr = localStorage.getItem("mistakes_details") || "{}";
    let savedDetails: { [key: string]: { pickedHistory: string[]; count: number } } = {};
    try {
      savedDetails = JSON.parse(savedDetailsStr);
    } catch {
      savedDetails = {};
    }

    if (isCorrect) {
      onRemoveMistake(qId);
      delete savedDetails[qId];
    } else {
      onAddMistake(qId);
      if (!savedDetails[qId]) {
        savedDetails[qId] = { pickedHistory: [userAns], count: 1 };
      } else {
        const history = savedDetails[qId].pickedHistory || [];
        if (!history.includes(userAns)) {
          history.push(userAns);
        }
        savedDetails[qId] = {
          pickedHistory: history,
          count: (savedDetails[qId].count || 0) + 1
        };
      }
    }
    localStorage.setItem("mistakes_details", JSON.stringify(savedDetails));
    setMistakesDetails(savedDetails);
  };

  const handleResetQuestion = (qId: string) => {
    const updatedPicked = { ...pickedAnswers };
    delete updatedPicked[qId];
    setPickedAnswers(updatedPicked);

    const updatedSubmitted = { ...submittedAnswers };
    delete updatedSubmitted[qId];
    setSubmittedAnswers(updatedSubmitted);

    const updatedExpl = { ...showExplanation };
    delete updatedExpl[qId];
    setShowExplanation(updatedExpl);

    const updatedInputs = { ...shortAnswerInput };
    delete updatedInputs[qId];
    setShortAnswerInput(updatedInputs);
  };

  return (
    <div className="space-y-6 font-sans text-slate-900" id="quiz-section-outer">
      {/* Filtering Console - Hidden during mistakes-only mode */}
      {!onlyMistakesMode ? (
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4 shadow-xs">
          <span className="text-xs font-mono font-bold text-blue-600 tracking-widest uppercase flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>互動防漏題庫篩選沙盒</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filter by Chapter */}
            <div>
              <label className="block text-slate-500 text-xxs font-sans font-bold uppercase tracking-wider mb-1.5">依章節篩選</label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value as any)}
                className="w-full bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 rounded-xl px-3 py-2 text-slate-700 text-xs outline-none"
              >
                <option value="all">所有章節範圍 (Ch4 ~ Ch6)</option>
                <option value={ChapterId.CH4}>Chapter 4: Data Plane</option>
                <option value={ChapterId.CH5}>Chapter 5: Control Plane</option>
                <option value={ChapterId.CH6}>Chapter 6: Link Layer & LANs</option>
              </select>
            </div>

            {/* Filter by Type */}
            <div>
              <label className="block text-slate-500 text-xxs font-sans font-bold uppercase tracking-wider mb-1.5">依題型篩選</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="w-full bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 rounded-xl px-3 py-2 text-slate-700 text-xs outline-none"
              >
                <option value="all">所有題型 (選擇與手算題)</option>
                <option value={QuestionType.MCQ}>Multiple Choice (選擇題)</option>
                <option value={QuestionType.SHORT}>Short Answer (簡答題)</option>
                <option value={QuestionType.CALC}>Calculation (手算證明題)</option>
              </select>
            </div>

            {/* Filter by Difficulty */}
            <div>
              <label className="block text-slate-500 text-xxs font-sans font-bold uppercase tracking-wider mb-1.5">依難易度篩選</label>
              <select
                value={selectedDiff}
                onChange={(e) => setSelectedDiff(e.target.value as any)}
                className="w-full bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 rounded-xl px-3 py-2 text-slate-700 text-xs outline-none"
              >
                <option value="all">所有難易度 (Easy / Hard)</option>
                <option value={Difficulty.EASY}>Easy (平實基本分)</option>
                <option value={Difficulty.MEDIUM}>Medium (高頻常規考點)</option>
                <option value={Difficulty.HARD}>Hard (名列前茅壓軸題)</option>
              </select>
            </div>

            {/* Search Topic */}
            <div>
              <label className="block text-slate-500 text-xxs font-sans font-bold uppercase tracking-wider mb-1.5">依主題關鍵字</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTopic}
                  onChange={(e) => setSearchTopic(e.target.value)}
                  placeholder="搜尋 (e.g. CRC, Dijkstra)"
                  className="w-full bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 rounded-xl pl-8 pr-3 py-2 text-slate-700 text-xs outline-none"
                />
                <span className="absolute left-2.5 top-2.5 text-slate-405 text-slate-400">
                  <Search className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div>
              <label className="block text-slate-500 text-xxs font-sans font-bold uppercase tracking-wider mb-1">依章節篩選錯題</label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value as any)}
                className="bg-white border border-slate-250 rounded-xl px-3 py-2 text-slate-700 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              >
                <option value="all">所有章節範圍</option>
                <option value={ChapterId.CH4}>Chapter 4</option>
                <option value={ChapterId.CH5}>Chapter 5</option>
                <option value={ChapterId.CH6}>Chapter 6</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-500 text-xxs font-sans font-bold uppercase tracking-wider mb-1">關鍵字搜尋</label>
              <input
                type="text"
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                placeholder="搜尋錯題關鍵字..."
                className="bg-white border border-slate-250 rounded-xl px-3 py-2 text-slate-700 text-xs outline-none w-full sm:w-48 focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              />
            </div>
          </div>
          {onClearAllMistakes && mistakesList.length > 0 && (
            <button
              onClick={() => {
                if (confirm("確定要清空所有錯題筆記嗎？這將刪除所有已記錄的答錯歷程！")) {
                  onClearAllMistakes();
                }
              }}
              className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-650 hover:text-white border border-rose-200 text-xs font-bold font-sans rounded-xl transition-all cursor-pointer shadow-xs mt-4 md:mt-0"
            >
              🧹 徹底清除所有記錄錯題
            </button>
          )}
        </div>
      )}

      {/* Questions list flow */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="p-3 bg-white border border-slate-150 text-slate-400 rounded-full inline-block mb-3 shadow-xs">
              <HelpIcon className="h-5 w-5 animate-pulse" />
            </span>
            <p className="text-slate-500 text-sm font-sans">此欄位目前並無任何相關題目。</p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const isSubmitted = submittedAnswers[q.id];
            const chosenAnswer = pickedAnswers[q.id] || "";
            const isCorrect = chosenAnswer.trim().toUpperCase() === q.correctAnswer.trim().toUpperCase() ||
              (shortAnswerInput[q.id]?.trim().toUpperCase() === q.correctAnswer.trim().toUpperCase());
            const detail = jokesDetailsButActuallyMistakesDetails();
            function jokesDetailsButActuallyMistakesDetails() {
              return mistakesDetails[q.id];
            }

            return (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-all duration-200 shadow-xs"
              >
                {/* Question Info Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded font-mono text-xxs font-extrabold text-blue-600">
                      Q {idx + 1}
                    </span>
                    <span className="text-xs text-slate-500 font-sans font-medium">
                      {q.chapter} • {q.topic}
                    </span>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <span className={`px-2 py-0.5 text-xxs rounded font-mono font-bold ${
                      q.difficulty === Difficulty.EASY ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" :
                      q.difficulty === Difficulty.MEDIUM ? "bg-amber-50 text-amber-700 border border-amber-200/50" : "bg-rose-50 text-rose-700 border border-rose-200/50"
                    }`}>
                      {q.difficulty}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-mono text-xxs font-semibold">
                      {q.type}
                    </span>
                  </div>
                </div>

                {detail && (
                  <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs flex flex-wrap items-center gap-4 font-sans shadow-xxs">
                    <span className="text-rose-705 text-rose-705 text-rose-700 font-extrabold flex items-center gap-1.5 animate-pulse">
                      <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      已累計認領錯誤：{detail.count} 次
                    </span>
                    {detail.pickedHistory && detail.pickedHistory.length > 0 && (
                      <span className="text-slate-550">
                        作答錯誤歷程記錄：<strong className="text-rose-800 uppercase">{detail.pickedHistory.join(" ➔ ")}</strong>
                      </span>
                    )}
                  </div>
                )}

                {/* Question Text */}
                <div className="text-slate-900 font-sans font-semibold text-sm sm:text-base leading-relaxed mb-6 whitespace-pre-wrap select-text">
                  {parseTex(q.questionText)}
                </div>

                {/* MCQ Options representation */}
                {q.type === QuestionType.MCQ && q.options && (
                  <div className="grid grid-cols-1 gap-3 mb-6">
                    {q.options.map((option) => {
                      const letter = option.trim().slice(1, 2).toUpperCase(); // Extracts "A", "B" from "(A)"
                      const isSelected = chosenAnswer === letter;
                      return (
                        <button
                          key={option}
                          disabled={isSubmitted}
                          onClick={() => handleOptionClick(q.id, letter)}
                          className={`w-full text-left p-4 rounded-xl text-xs sm:text-sm font-sans relative transition-all flex items-center justify-between cursor-pointer ${
                            isSubmitted
                              ? letter === q.correctAnswer
                                ? "bg-emerald-50 text-emerald-800 border-2 border-emerald-400 font-extrabold shadow-sm"
                                : isSelected
                                ? "bg-rose-50 text-rose-800 border-2 border-rose-300 shadow-sm"
                                : "bg-slate-50 text-slate-400 border border-slate-150"
                              : isSelected
                              ? "bg-blue-50 text-blue-800 border-2 border-blue-500 font-extrabold shadow-sm"
                              : "bg-white text-slate-705 border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                          }`}
                        >
                          <span className="pr-4">{parseTex(option)}</span>
                          {isSubmitted && letter === q.correctAnswer && (
                            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />
                          )}
                          {isSubmitted && isSelected && letter !== q.correctAnswer && (
                            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Calculation/Short-Answer Input field */}
                {q.type !== QuestionType.MCQ && (
                  <div className="mb-6 space-y-2">
                    <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                      請在下面填入你的答案（填寫完成可點擊送出查看 100 分完美答題模板）：
                    </label>
                    <textarea
                      disabled={isSubmitted}
                      value={shortAnswerInput[q.id] || ""}
                      onChange={(e) => setShortAnswerInput({ ...shortAnswerInput, [q.id]: e.target.value })}
                      placeholder="請描述你的計算推導過程概要..."
                      className="w-full bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 rounded-xl px-4 py-3 text-slate-800 text-xs sm:text-sm font-sans outline-none min-h-24 leading-relaxed"
                    />
                  </div>
                )}

                {/* Action Buttons: Submit or Reset */}
                <div className="flex items-center justify-between flex-wrap gap-3 mt-4">
                  <div className="flex gap-2">
                    {!isSubmitted ? (
                      <button
                        onClick={() => handleSubmit(q.id, q.correctAnswer)}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-bold leading-none tracking-wide transition-all uppercase flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>送出評估</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleResetQuestion(q.id)}
                        className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans text-xs font-bold leading-none tracking-wide transition-all uppercase flex items-center gap-1.5 cursor-pointer border border-slate-205"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>再做一次</span>
                      </button>
                    )}
                  </div>

                  {onlyMistakesMode && (
                    <button
                      onClick={() => {
                        onRemoveMistake(q.id);
                        const savedStr = localStorage.getItem("mistakes_details") || "{}";
                        try {
                          const saved = JSON.parse(savedStr);
                          delete saved[q.id];
                          localStorage.setItem("mistakes_details", JSON.stringify(saved));
                        } catch {}
                      }}
                      className="px-4 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-xs font-bold font-sans rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>標記為已完全掌握（移除錯題）</span>
                    </button>
                  )}
                </div>

                {/* Solved Explanation Section */}
                {showExplanation[q.id] && (
                  <div className="mt-6 border-t border-slate-100 pt-6 space-y-4">
                    {/* Status Banner */}
                    <div className={`p-4 rounded-xl flex items-center gap-3 border ${
                      isCorrect || q.type !== QuestionType.MCQ
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}>
                      {isCorrect || q.type !== QuestionType.MCQ ? (
                        <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
                      )}
                      <div>
                        <span className="font-sans font-bold text-xs uppercase block tracking-wide">
                          {q.type === QuestionType.MCQ
                            ? isCorrect ? "恭喜你！答案正確！" : "抱歉！答案錯誤，參考正確解析："
                            : "手寫/計算題已送出：對照中，請查看下方 100 分完美答題模板說明："}
                        </span>
                        {q.type === QuestionType.MCQ && (
                          <p className="text-xxs text-slate-500 mt-0.5 font-medium">
                            正確答案為 ({q.correctAnswer})
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Explanatory notes */}
                    <div className="space-y-4 text-xs sm:text-sm">
                      {/* Concept */}
                      <div>
                        <span className="text-blue-600 font-bold text-xs font-sans uppercase tracking-wider block mb-1">
                          解題核心觀念
                        </span>
                        <p className="text-slate-800 leading-relaxed font-sans font-semibold">
                          {q.explanation.concept}
                        </p>
                      </div>

                      {/* Review Link */}
                      <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl shrink-0 shadow-xxs">
                        <span className="text-amber-800 font-bold text-xs font-sans uppercase tracking-wider block mb-1">
                          對應課堂投影片 & 考古題複習指南
                        </span>
                        <div className="text-slate-600 text-xs leading-relaxed font-sans whitespace-pre-line">
                          {parseTex(q.explanation.reviewRef)}
                        </div>
                      </div>

                      {/* Options Analysis if MCQ */}
                      {q.type === QuestionType.MCQ && q.explanation.optionsAnalysis && (
                        <div>
                          <span className="text-slate-500 font-bold text-xs font-sans uppercase tracking-wider block mb-2">
                            各選項推理全方位透析
                          </span>
                          <div className="grid grid-cols-1 gap-2.5">
                            {Object.entries(q.explanation.optionsAnalysis).map(([letter, desc]) => (
                              <div key={letter} className="flex gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-700 shadow-xxs">
                                <span className={`font-mono font-bold shrink-0 ${letter === q.correctAnswer ? "text-emerald-600" : "text-slate-400"}`}>
                                  ({letter})
                                </span>
                                <span className="font-sans font-medium">{parseTex(desc)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Calculated Perfect Answer Template */}
                      {q.explanation.perfectTemplate && (
                        <div className="border border-emerald-250 border-emerald-200 bg-emerald-50/20 p-4 rounded-xl shadow-xxs">
                          <span className="text-emerald-705 text-emerald-700 font-bold text-xs font-sans uppercase tracking-wider block mb-1">
                            TA 評閱：100分完美手寫答題模板 (中文)
                          </span>
                          <pre className="text-slate-700 text-xs leading-relaxed font-mono whitespace-pre-wrap overflow-x-auto select-text scrollbar-thin">
                            {parseTex(q.explanation.perfectTemplate)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
