import { useEffect, useRef, useState } from 'react';

export function GoalTab(): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Unfold on initial page load.
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open]);

  return (
    <div className={`goal-tab-root${open ? ' goal-tab-root--open' : ''}`} ref={rootRef}>
      <div className="goal-tab-shell">
        <div
          id="goal-tab-panel"
          className="goal-tab-expand"
          role="region"
          aria-labelledby="goal-tab-label"
          aria-hidden={!open}
        >
          <div className="goal-tab-expand-inner">
            <button type="button" className="goal-tab-close" onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>
            <h3 className="goal-tab-title">Why ProgTyper?</h3>
            <ul className="goal-tab-list">
              <li>
                <strong>Muscle memory</strong> — Learn code patterns, keywords, brackets, and structure.
              </li>
              <li>
                <strong>Programming keys</strong> — Improve typing speed and accuracy using programming keys.
              </li>
              <li>
                <strong>App components</strong> — Get to know the typical components of real apps.
              </li>
              <li>
                <strong>Problem solving</strong> — Don't waste time on thinking what to type, focus on logic and coding flow.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="goal-tab-footer">
        <button
          type="button"
          className="goal-tab-trigger goal-tab-label"
          id="goal-tab-label"
          aria-expanded={open}
          aria-controls="goal-tab-panel"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="goal-tab-trigger-label">GOAL</span>
          <span className="goal-tab-chevron" aria-hidden>
            ▲
          </span>
        </button>
      </div>
    </div>
  );
}
