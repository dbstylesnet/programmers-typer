type Props = {
  open: boolean;
  elapsedDisplay: string;
  onClose: () => void;
  onStartAgain: () => void;
  onShowResultsHistory: () => void;
};

export function CompletionModal({
  open,
  elapsedDisplay,
  onClose,
  onStartAgain,
  onShowResultsHistory,
}: Props) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content congratz" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <p className="modal-congratz-message">Congratulations, test time: {elapsedDisplay}.</p>
        <div className="modal-actions">
          <button type="button" className="modal-btn modal-btn-start" onClick={onStartAgain}>
            Start again
          </button>
          <button type="button" className="modal-btn modal-btn-history" onClick={onShowResultsHistory}>
            Show Results History
          </button>
        </div>
      </div>
    </div>
  );
}
