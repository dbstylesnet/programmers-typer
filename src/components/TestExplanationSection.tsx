import type { TestExplanationParts } from '../data/tests';

type Props = {
  explanation: TestExplanationParts | null;
};

export function TestExplanationSection({ explanation }: Props) {
  if (!explanation) return null;

  return (
    <section className="test-explanation-section" aria-labelledby="test-explanation-heading">
      <div className="sub-header test-explanation-title">
        <h3 id="test-explanation-heading" className="test-explanation-heading">
          EXPLANATION:
        </h3>
      </div>
      <div className="test-explanation-content">
        <p className="test-explanation-part">
          <span className="test-explanation-label">What it does: </span>
          {explanation.whatItDoes}
        </p>
        <p className="test-explanation-part">
          <span className="test-explanation-label">Where it's used: </span>
          {explanation.typicalUse}
        </p>
      </div>
    </section>
  );
}
