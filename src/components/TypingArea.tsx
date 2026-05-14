import type { KeyboardEvent, RefObject } from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getTextareaCaretCoordinates } from '../utils/getTextareaCaretCoordinates';

const CROSSFADE_HALF_MS = 150;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

type Props = {
  textareaRef: RefObject<HTMLTextAreaElement>;
  typed: string;
  practiceText: string;
  selectedTestName: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onClick: () => void;
  elapsedDisplay: string;
  accuracyPercent: number;
  progressPercent: number;
};

type Panel = {
  visKey: string;
  visPractice: string;
  visTyped: string;
  phase: 'in' | 'out';
};

export function TypingArea({
  textareaRef,
  typed,
  practiceText,
  selectedTestName,
  disabled,
  onChange,
  onKeyDown,
  onClick,
  elapsedDisplay,
  accuracyPercent,
  progressPercent,
}: Props) {
  const targetRef = useRef<HTMLTextAreaElement>(null);
  const measureRef = useRef<HTMLTextAreaElement>(null);
  const [areaHeight, setAreaHeight] = useState<number>(700);
  const [caretPixel, setCaretPixel] = useState({ top: 0, left: 0, height: 18 });

  const [panel, setPanel] = useState<Panel>(() => ({
    visKey: selectedTestName,
    visPractice: practiceText,
    visTyped: typed,
    phase: 'in',
  }));

  const propsLatest = useRef({ selectedTestName, practiceText, typed });
  propsLatest.current = { selectedTestName, practiceText, typed };

  const panelRef = useRef(panel);
  panelRef.current = panel;

  const updateCaretPixel = useCallback(() => {
    const el = textareaRef.current;
    if (!el || disabled) return;
    const pos = Math.min(el.selectionStart ?? 0, el.value.length);
    const { top, left, height } = getTextareaCaretCoordinates(el, pos);
    setCaretPixel({
      top: top - el.scrollTop,
      left: left - el.scrollLeft,
      height: Math.max(12, height),
    });
  }, [disabled, textareaRef]);

  const measure = () => {
    const el = measureRef.current;
    if (!el) return;
    const next = Math.max(200, el.scrollHeight + 8);
    setAreaHeight(next);
  };

  useEffect(() => {
    if (selectedTestName === panelRef.current.visKey) return;

    if (prefersReducedMotion()) {
      const cur = propsLatest.current;
      setPanel({
        visKey: cur.selectedTestName,
        visPractice: cur.practiceText,
        visTyped: cur.typed,
        phase: 'in',
      });
      return;
    }

    setPanel((p) => ({ ...p, phase: 'out' }));
    const tid = window.setTimeout(() => {
      const cur = propsLatest.current;
      setPanel({
        visKey: cur.selectedTestName,
        visPractice: cur.practiceText,
        visTyped: cur.typed,
        phase: 'out',
      });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPanel((p) => ({ ...p, phase: 'in' }));
        });
      });
    }, CROSSFADE_HALF_MS);
    return () => window.clearTimeout(tid);
  }, [selectedTestName]);

  useEffect(() => {
    setPanel((p) => {
      if (selectedTestName !== p.visKey || p.phase !== 'in') return p;
      if (p.visPractice === practiceText && p.visTyped === typed) return p;
      return { ...p, visPractice: practiceText, visTyped: typed };
    });
  }, [selectedTestName, practiceText, typed]);

  useLayoutEffect(() => {
    requestAnimationFrame(measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panel.visPractice]);

  useEffect(() => {
    const onResize = () => requestAnimationFrame(measure);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (disabled) return;
    const id = requestAnimationFrame(() => updateCaretPixel());
    return () => cancelAnimationFrame(id);
  }, [panel.visTyped, disabled, areaHeight, panel.visPractice, updateCaretPixel]);

  useEffect(() => {
    if (disabled) return;
    const el = textareaRef.current;
    if (!el) return;
    const sync = () => requestAnimationFrame(updateCaretPixel);
    el.addEventListener('scroll', sync);
    el.addEventListener('click', sync);
    el.addEventListener('keyup', sync);
    const onSelectionChange = () => {
      if (document.activeElement === el) sync();
    };
    document.addEventListener('selectionchange', onSelectionChange);
    return () => {
      el.removeEventListener('scroll', sync);
      el.removeEventListener('click', sync);
      el.removeEventListener('keyup', sync);
      document.removeEventListener('selectionchange', onSelectionChange);
    };
  }, [disabled, updateCaretPixel, textareaRef]);

  const surfaceClass =
    panel.phase === 'in'
      ? 'content-crossfade-surface content-crossfade-surface--in'
      : 'content-crossfade-surface content-crossfade-surface--out';

  return (
    <div className="typing-area-wrapper">
      <div className={`typing-area-main ${surfaceClass}`}>
        <div className="sub-header practice-text-label">
          <h3>
            Practice text: <span className="practice-test-name">{panel.visKey}</span>
          </h3>
          <div className="practice-metrics">
            <div className="practice-metric">Time: {elapsedDisplay}</div>
            <div className="practice-metric">Accuracy: {accuracyPercent.toFixed(2)}%</div>
            <div className="practice-metric">Progress: {progressPercent.toFixed(2)}%</div>
          </div>
        </div>

        <div className="mainTextAreas">
          <div className="textAreas" style={{ minHeight: areaHeight + 24 }}>
            <div className="typing-input-shell" style={{ height: areaHeight, minHeight: areaHeight }}>
              <textarea
                ref={textareaRef}
                className={`textInputs topP${disabled ? '' : ' typing-smooth-caret-active'}`}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                onClick={onClick}
                value={panel.visTyped}
                disabled={disabled}
                spellCheck={false}
                style={{ height: areaHeight, minHeight: areaHeight }}
              />
              {!disabled ? (
                <div className="typing-caret-overlay" aria-hidden>
                  <div
                    className="typing-caret-pipe"
                    style={{
                      top: caretPixel.top,
                      left: caretPixel.left,
                      height: caretPixel.height,
                    }}
                  />
                </div>
              ) : null}
            </div>
            <textarea
              ref={targetRef}
              className="textInputs bottomP"
              value={panel.visPractice}
              readOnly
              spellCheck={false}
              style={{ height: areaHeight, minHeight: areaHeight }}
            />
            <textarea
              ref={measureRef}
              className="textInputs bottomP"
              value={panel.visPractice}
              readOnly
              aria-hidden="true"
              tabIndex={-1}
              spellCheck={false}
              style={{
                position: 'absolute',
                left: -99999,
                top: 0,
                height: 'auto',
                minHeight: 0,
                maxHeight: 'none',
                overflow: 'hidden',
                opacity: 0,
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
