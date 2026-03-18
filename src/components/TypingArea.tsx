import type { KeyboardEvent, RefObject } from 'react';

type Props = {
  textareaRef: RefObject<HTMLTextAreaElement>;
  typed: string;
  practiceText: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onClick: () => void;
};

export function TypingArea({
  textareaRef,
  typed,
  practiceText,
  disabled,
  onChange,
  onKeyDown,
  onClick,
}: Props) {
  return (
    <div className="mainTextAreas">
      <div className="sub-header">
        <h3>Practice text:</h3>
      </div>
      <div className="textAreas">
        <textarea
          ref={textareaRef}
          className="textInputs topP"
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onClick={onClick}
          value={typed}
          disabled={disabled}
          spellCheck={false}
        />
        <textarea className="textInputs bottomP" value={practiceText} readOnly spellCheck={false} />
      </div>
    </div>
  );
}

