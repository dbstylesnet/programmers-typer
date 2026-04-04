type Props = {
  open: boolean;
  elapsedDisplay: string;
  accuracyPercent: number;
  previousTestName: string | null;
  nextTestName: string | null;
  canStartPreviousTest: boolean;
  canStartNextTest: boolean;
  onStartPreviousTest: () => void;
  onStartNextTest: () => void;
  onClose: () => void;
  onStartAgain: () => void;
  onShowResultsHistory: () => void;
};

export function CompletionModal({
  open,
  elapsedDisplay,
  accuracyPercent,
  previousTestName,
  nextTestName,
  canStartPreviousTest,
  canStartNextTest,
  onStartPreviousTest,
  onStartNextTest,
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
        <p className="modal-congratz-message">
          Congratulations, you have completed the test in <strong>{elapsedDisplay}</strong> with{' '}
          <strong>{accuracyPercent.toFixed(2)}%</strong> accuracy.
        </p>

        <div className="modal-adjacent-tests" role="group" aria-label="Adjacent tests">
          <div className="modal-adjacent-name modal-adjacent-name--prev">
            {previousTestName ?? '—'}
          </div>
          <div className="modal-adjacent-buttons">
            <button
              type="button"
              className="modal-btn modal-btn-adjacent"
              disabled={!canStartPreviousTest}
              onClick={onStartPreviousTest}
            >
              Start previous test
            </button>
            <button
              type="button"
              className="modal-btn modal-btn-adjacent"
              disabled={!canStartNextTest}
              onClick={onStartNextTest}
            >
              Start next test
            </button>
          </div>
          <div className="modal-adjacent-name modal-adjacent-name--next">
            {nextTestName ?? '—'}
          </div>
        </div>

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
