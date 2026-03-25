import type { KeyboardEvent, RefObject } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type Props = {
  textareaRef: RefObject<HTMLTextAreaElement>;
  typed: string;
  practiceText: string;
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

  return (
    <div className="typing-area-wrapper">
      <div className="sub-header practice-text-label">
        <h3>Practice text:</h3>
        <div className="practice-metrics">
          Timer: {elapsedDisplay} | Accuracy: {accuracyPercent.toFixed(2)}% | Progress: {progressPercent.toFixed(2)}%
        </div>
      </div>

      <div className="mainTextAreas">
        <div className="textAreas" style={{ minHeight: areaHeight + 24 }}>
          <textarea
            ref={textareaRef}
            className="textInputs topP"
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            onClick={onClick}
            value={typed}
            disabled={disabled}
            spellCheck={false}
            style={{ height: areaHeight, minHeight: areaHeight }}
          />
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

