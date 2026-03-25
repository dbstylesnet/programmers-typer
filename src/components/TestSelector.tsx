import type { TestCategory, TestCategoryKey } from '../data/tests';

type Selected = { category: TestCategoryKey; index: number } | null;

type Props = {
  categories: TestCategory[];
  selected: Selected;
  disabled: boolean;
  onSelect: (category: TestCategoryKey, index: number) => void;
};

export function TestSelector({ categories, selected, disabled, onSelect }: Props) {
  return (
    <div className="test-selector-wrapper">
      <div className="sub-header test-selector-title">
        <h3>Select test:</h3>
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

