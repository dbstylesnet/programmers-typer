import './App.css';
import { CompletionModal } from './components/CompletionModal';
import { GoalTab } from './components/GoalTab';
import { PlayerSection } from './components/PlayerSection';
import { ResultsPanel } from './components/ResultsPanel';
import { StartStopButton } from './components/StartStopButton';
import { TestExplanationSection } from './components/TestExplanationSection';
import { TestSelector } from './components/TestSelector';
import { TypingArea } from './components/TypingArea';
import { useTypingTest } from './hooks/useTypingTest';
import { useEffect, useState } from 'react';

function isWebViewUserAgent(): boolean {
  const ua = navigator.userAgent || '';

  // React Native / RNWebView
  const hasRNWebView = typeof (window as any).ReactNativeWebView !== 'undefined';

  // Android WebView / iOS embedded browsers usually add “wv” or “WebView” tokens.
  const hasWebViewToken = /WebView/i.test(ua) || /\bwv\)/i.test(ua) || /\bwv\b/i.test(ua);

  // Facebook apps embed browsers using a webview-like environment.
  const isFacebookApp = /FBAN|FBAV/i.test(ua);

  return hasRNWebView || hasWebViewToken || (isFacebookApp && hasWebViewToken);
}

const App = (): JSX.Element => {
  const t = useTypingTest();
  const [isWebView, setIsWebView] = useState(false);

  useEffect(() => {
    setIsWebView(isWebViewUserAgent());
  }, []);

  // WebView keyboard workaround: while typing, increase bottom padding by half the viewport height.
  // This prevents the keyboard from covering the typing area when embedded webviews don't resize.
  useEffect(() => {
    const root = document.documentElement;

    if (!isWebView || !t.isRunning) {
      root.style.setProperty('--webview-bottom-pad', '0px');
      return;
    }

    const update = () => {
      const half = Math.floor(window.innerHeight / 2);
      root.style.setProperty('--webview-bottom-pad', `${half}px`);
    };

    update();
    window.addEventListener('resize', update);

    return () => {
      root.style.setProperty('--webview-bottom-pad', '0px');
      window.removeEventListener('resize', update);
    };
  }, [isWebView, t.isRunning]);

  return (
    <div className="main-container">
      <div className="sub-header main-header">
        <img src="/logo.png" alt="Programmers Typer Logo" className="main-header-logo" />
      </div>

      <PlayerSection
        playerName={t.playerName}
        onPlayerNameChange={t.handlePlayerNameChange}
      />

      <ResultsPanel playerName={t.playerName} show={t.showResults} stats={t.playerStats} results={t.playerResults} />

      <TestSelector
        categories={t.categories}
        selected={t.selected}
        disabled={t.isRunning}
        onSelect={t.selectTest}
        lastResultByTestName={t.lastResultByTestName}
        testPerfVsBest={t.testPerfVsBest}
        showResults={t.showResults}
        hasHistory={t.playerResults.length > 0}
        onToggleResults={() => t.setShowResults(!t.showResults)}
        onClearHistory={t.clearPlayerHistory}
        canClearHistory={Boolean(t.playerName)}
      />

      <TestExplanationSection explanation={t.selectedTestExplanation} />

      <StartStopButton disabled={!t.practiceText} isRunning={t.isRunning} onClick={t.toggleStartStop} />

      <TypingArea
        textareaRef={t.textareaRef}
        typed={t.typed}
        practiceText={t.practiceText}
        selectedTestName={t.selectedTestName}
        disabled={!t.isRunning}
        onChange={t.onTextareaChange}
        onKeyDown={t.onTextareaKeyDown}
        onClick={t.onTextareaClick}
        elapsedDisplay={t.elapsedDisplay}
        accuracyPercent={t.accuracyPercent}
        progressPercent={t.progressPercent}
      />

      <div className="bmc-button-container">
        <a
          href="https://www.buymeacoffee.com/darkiddle"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            className="bmc-button-img"
          />
        </a>
      </div>

      <GoalTab />

      <CompletionModal
        open={t.isCompleteModalOpen}
        elapsedDisplay={t.completionModalSnapshot?.elapsedDisplay ?? t.elapsedDisplay}
        accuracyPercent={t.completionModalSnapshot?.accuracyPercent ?? t.accuracyPercent}
        completionVsBest={t.completionModalSnapshot?.completionVsBest ?? t.completionVsBest}
        currentTestName={t.selectedTestName}
        previousTestName={t.completionPreviousTestName}
        nextTestName={t.completionNextTestName}
        canSwitchPreviousTest={t.canSwitchToPreviousTestFromCompletion}
        canSwitchNextTest={t.canSwitchToNextTestFromCompletion}
        onSwitchPreviousTest={t.switchToPreviousTestFromCompletion}
        onSwitchNextTest={t.switchToNextTestFromCompletion}
        onClose={t.closeCompleteModal}
        onStartTest={t.startAgainAfterCompletion}
        onShowResultsHistory={t.showResultsHistoryAfterCompletion}
      />
    </div>
  );
};

export default App;
