import './App.css';
import { CompletionModal } from './components/CompletionModal';
import { PlayerSection } from './components/PlayerSection';
import { ResultsPanel } from './components/ResultsPanel';
import { StartStopButton } from './components/StartStopButton';
import { StatsHeader } from './components/StatsHeader';
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
        showResults={t.showResults}
        onPlayerNameChange={t.handlePlayerNameChange}
        onToggleResults={() => t.setShowResults(!t.showResults)}
      />

      <ResultsPanel playerName={t.playerName} show={t.showResults} stats={t.playerStats} results={t.playerResults} />

      <StatsHeader elapsedDisplay={t.elapsedDisplay} accuracyPercent={t.accuracyPercent} progressPercent={t.progressPercent} />

      <TestSelector categories={t.categories} selected={t.selected} disabled={t.isRunning} onSelect={t.selectTest} />

      <StartStopButton disabled={!t.practiceText} isRunning={t.isRunning} onClick={t.toggleStartStop} />

      <TypingArea
        textareaRef={t.textareaRef}
        typed={t.typed}
        practiceText={t.practiceText}
        disabled={!t.isRunning}
        onChange={t.onTextareaChange}
        onKeyDown={t.onTextareaKeyDown}
        onClick={t.onTextareaClick}
      />

      <CompletionModal open={t.isCompleteModalOpen} elapsedDisplay={t.elapsedDisplay} onClose={t.closeCompleteModal} />
    </div>
  );
};

export default App;
