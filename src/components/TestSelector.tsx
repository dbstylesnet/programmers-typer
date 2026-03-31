import type { TestCategory, TestCategoryKey } from '../data/tests';

type Selected = { category: TestCategoryKey; index: number } | null;

const CATEGORY_BADGE_SRC: Record<TestCategoryKey, string> = {
  jsAlgorithms:
    'https://img.shields.io/badge/JS-Algorithms-111827?style=flat&labelColor=111827&logo=javascript&logoColor=F7DF1E',
  reactHooks:
    'https://img.shields.io/badge/React-Hooks-111827?style=flat&labelColor=111827&logo=react&logoColor=61DAFB',
  jsFundamentals:
    'https://img.shields.io/badge/JS-Fundamentals-111827?style=flat&labelColor=111827&logo=javascript&logoColor=F7DF1E',
  typescript:
    'https://img.shields.io/badge/TypeScript-Types-111827?style=flat&labelColor=111827&logo=typescript&logoColor=3178C6',
  restApi: 'https://img.shields.io/badge/REST-API-111827?style=flat&labelColor=111827&logoColor=009688',
  asyncAwait:
    'https://img.shields.io/badge/Async-Await-111827?style=flat&labelColor=111827&logo=nodedotjs&logoColor=339933',
  nextJs: 'https://img.shields.io/badge/Next.js-App-111827?style=flat&labelColor=111827&logo=nextdotjs&logoColor=ffffff',
};

type Props = {
  categories: TestCategory[];
  selected: Selected;
  disabled: boolean;
  onSelect: (category: TestCategoryKey, index: number) => void;
  showResults: boolean;
  hasHistory: boolean;
  onToggleResults: () => void;
  onClearHistory: () => void;
  canClearHistory: boolean;
};

export function TestSelector({
  categories,
  selected,
  disabled,
  onSelect,
  showResults,
  hasHistory,
  onToggleResults,
  onClearHistory,
  canClearHistory,
}: Props) {
  return (
    <div className="test-selector-wrapper">
      <div className="sub-header test-selector-title">
        <h3>Select test:</h3>
        <div className="test-selector-actions">
          {showResults ? (
            <button
              type="button"
              className="results-clear-history-button"
              onClick={onClearHistory}
              disabled={!canClearHistory}
            >
              Clear history
            </button>
          ) : null}
          {hasHistory || showResults ? (
            <button
              type="button"
              onClick={onToggleResults}
              className={`results-toggle-button ${showResults ? 'results-toggle-hide' : 'results-toggle-show'}`}
            >
              {showResults ? 'Hide Results History' : 'Show Results History'}
            </button>
          ) : null}
        </div>
      </div>

      <div className="text-selection-section">
        {categories.map((category) => (
          <div key={category.key} className="language-group">
            <h4 className="language-label">
              <img
                className="category-badge"
                src={CATEGORY_BADGE_SRC[category.key]}
                alt={category.label}
                title={category.label}
              />
            </h4>
            <div className="text-selection-buttons">
              {category.tests.map((t, idx) => {
                const isSelected = selected?.category === category.key && selected.index === idx;
                return (
                  <button
                    key={t.name}
                    onClick={() => onSelect(category.key, idx)}
                    disabled={disabled}
                    className={isSelected ? 'selected-test' : ''}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

