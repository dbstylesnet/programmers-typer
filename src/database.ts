export interface PlayerResult {
  id: string;
  playerName: string;
  textIndex: number;
  accuracy: number;
  progress: number;
  correctChars: number;
  totalChars: number;
  targetLength: number;
  completed: boolean;
  startTime: number;
  endTime: number;
  duration: number;
  date: string;
}

const STORAGE_KEY = 'typing_test_results';
const PLAYERS_KEY = 'typing_test_players';

export const getAllResults = (): PlayerResult[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading results from storage:', error);
    return [];
  }
};

export const saveResult = (result: PlayerResult): void => {
  try {
    const results = getAllResults();
    results.push(result);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch (error) {
    console.error('Error saving result to storage:', error);
  }
};

export const getPlayerResults = (playerName: string): PlayerResult[] => {
  const allResults = getAllResults();
  return allResults.filter(result => result.playerName === playerName);
};

export const getAllPlayers = (): string[] => {
  try {
    const stored = localStorage.getItem(PLAYERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading players from storage:', error);
    return [];
  }
};

export const addPlayer = (playerName: string): void => {
  try {
    const players = getAllPlayers();
    if (!players.includes(playerName)) {
      players.push(playerName);
      localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
    }
  } catch (error) {
    console.error('Error saving player to storage:', error);
  }
};

export const getPlayerStats = (playerName: string) => {
  const results = getPlayerResults(playerName);
  
  if (results.length === 0) {
    return {
      totalTests: 0,
      averageAccuracy: 0,
      averageProgress: 0,
      completedTests: 0,
      bestAccuracy: 0,
    };
  }

  const completed = results.filter(r => r.completed);
  const accuracies = results.map(r => r.accuracy);
  const progresses = results.map(r => r.progress);

  return {
    totalTests: results.length,
    averageAccuracy: accuracies.reduce((a, b) => a + b, 0) / accuracies.length,
    averageProgress: progresses.reduce((a, b) => a + b, 0) / progresses.length,
    completedTests: completed.length,
    bestAccuracy: Math.max(...accuracies),
  };
};

export const clearAllResults = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(PLAYERS_KEY);
};

