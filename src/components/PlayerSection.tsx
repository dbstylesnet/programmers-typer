type Props = {
  playerName: string;
  showResults: boolean;
  onPlayerNameChange: (value: string) => void;
  onToggleResults: () => void;
};

export function PlayerSection({ playerName, showResults, onPlayerNameChange, onToggleResults }: Props) {
  return (
    <div className="player-section">
      <label htmlFor="playerName">Player Name: </label>
      <input
        id="playerName"
        type="text"
        value={playerName}
        onChange={(e) => onPlayerNameChange(e.target.value)}
        placeholder="Enter your name"
      />
      <button onClick={onToggleResults}>{showResults ? 'Hide' : 'Show'} Results</button>
    </div>
  );
}

