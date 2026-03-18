type Props = {
  open: boolean;
  elapsedDisplay: string;
  onClose: () => void;
};

export function CompletionModal({ open, elapsedDisplay, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content congratz" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h4 className="sub-header">Congratulations, you have completed typing test!</h4>
        <p>Time: {elapsedDisplay}</p>
        <p>You can check your results in the results section above.</p>
      </div>
    </div>
  );
}

