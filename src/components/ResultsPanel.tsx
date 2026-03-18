import type { PlayerResult } from '../database';

type Props = {
  playerName: string;
  show: boolean;
  stats: any;
  results: PlayerResult[];
};

export function ResultsPanel({ playerName, show, stats, results }: Props) {
  if (!show || !playerName || !stats) return null;

  return (
    <div className="results-section">
      <h3>Statistics for {playerName}</h3>
      <div className="statistics-container">
        <div className="stat-item">
          <div className="stat-label">Total Tests</div>
          <div className="stat-value">{stats.totalTests}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Average Accuracy</div>
          <div className="stat-value">{stats.averageAccuracy.toFixed(2)}%</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Average Progress</div>
          <div className="stat-value">{stats.averageProgress.toFixed(2)}%</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Best Accuracy</div>
          <div className="stat-value">{stats.bestAccuracy.toFixed(2)}%</div>
        </div>
      </div>

      <h4>Recent Results:</h4>
      <div className="recent-results-container">
        {results
          .slice(-10)
          .reverse()
          .map((result) => (
            <div key={result.id} className="result-item">
              <div className="result-pair">
                <div className="result-label">Test:</div>
                <div className="result-value">{result.testName || 'Unknown Test'}</div>
              </div>
              <div className="result-pair">
                <div className="result-label">Date:</div>
                <div className="result-value">{new Date(result.date).toLocaleString()}</div>
              </div>
              <div className="result-pair">
                <div className="result-label">Accuracy:</div>
                <div className="result-value">{result.accuracy.toFixed(2)}%</div>
              </div>
              <div className="result-pair">
                <div className="result-label">Progress:</div>
                <div className="result-value">{result.progress.toFixed(2)}%</div>
              </div>
              <div className="result-pair">
                <div className="result-label">Duration:</div>
                <div className="result-value">{(result.duration / 1000).toFixed(2)}s</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

