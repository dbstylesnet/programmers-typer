type Props = {
  elapsedDisplay: string;
  accuracyPercent: number;
  progressPercent: number;
};

export function StatsHeader({ elapsedDisplay, accuracyPercent, progressPercent }: Props) {
  return (
    <div className="sub-header statsHeader">
      <h4>
        Timer: {elapsedDisplay} | Accuracy: {accuracyPercent.toFixed(2)}% | Progress: {progressPercent.toFixed(2)}%
      </h4>
    </div>
  );
}

