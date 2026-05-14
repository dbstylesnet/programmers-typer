import type { TestExplanationParts } from '../data/tests';
import { useEffect, useRef, useState } from 'react';

const CROSSFADE_HALF_MS = 150;

const emptyExpl: TestExplanationParts = { whatItDoes: '', typicalUse: '' };

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

type Panel = { visKey: string; expl: TestExplanationParts; phase: 'in' | 'out' };

type Props = {
  explanation: TestExplanationParts | null;
  /** Changes when the user picks another test; drives the crossfade. */
  transitionKey: string;
};

export function TestExplanationSection({ explanation, transitionKey }: Props) {
  const [panel, setPanel] = useState<Panel>(() => ({
    visKey: transitionKey,
    expl: explanation ?? emptyExpl,
    phase: 'in',
  }));

  const latest = useRef({ transitionKey, explanation: explanation ?? emptyExpl });
  latest.current = { transitionKey, explanation: explanation ?? emptyExpl };

  const panelRef = useRef(panel);
  panelRef.current = panel;

  const hadExplanationRef = useRef(Boolean(explanation));

  useEffect(() => {
    if (!explanation) {
      hadExplanationRef.current = false;
      return;
    }

    if (!hadExplanationRef.current) {
      hadExplanationRef.current = true;
      setPanel({ visKey: transitionKey, expl: explanation, phase: 'in' });
      return;
    }

    if (transitionKey === panelRef.current.visKey) return;

    if (prefersReducedMotion()) {
      const l = latest.current;
      setPanel({ visKey: l.transitionKey, expl: l.explanation, phase: 'in' });
      return;
    }

    setPanel((p) => ({ ...p, phase: 'out' }));
    const tid = window.setTimeout(() => {
      const l = latest.current;
      setPanel({ visKey: l.transitionKey, expl: l.explanation, phase: 'out' });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPanel((p) => ({ ...p, phase: 'in' }));
        });
      });
    }, CROSSFADE_HALF_MS);
    return () => window.clearTimeout(tid);
  }, [explanation, transitionKey]);

  if (!explanation) return null;

  const surfaceClass =
    panel.phase === 'in'
      ? 'content-crossfade-surface content-crossfade-surface--in'
      : 'content-crossfade-surface content-crossfade-surface--out';

  return (
    <section className="test-explanation-section" aria-labelledby="test-explanation-heading">
      <div className="sub-header test-explanation-title">
        <h3 id="test-explanation-heading" className="test-explanation-heading">
          EXPLANATION:
        </h3>
      </div>
      <div className={surfaceClass}>
        <div className="test-explanation-content">
          <p className="test-explanation-part">
            <span className="test-explanation-label">What it does: </span>
            {panel.expl.whatItDoes}
          </p>
          <p className="test-explanation-part">
            <span className="test-explanation-label">Where it's used: </span>
            {panel.expl.typicalUse}
          </p>
        </div>
      </div>
    </section>
  );
}
