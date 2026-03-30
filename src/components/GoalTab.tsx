import { useEffect, useRef, useState } from 'react';

export function GoalTab(): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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
                <strong>Syntax</strong> — You repeat real code patterns so keywords, brackets, and structure stick in muscle
                memory.
              </li>
              <li>
                <strong>Programming keys</strong> — You train the keys you use most when coding: braces, parens,
                operators, punctuation, and indentation (including Tab where it matters).
              </li>
              <li>
                <strong>Real apps</strong> — You learn crucial components of real applications: the same imports,
                hooks, handlers, and layout patterns you see in production code.
              </li>
              <li>
                <strong>Better coding flow</strong> — Faster, more accurate typing means less time fighting the keyboard
                and more focus on logic and problem solving.
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
