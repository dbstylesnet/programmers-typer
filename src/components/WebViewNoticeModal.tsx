type Props = {
  open: boolean;
  onClose: () => void;
};

export function WebViewNoticeModal({ open, onClose }: Props): JSX.Element | null {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose} aria-label="WebView notice">
      <div className="modal-content webview-notice" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h4 className="webview-notice-title">vebview in use</h4>
        <p className="webview-notice-body">
          Keyboard viewport behavior may differ inside embedded webviews. If the typing area doesn’t
          stay visible, try scrolling the page slightly or rotating the device.
        </p>
      </div>
    </div>
  );
}

