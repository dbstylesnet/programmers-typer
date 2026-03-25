type Props = {
  playerName: string;
  showResults: boolean;
  onPlayerNameChange: (value: string) => void;
  onToggleResults: () => void;
};

export function PlayerSection({ playerName, showResults, onPlayerNameChange, onToggleResults }: Props) {
  return (
    <div className="player-section">
      <div className="player-left">
        <label htmlFor="playerName">Player Name: </label>
        <input
          id="playerName"
          type="text"
          value={playerName}
          onChange={(e) => onPlayerNameChange(e.target.value)}
          placeholder="Enter your name"
        />
      </div>
      <button
        onClick={onToggleResults}
        className={showResults ? 'results-toggle-hide' : 'results-toggle-show'}
      >
        {showResults ? 'Hide Results History' : 'Show Results History'}
      </button>
    </div>
  );
}

