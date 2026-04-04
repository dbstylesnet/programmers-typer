/**
 * Caret pixel position inside a textarea (content coordinates, before scroll offset).
 * Ported from component/textarea-caret-position (MIT).
 */
const MIRROR_PROPS = [
  'direction',
  'boxSizing',
  'width',
  'height',
  'overflowX',
  'overflowY',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',
  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',
  'letterSpacing',
  'wordSpacing',
  'tabSize',
  'MozTabSize',
] as const;

export function getTextareaCaretCoordinates(
  element: HTMLTextAreaElement,
  position: number,
): { top: number; left: number; height: number } {
  const isFirefox = typeof window !== 'undefined' && (window as Window & { mozInnerScreenX?: number }).mozInnerScreenX != null;
  const div = document.createElement('div');
  document.body.appendChild(div);
  const s = div.style;
  const computed = window.getComputedStyle(element);

  s.whiteSpace = 'pre-wrap';
  s.wordWrap = 'break-word';
  s.position = 'absolute';
  s.visibility = 'hidden';
  if (isFirefox && element.scrollHeight > parseInt(computed.height, 10)) {
    s.overflowY = 'scroll';
  } else {
    s.overflow = 'hidden';
  }

  for (const prop of MIRROR_PROPS) {
    const cs = computed as unknown as Record<string, string>;
    (s as unknown as Record<string, string>)[prop] = cs[prop] ?? '';
  }

  div.textContent = element.value.substring(0, position);
  const span = document.createElement('span');
  span.textContent = element.value.substring(position) || '.';
  div.appendChild(span);

  const borderTop = parseInt(computed.borderTopWidth, 10) || 0;
  const borderLeft = parseInt(computed.borderLeftWidth, 10) || 0;
  const lineHeight = parseInt(computed.lineHeight, 10);
  const fontSize = parseFloat(computed.fontSize) || 16;
  const height = Number.isFinite(lineHeight) && lineHeight > 0 ? lineHeight : Math.round(fontSize * 1.25);

  const coordinates = {
    top: span.offsetTop + borderTop,
    left: span.offsetLeft + borderLeft,
    height,
  };

  document.body.removeChild(div);
  return coordinates;
}
