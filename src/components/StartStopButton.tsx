type Props = {
  disabled: boolean;
  isRunning: boolean;
  onClick: () => void;
};

export function StartStopButton({ disabled, isRunning, onClick }: Props) {
  return (
    <div className="start-button-container">
      <button onClick={onClick} disabled={disabled} className={`start-button ${isRunning ? 'stop-button' : ''}`}>
        {isRunning ? 'Stop test' : 'Start test'}
      </button>
    </div>
  );
}

