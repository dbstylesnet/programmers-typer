import type { KeyboardEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { addPlayer, getPlayerResults, getPlayerStats, PlayerResult, saveResult } from '../database';
import { TEST_CATEGORIES, TestCategoryKey } from '../data/tests';

type SelectedTest = {
  category: TestCategoryKey;
  index: number;
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function useTypingTest() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    const flattened: Array<{ category: TestCategoryKey; index: number; name: string; text: string }> = [];
    for (const cat of TEST_CATEGORIES) {
      cat.tests.forEach((t, idx) => flattened.push({ category: cat.key, index: idx, name: t.name, text: t.text }));
    }
    return flattened;
  }, []);

  const selectedTestName = useMemo(() => {
    if (!selected) return 'Unknown Test';
    const cat = TEST_CATEGORIES.find((c) => c.key === selected.category);
    const name = cat?.tests[selected.index]?.name;
    return name ?? 'Unknown Test';
  }, [selected]);

  const selectedGlobalIndex = useMemo(() => {
    if (!selected) return 0;
    const idx = allTests.findIndex((t) => t.category === selected.category && t.index === selected.index);
    return idx >= 0 ? idx : 0;
  }, [allTests, selected]);

  useEffect(() => {
    const savedPlayer = localStorage.getItem('currentPlayer');
    if (savedPlayer) setPlayerName(savedPlayer);
  }, []);

  useEffect(() => {
    if (!playerName) return;
    const results = getPlayerResults(playerName);
    const stats = getPlayerStats(playerName);
    setPlayerResults(results);
    setPlayerStats(stats);
  }, [playerName]);

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
    if (!playerName) return;
    const endTime = Date.now();
    const duration = startTime ? endTime - startTime : 0;
    const accuracy = typed.length > 0 ? (accuracyCount / typed.length) * 100 : 0;
    const progress = practiceText.length > 0 ? (typed.length / practiceText.length) * 100 : 0;

    const result: PlayerResult = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      playerName,
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
    refreshPlayerStats(playerName);
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
    selected,
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
  };
}

