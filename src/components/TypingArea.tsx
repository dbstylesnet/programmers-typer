import type { KeyboardEvent, RefObject } from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getTextareaCaretCoordinates } from '../utils/getTextareaCaretCoordinates';

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
  const viewportCleanupRef = useRef<(() => void) | null>(null);

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

  useLayoutEffect(() => {
    // Ensure value is rendered before measuring.
    requestAnimationFrame(measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practiceText]);

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
  }, [typed, disabled, areaHeight, practiceText, updateCaretPixel]);

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

  const setKeyboardOffset = (px: number) => {
    const safe = Math.max(0, Math.floor(px));
    document.documentElement.style.setProperty('--keyboard-offset', `${safe}px`);
  };

  const handleFocus = () => {
    const el = textareaRef.current;
    if (!el) return;

    // Best-effort: ensure the caret/textarea stays visible in webviews
    // that don't resize the layout viewport when the keyboard opens.
    const vv = window.visualViewport;
    let rafId = 0;
    let intervalId: number | null = null;

    const ensureVisible = () => {
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const offsetTop = window.visualViewport?.offsetTop ?? 0;

      const overlap = Math.max(0, window.innerHeight - viewportHeight - offsetTop);
      setKeyboardOffset(overlap);

      // If the textarea bottom is below the visible viewport, scroll just enough.
      const rect = el.getBoundingClientRect();
      const visibleBottom = viewportHeight - 12; // a little breathing room
      const overshoot = rect.bottom - visibleBottom;
      if (overshoot > 0) {
        window.scrollBy({ top: overshoot + 12, left: 0, behavior: 'smooth' });
      }
    };

    const update = () => {
      ensureVisible();
    };

    // Initial nudge.
    setTimeout(() => {
      // Don't use scrollIntoView alone: some webviews ignore it during keyboard open.
      ensureVisible();
    }, 50);

    if (vv) {
      vv.addEventListener('resize', update);
      vv.addEventListener('scroll', update);
      viewportCleanupRef.current = () => {
        vv.removeEventListener('resize', update);
        vv.removeEventListener('scroll', update);
      };
    } else {
      // Fallback: at least remove any stale offset.
      setKeyboardOffset(0);
    }

    // Extra fallback: poll briefly after focus to catch keyboards that
    // don't emit reliable resize/visualViewport events in embedded webviews.
    const startedAt = Date.now();
    const tick = () => {
      ensureVisible();
      if (Date.now() - startedAt < 1800 && document.activeElement === el) {
        rafId = window.requestAnimationFrame(tick);
      }
    };
    rafId = window.requestAnimationFrame(tick);
    intervalId = window.setInterval(ensureVisible, 120);

    const prevCleanup = viewportCleanupRef.current;
    viewportCleanupRef.current = () => {
      prevCleanup?.();
      if (rafId) window.cancelAnimationFrame(rafId);
      if (intervalId !== null) window.clearInterval(intervalId);
    };
  };

  const handleBlur = () => {
    viewportCleanupRef.current?.();
    viewportCleanupRef.current = null;
    setKeyboardOffset(0);
  };

  return (
    <div className="typing-area-wrapper">
      <div className="sub-header practice-text-label">
        <h3>
          Practice text: <span className="practice-test-name">{selectedTestName}</span>
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
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={typed}
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
            value={practiceText}
            readOnly
            spellCheck={false}
            style={{ height: areaHeight, minHeight: areaHeight }}
          />
          <textarea
            ref={measureRef}
            className="textInputs bottomP"
            value={practiceText}
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
  );
}

