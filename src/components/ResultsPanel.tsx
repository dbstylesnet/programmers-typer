import type { PlayerResult } from '../database';

type Props = {
  playerName: string;
  show: boolean;
  stats: any;
  results: PlayerResult[];
};

function formatDateTime24h(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { hour12: false });
}

function formatTimeSeconds(durationMs: number): string {
  return `${Math.max(0, Math.floor(durationMs / 1000))}s`;
}

export function ResultsPanel({ playerName, show, stats, results }: Props) {
  if (!show || !playerName || !stats) return null;

  return (
    <div className="results-section">
      <h3>Stats:</h3>
      <div className="statistics-container">
        <div className="stat-item stat-item--tests">
          <div className="stat-label">Total tests</div>
          <div className="stat-value">{stats.totalTests}</div>
        </div>
        <div className="stat-item stat-item--accuracy">
          <div className="stat-label">Average accuracy</div>
          <div className="stat-value">{stats.averageAccuracy.toFixed(2)}%</div>
        </div>
      </div>

      <h4 className="results-recent-heading">Recent results</h4>
      <div className="recent-results-container">
        {results.length === 0 ? (
          <p className="recent-results-empty">No completed tests yet. Finish a run to see it listed here.</p>
        ) : (
          results
            .slice(-10)
            .reverse()
            .map((result) => (
              <div key={result.id} className="result-item">
                <div className="result-item-body">
                  <div className="result-pair">
                    <div className="result-label">Test name</div>
                    <div className="result-value result-value--name">{result.testName || 'Unknown test'}</div>
                  </div>
                  <div className="result-pair">
                    <div className="result-label">Time</div>
                    <div className="result-value result-value--time">{formatTimeSeconds(result.duration)}</div>
                  </div>
                  <div className="result-pair">
                    <div className="result-label">Accuracy</div>
                    <div className="result-value result-value--accuracy">
                      {result.accuracy.toFixed(2)}%
                    </div>
                  </div>
                  <div className="result-pair">
                    <div className="result-label">Date</div>
                    <div className="result-value result-value--date">{formatDateTime24h(result.date)}</div>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

