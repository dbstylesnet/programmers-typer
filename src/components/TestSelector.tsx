import type { TestCategory, TestCategoryKey } from '../data/tests';

type Selected = { category: TestCategoryKey; index: number } | null;

const CATEGORY_BADGE_SRC: Record<TestCategoryKey, string> = {
  jsAlgorithms:
    'https://img.shields.io/badge/JS-Algorithms-111827?style=flat&labelColor=111827&logo=javascript&logoColor=F7DF1E',
  reactHooks:
    'https://img.shields.io/badge/React-%20-111827?style=flat&labelColor=111827&logo=react&logoColor=61DAFB',
  jsFundamentals:
    'https://img.shields.io/badge/JS-Fundamentals-111827?style=flat&labelColor=111827&logo=javascript&logoColor=F7DF1E',
  typescript:
    'https://img.shields.io/badge/TypeScript-%20-111827?style=flat&labelColor=111827&logo=typescript&logoColor=3178C6',
  restApi:
    'https://img.shields.io/badge/REST-API-111827?style=flat&labelColor=111827&logo=postman&logoColor=FF6C37',
  asyncAwait:
    'https://img.shields.io/badge/Async-Await-111827?style=flat&labelColor=111827&logo=nodedotjs&logoColor=339933',
  nextJs: 'https://img.shields.io/badge/Next.js-App-111827?style=flat&labelColor=111827&logo=nextdotjs&logoColor=ffffff',
};

export type LastRunStats = { timeSeconds: number; accuracy: number };

type Props = {
  categories: TestCategory[];
  selected: Selected;
  disabled: boolean;
  onSelect: (category: TestCategoryKey, index: number) => void;
  lastResultByTestName: Record<string, LastRunStats>;
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
  lastResultByTestName,
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
                const last = lastResultByTestName[t.name];
                return (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => onSelect(category.key, idx)}
                    disabled={disabled}
                    className={isSelected ? 'selected-test' : ''}
                  >
                    <span className="test-select-name">{t.name}</span>
                    {last ? (
                      <>
                        <span className="test-select-divider" aria-hidden="true" />
                        <span
                          className="test-select-last"
                          aria-label={`Last run ${last.timeSeconds} seconds, ${last.accuracy.toFixed(2)} percent accuracy`}
                        >
                          <span className="test-select-stat test-select-stat--time">T: {last.timeSeconds}s</span>
                          <span className="test-select-stat test-select-stat--accuracy">
                            A: {last.accuracy.toFixed(2)}%
                          </span>
                        </span>
                      </>
                    ) : null}
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

