import { useEffect, useState, type AnimationEvent, type ReactNode } from 'react';

export type CompletionVsBest = {
  verdict: 'better' | 'worse' | 'tie' | 'first';
  deltaSeconds: number;
  /** Raw time gap vs prior best (for copy when floor seconds is 0). */
  deltaMs: number;
};

function formatCompletionDelta(deltaMs: number): string {
  if (deltaMs <= 0) return '0s';
  const whole = Math.floor(deltaMs / 1000);
  if (whole >= 1) return `${whole}s`;
  const sec = deltaMs / 1000;
  const rounded = sec.toFixed(2).replace(/\.?0+$/, '');
  return `${rounded}s`;
}

type Props = {
  open: boolean;
  elapsedDisplay: string;
  accuracyPercent: number;
  completionVsBest: CompletionVsBest | null;
  currentTestName: string;
  previousTestName: string | null;
  nextTestName: string | null;
  canSwitchPreviousTest: boolean;
  canSwitchNextTest: boolean;
  onSwitchPreviousTest: () => void;
  onSwitchNextTest: () => void;
  onClose: () => void;
  onStartTest: () => void;
  onShowResultsHistory: () => void;
};

function comparisonContent(v: CompletionVsBest): ReactNode {
  if (v.verdict === 'first') return null;
  if (v.verdict === 'tie') return 'Your result matched your best time.';
  if (v.verdict === 'better') {
    if (v.deltaMs > 0) {
      return (
        <>
          Congratulations! Your result was better by{' '}
          <strong className="modal-congratz-delta">{formatCompletionDelta(v.deltaMs)}</strong> than your best
          result.
        </>
      );
    }
    return 'Congratulations! Your result was better than your best result.';
  }
  if (v.verdict === 'worse' && v.deltaMs > 0) {
    return (
      <>
        Your result was worse by{' '}
        <strong className="modal-congratz-delta">{formatCompletionDelta(v.deltaMs)}</strong> than your best
        result.
      </>
    );
  }
  if (v.verdict === 'worse') {
    return 'Your result was worse than your best result.';
  }
  return null;
}

function comparisonWrapperClass(v: CompletionVsBest): string {
  const base = 'modal-congratz-comparison';
  if (v.verdict === 'better') return `${base} modal-congratz-comparison--better`;
  if (v.verdict === 'worse') return `${base} modal-congratz-comparison--worse`;
  if (v.verdict === 'tie') return `${base} modal-congratz-comparison--tie`;
  return base;
}

export function CompletionModal({
  open,
  elapsedDisplay,
  accuracyPercent,
  completionVsBest,
  currentTestName,
  previousTestName,
  nextTestName,
  canSwitchPreviousTest,
  canSwitchNextTest,
  onSwitchPreviousTest,
  onSwitchNextTest,
  onClose,
  onStartTest,
  onShowResultsHistory,
}: Props) {
  const [namesNavAnim, setNamesNavAnim] = useState<'prev' | 'next' | null>(null);

  useEffect(() => {
    if (!open) setNamesNavAnim(null);
  }, [open]);

  const trackClassName = [
    'modal-adjacent-names-track',
    namesNavAnim === 'prev' && 'modal-adjacent-names-track--anim-prev',
    namesNavAnim === 'next' && 'modal-adjacent-names-track--anim-next',
  ]
    .filter(Boolean)
    .join(' ');

  const handleSwitchPrevious = () => {
    if (!canSwitchPreviousTest) return;
    setNamesNavAnim('prev');
    onSwitchPreviousTest();
  };

  const handleSwitchNext = () => {
    if (!canSwitchNextTest) return;
    setNamesNavAnim('next');
    onSwitchNextTest();
  };

  const handleNamesTrackAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const name = e.animationName || '';
    if (!name.includes('modalAdjacentNames')) return;
    setNamesNavAnim(null);
  };

  if (!open) return null;

  const comparisonNode = completionVsBest ? comparisonContent(completionVsBest) : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content congratz" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <p className="modal-congratz-message modal-congratz-summary">
          Test completed in <span className="modal-congratz-time">{elapsedDisplay}</span> with{' '}
          <span className="modal-congratz-accuracy">{accuracyPercent.toFixed(2)}%</span> accuracy.
        </p>
        {comparisonNode && completionVsBest ? (
          <p className={comparisonWrapperClass(completionVsBest)}>{comparisonNode}</p>
        ) : null}

        <div className="modal-adjacent-block">
          <div className="modal-adjacent-choose-heading" id="modal-choose-test-label">
            Choose test:
          </div>
          <nav className="modal-adjacent-tests" aria-label="Choose test">
            <div
              className="modal-adjacent-names-carousel"
              role="region"
              aria-roledescription="carousel"
              aria-labelledby="modal-choose-test-label"
            >
              <div
                className={trackClassName}
                onAnimationEnd={handleNamesTrackAnimationEnd}
              >
                <div
                  className="modal-adjacent-name-slide"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Previous test: ${previousTestName ?? 'none'}`}
                >
                  <span className="modal-adjacent-name-slot-label">{previousTestName ?? '—'}</span>
                </div>
                <div
                  className="modal-adjacent-name-slide modal-adjacent-name-slide--current"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Selected test: ${currentTestName}`}
                  aria-current="true"
                >
                  <span className="modal-adjacent-name-slot-label">{currentTestName}</span>
                </div>
                <div
                  className="modal-adjacent-name-slide"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Next test: ${nextTestName ?? 'none'}`}
                >
                  <span className="modal-adjacent-name-slot-label">{nextTestName ?? '—'}</span>
                </div>
              </div>
            </div>
            <div className="modal-adjacent-nav">
              <div className="modal-adjacent-nav-item">
                <button
                  type="button"
                  className="modal-btn modal-btn-adjacent modal-btn-adjacent-nav"
                  disabled={!canSwitchPreviousTest}
                  onClick={handleSwitchPrevious}
                  aria-label="Switch to previous test"
                >
                  <span className="modal-adjacent-nav-btn-text modal-adjacent-nav-btn-text--full">
                    ← Previous test
                  </span>
                  <span
                    className="modal-adjacent-nav-btn-text modal-adjacent-nav-btn-text--short"
                    aria-hidden="true"
                  >
                    {'<-'}
                  </span>
                </button>
              </div>
              <div className="modal-adjacent-nav-item modal-adjacent-nav-item--center">
                <button type="button" className="modal-btn modal-btn-adjacent-primary" onClick={onStartTest}>
                  Start test
                </button>
              </div>
              <div className="modal-adjacent-nav-item">
                <button
                  type="button"
                  className="modal-btn modal-btn-adjacent modal-btn-adjacent-nav"
                  disabled={!canSwitchNextTest}
                  onClick={handleSwitchNext}
                  aria-label="Switch to next test"
                >
                  <span className="modal-adjacent-nav-btn-text modal-adjacent-nav-btn-text--full">
                    Next test →
                  </span>
                  <span
                    className="modal-adjacent-nav-btn-text modal-adjacent-nav-btn-text--short"
                    aria-hidden="true"
                  >
                    {'->'}
                  </span>
                </button>
              </div>
            </div>
          </nav>
        </div>

        <div className="modal-actions">
          <button type="button" className="modal-btn modal-btn-history" onClick={onShowResultsHistory}>
            Show Results History
          </button>
        </div>
      </div>
    </div>
  );
}
