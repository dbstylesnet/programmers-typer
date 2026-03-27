import './App.css';
import { CompletionModal } from './components/CompletionModal';
import { PlayerSection } from './components/PlayerSection';
import { ResultsPanel } from './components/ResultsPanel';
import { StartStopButton } from './components/StartStopButton';
import { TestSelector } from './components/TestSelector';
import { TypingArea } from './components/TypingArea';
import { useTypingTest } from './hooks/useTypingTest';

const App = (): JSX.Element => {
  const t = useTypingTest();

  return (
    <div className="main-container">
      <div className="sub-header main-header">
        <h2>Programmers typing training</h2>
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
        showResults={t.showResults}
        onToggleResults={() => t.setShowResults(!t.showResults)}
      />

      <StartStopButton disabled={!t.practiceText} isRunning={t.isRunning} onClick={t.toggleStartStop} />

      <TypingArea
        textareaRef={t.textareaRef}
        typed={t.typed}
        practiceText={t.practiceText}
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

      <CompletionModal
        open={t.isCompleteModalOpen}
        elapsedDisplay={t.elapsedDisplay}
        onClose={t.closeCompleteModal}
        onStartAgain={t.startAgainAfterCompletion}
        onShowResultsHistory={t.showResultsHistoryAfterCompletion}
      />
    </div>
  );
};

export default App;
