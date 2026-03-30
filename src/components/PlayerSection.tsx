type Props = {
  playerName: string;
  onPlayerNameChange: (value: string) => void;
};

export function PlayerSection({ playerName, onPlayerNameChange }: Props) {
  return (
    <div className="player-section">
      <div className="player-left">
        <label htmlFor="playerName">Player Name: </label>
        <input
          id="playerName"
          type="text"
          value={playerName}
          className={playerName ? '' : 'player-name-input--pulsate'}
          onChange={(e) => onPlayerNameChange(e.target.value)}
          placeholder="Enter your name"
        />
      </div>
    </div>
  );
}

