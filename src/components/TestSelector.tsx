import type { TestCategory, TestCategoryKey } from '../data/tests';

type Selected = { category: TestCategoryKey; index: number } | null;

type Props = {
  categories: TestCategory[];
  selected: Selected;
  disabled: boolean;
  onSelect: (category: TestCategoryKey, index: number) => void;
  showResults: boolean;
  onToggleResults: () => void;
};

export function TestSelector({ categories, selected, disabled, onSelect, showResults, onToggleResults }: Props) {
  return (
    <div className="test-selector-wrapper">
      <div className="sub-header test-selector-title">
        <h3>Select test:</h3>
        <button
          onClick={onToggleResults}
          className={`results-toggle-button ${showResults ? 'results-toggle-hide' : 'results-toggle-show'}`}
        >
          {showResults ? 'Hide Results History' : 'Show Results History'}
        </button>
      </div>

      <div className="text-selection-section">
        {categories.map((category) => (
          <div key={category.key} className="language-group">
            <h4 className="language-label">{category.label}</h4>
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

