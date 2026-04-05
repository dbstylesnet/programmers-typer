import type { KeyboardEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { addPlayer, clearPlayerResults, getPlayerResults, getPlayerStats, PlayerResult, saveResult } from '../database';
import { TEST_CATEGORIES, type TestCategoryKey, type TestExplanationParts } from '../data/tests';

type SelectedTest = {
  category: TestCategoryKey;
  index: number;
};

function formatTime(seconds: number): string {
  return `${seconds}s`;
}

export function useTypingTest() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const DEFAULT_PLAYER_NAME = 'Guest';

  const [playerName, setPlayerName] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [playerResults, setPlayerResults] = useState<PlayerResult[]>([]);
  const [playerStats, setPlayerStats] = useState<any>(null);

  const [selected, setSelected] = useState<SelectedTest | null>(null);
  const [practiceText, setPracticeText] = useState('');
  const [targetTextLength, setTargetTextLength] = useState(0);

  const [typed, setTyped] = useState('');
  const [accuracyCount, setAccuracyCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const allTests = useMemo(() => {
    const flattened: Array<{
      category: TestCategoryKey;
      index: number;
      name: string;
      text: string;
      explanation: TestExplanationParts;
    }> = [];
    for (const cat of TEST_CATEGORIES) {
      cat.tests.forEach((t, idx) =>
        flattened.push({
          category: cat.key,
          index: idx,
          name: t.name,
          text: t.text,
          explanation: t.explanation,
        }),
      );
    }
    return flattened;
  }, []);

  const selectedTestName = useMemo(() => {
    if (!selected) return 'Unknown Test';
    const cat = TEST_CATEGORIES.find((c) => c.key === selected.category);
    const name = cat?.tests[selected.index]?.name;
    return name ?? 'Unknown Test';
  }, [selected]);

  const selectedTestExplanation = useMemo((): TestExplanationParts | null => {
    if (!selected) return null;
    const cat = TEST_CATEGORIES.find((c) => c.key === selected.category);
    return cat?.tests[selected.index]?.explanation ?? null;
  }, [selected]);

  const selectedGlobalIndex = useMemo(() => {
    if (!selected) return 0;
    const idx = allTests.findIndex((t) => t.category === selected.category && t.index === selected.index);
    return idx >= 0 ? idx : 0;
  }, [allTests, selected]);

  const completionAdjacent = useMemo(() => {
    const prev = selectedGlobalIndex > 0 ? allTests[selectedGlobalIndex - 1] : null;
    const next = selectedGlobalIndex < allTests.length - 1 ? allTests[selectedGlobalIndex + 1] : null;
    return {
      previousTestName: prev?.name ?? null,
      nextTestName: next?.name ?? null,
      canStartPrevious: Boolean(prev),
      canStartNext: Boolean(next),
    };
  }, [allTests, selectedGlobalIndex]);

  useEffect(() => {
    const savedPlayer = localStorage.getItem('currentPlayer');
    if (savedPlayer) setPlayerName(savedPlayer);
  }, []);

  useEffect(() => {
    if (!playerName) {
      setPlayerResults([]);
      setPlayerStats(null);
      return;
    }
    const results = getPlayerResults(playerName);
    const stats = getPlayerStats(playerName);
    setPlayerResults(results);
    setPlayerStats(stats);
  }, [playerName]);

  useEffect(() => {
    if (!showResults) return;
    if (playerResults.length > 0) return;
    setShowResults(false);
  }, [playerResults.length, showResults]);

  useEffect(() => {
    if (isRunning && startTime) {
      const interval = window.setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 100);
      return () => window.clearInterval(interval);
    }
    return;
  }, [isRunning, startTime]);

  useEffect(() => {
    if (selected) return;
    if (allTests.length === 0) return;
    const randomIndex = Math.floor(Math.random() * allTests.length);
    const t = allTests[randomIndex];
    setSelected({ category: t.category, index: t.index });
    setPracticeText(t.text);
    setTargetTextLength(t.text.length);
  }, [allTests, selected]);

  const refreshPlayerStats = (name: string) => {
    const results = getPlayerResults(name);
    const stats = getPlayerStats(name);
    setPlayerResults(results);
    setPlayerStats(stats);
  };

  const handlePlayerNameChange = (nextNameRaw: string) => {
    const nextName = nextNameRaw.trim();
    setPlayerName(nextName);
    if (nextName) {
      localStorage.setItem('currentPlayer', nextName);
      addPlayer(nextName);
      refreshPlayerStats(nextName);
    }
  };

  const selectTest = (category: TestCategoryKey, index: number) => {
    const cat = TEST_CATEGORIES.find((c) => c.key === category);
    const nextText = cat?.tests[index]?.text ?? '';
    setSelected({ category, index });
    setPracticeText(nextText);
    setTargetTextLength(nextText.length);
    setTyped('');
    setAccuracyCount(0);
    setIsRunning(false);
    setStartTime(null);
    setElapsedSeconds(0);
    setIsCompleteModalOpen(false);
  };

  const start = () => {
    if (!practiceText) return;
    setIsRunning(true);
    setStartTime(Date.now());
    setElapsedSeconds(0);
    setTyped('');
    setAccuracyCount(0);
    setIsCompleteModalOpen(false);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const stop = () => {
    setIsRunning(false);
    setStartTime(null);
    setElapsedSeconds(0);
    setTyped('');
    setAccuracyCount(0);
    setIsCompleteModalOpen(false);
  };

  const toggleStartStop = () => {
    if (isRunning) stop();
    else start();
  };

  const saveTestResult = (completed: boolean) => {
    const name = playerName || DEFAULT_PLAYER_NAME;
    if (!playerName) {
      setPlayerName(name);
      localStorage.setItem('currentPlayer', name);
      addPlayer(name);
    }
    const endTime = Date.now();
    const duration = startTime ? endTime - startTime : 0;
    const accuracy = typed.length > 0 ? (accuracyCount / typed.length) * 100 : 0;
    const progress = practiceText.length > 0 ? (typed.length / practiceText.length) * 100 : 0;

    const result: PlayerResult = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      playerName: name,
      textIndex: selectedGlobalIndex,
      testName: selectedTestName,
      accuracy,
      progress,
      correctChars: accuracyCount,
      totalChars: typed.length,
      targetLength: practiceText.length,
      completed,
      startTime: startTime || endTime,
      endTime,
      duration,
      date: new Date().toISOString(),
    };

    saveResult(result);
    refreshPlayerStats(name);
  };

  const onTextareaKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Tab') return;
    event.preventDefault();
    const textarea = event.currentTarget;
    const startIdx = textarea.selectionStart;
    const endIdx = textarea.selectionEnd;
    const spaces = '    ';
    const newText = typed.substring(0, startIdx) + spaces + typed.substring(endIdx);
    setTyped(newText);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = startIdx + spaces.length;
    }, 0);
  };

  const onTextareaChange = (nextValue: string) => {
    if (!isRunning && nextValue.length > 0) return;

    let correct = 0;
    const chars = nextValue.split('');
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] === practiceText[i]) correct++;
    }
    setAccuracyCount(correct);
    setTyped(nextValue);

    const isExactMatch = nextValue === practiceText;
    const isLengthMatch = nextValue.length === targetTextLength && targetTextLength > 0;
    const isCompleted = isExactMatch || isLengthMatch;

    if (isCompleted && !isCompleteModalOpen) {
      setIsCompleteModalOpen(true);
      setIsRunning(false);
      setStartTime(null);
      saveTestResult(true);
    }
  };

  const onTextareaClick = () => {
    if (!isRunning && practiceText) start();
  };

  const startAgainAfterCompletion = () => {
    if (!practiceText) return;
    start();
  };

  const beginTestAtGlobalIndex = (globalIdx: number) => {
    const t = allTests[globalIdx];
    if (!t) return;
    const cat = TEST_CATEGORIES.find((c) => c.key === t.category);
    const nextText = cat?.tests[t.index]?.text ?? '';
    setIsCompleteModalOpen(false);
    setSelected({ category: t.category, index: t.index });
    setPracticeText(nextText);
    setTargetTextLength(nextText.length);
    setTyped('');
    setAccuracyCount(0);
    setIsRunning(true);
    setStartTime(Date.now());
    setElapsedSeconds(0);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const startPreviousTestFromCompletion = () => {
    if (selectedGlobalIndex <= 0) return;
    beginTestAtGlobalIndex(selectedGlobalIndex - 1);
  };

  const startNextTestFromCompletion = () => {
    if (selectedGlobalIndex >= allTests.length - 1) return;
    beginTestAtGlobalIndex(selectedGlobalIndex + 1);
  };

  const showResultsHistoryAfterCompletion = () => {
    setIsCompleteModalOpen(false);
    setShowResults(true);
  };

  const clearPlayerHistory = () => {
    if (!playerName) return;
    clearPlayerResults(playerName);
    refreshPlayerStats(playerName);
  };

  /** Most recent completed run per test name (for test list buttons). */
  const lastResultByTestName = useMemo(() => {
    const out: Record<string, { timeSeconds: number; accuracy: number }> = {};
    const sorted = [...playerResults].sort((a, b) => {
      const ta = new Date(a.date).getTime();
      const tb = new Date(b.date).getTime();
      return tb - ta;
    });
    for (const r of sorted) {
      if (!r.completed || !r.testName) continue;
      if (out[r.testName] !== undefined) continue;
      out[r.testName] = {
        timeSeconds: Math.max(0, Math.floor(r.duration / 1000)),
        accuracy: r.accuracy,
      };
    }
    return out;
  }, [playerResults]);

  const accuracyPercent = useMemo(() => {
    const denom = typed.length || 1;
    return (accuracyCount / denom) * 100;
  }, [accuracyCount, typed.length]);

  const progressPercent = useMemo(() => {
    const denom = practiceText.length || 1;
    return (typed.length / denom) * 100;
  }, [practiceText.length, typed.length]);

  return {
    textareaRef,

    playerName,
    showResults,
    playerResults,
    playerStats,
    setShowResults,
    handlePlayerNameChange,

    categories: TEST_CATEGORIES,
    lastResultByTestName,
    selected,
    selectedTestName,
    selectedTestExplanation,
    selectTest,

    practiceText,
    typed,
    isRunning,
    elapsedSeconds,
    elapsedDisplay: formatTime(elapsedSeconds),
    accuracyPercent,
    progressPercent,

    toggleStartStop,
    onTextareaChange,
    onTextareaKeyDown,
    onTextareaClick,

    isCompleteModalOpen,
    closeCompleteModal: () => setIsCompleteModalOpen(false),
    startAgainAfterCompletion,
    showResultsHistoryAfterCompletion,
    clearPlayerHistory,

    completionPreviousTestName: completionAdjacent.previousTestName,
    completionNextTestName: completionAdjacent.nextTestName,
    canStartPreviousTestFromCompletion: completionAdjacent.canStartPrevious,
    canStartNextTestFromCompletion: completionAdjacent.canStartNext,
    startPreviousTestFromCompletion,
    startNextTestFromCompletion,
  };
}

