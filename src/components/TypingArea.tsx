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

