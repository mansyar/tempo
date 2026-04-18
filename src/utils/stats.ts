export interface VotingStats {
  average: number;
  median: number;
  mode: number[];
  count: number;
  participationCount: number;
}

export function calculateStats(
  rawVotes: (string | number | null)[]
): VotingStats {
  const participationCount = rawVotes.filter((v) => v !== null).length;

  const numericVotes = rawVotes
    .filter(
      (v): v is number | string =>
        v !== null && !isNaN(Number(v)) && typeof v !== 'boolean'
    )
    .map((v) => Number(v));

  if (numericVotes.length === 0) {
    return { average: 0, median: 0, mode: [], count: 0, participationCount };
  }

  // Average
  const sum = numericVotes.reduce((a, b) => a + b, 0);
  const average = Math.round((sum / numericVotes.length) * 100) / 100;

  // Median
  const sorted = [...numericVotes].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 !== 0
      ? sorted[middle]
      : (sorted[middle - 1] + sorted[middle]) / 2;

  // Mode
  const counts: Record<number, number> = {};
  let maxCount = 0;
  numericVotes.forEach((v) => {
    counts[v] = (counts[v] || 0) + 1;
    if (counts[v] > maxCount) maxCount = counts[v];
  });
  const mode = Object.keys(counts)
    .filter((k) => counts[Number(k)] === maxCount)
    .map(Number)
    .sort((a, b) => a - b);

  return {
    average,
    median,
    mode,
    count: numericVotes.length,
    participationCount,
  };
}

export function identifyOutliers(rawVotes: (string | number | null)[]): {
  min: number[];
  max: number[];
} {
  const numericVotes = rawVotes
    .filter(
      (v): v is number | string =>
        v !== null && !isNaN(Number(v)) && typeof v !== 'boolean'
    )
    .map((v) => Number(v));

  if (numericVotes.length <= 1) return { min: [], max: [] };

  const min = Math.min(...numericVotes);
  const max = Math.max(...numericVotes);

  if (min === max) return { min: [], max: [] };

  // For this app, outliers are just the min and max values if they differ from the rest
  return {
    min: [min],
    max: [max],
  };
}

export function isUnanimous(rawVotes: (string | number | null)[]): boolean {
  const votes = rawVotes.filter((v) => v !== null);

  if (votes.length < 2) return false;

  const first = votes[0];
  return votes.every((v) => v === first);
}
