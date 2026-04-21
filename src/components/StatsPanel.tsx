import { calculateStats, identifyOutliers } from '../utils/stats';

interface StatsPanelProps {
  players: Array<{ identityId: string; name: string }>;
  votes: Array<{ identityId: string; value: string | number | null }>;
}

export function StatsPanel({ players, votes }: StatsPanelProps) {
  const voteValues = votes.map((v) => v.value);
  const stats = calculateStats(voteValues);
  const outliers = identifyOutliers(voteValues);
  const isSplit = stats.spread > 2;

  const outlierPlayers = players.filter((player) => {
    const vote = votes.find((v) => v.identityId === player.identityId);
    if (!vote || vote.value === null || isNaN(Number(vote.value))) return false;
    const value = Number(vote.value);
    return outliers.min.includes(value) || outliers.max.includes(value);
  });

  const StatItem = ({
    label,
    value,
    tooltip,
  }: {
    label: string;
    value: string | number;
    tooltip: string;
  }) => (
    <div className="flex flex-col items-center group relative">
      <span
        className="text-[var(--text-tertiary)] text-[10px] uppercase font-bold tracking-widest mb-1 cursor-help border-b border-dotted border-[var(--text-tertiary)]"
        title={tooltip}
      >
        {label}
      </span>
      <span
        className={`text-3xl font-black ${label === 'Average' ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}
      >
        {value}
      </span>
      {/* Custom Tooltip */}
      <div className="absolute bottom-full mb-2 hidden group-hover:block z-50">
        <div className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-[10px] px-2 py-1 rounded shadow-lg border border-[var(--border-subtle)] whitespace-nowrap">
          {tooltip}
        </div>
      </div>
    </div>
  );

  const tooltipText =
    'Calculated from numeric votes only. Special votes (?, ☕) are excluded.';

  // Distribution
  const counts: Record<string, number> = {};
  votes.forEach((v) => {
    if (v.value !== null) {
      const val = v.value.toString();
      counts[val] = (counts[val] || 0) + 1;
    }
  });
  const sortedValues = Object.keys(counts).sort((a, b) => {
    const na = Number(a),
      nb = Number(b);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return a.localeCompare(b);
  });

  return (
    <div className="flex flex-col items-center gap-8">
      {stats.count > 0 && (
        <div className="flex justify-center gap-8 sm:gap-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <StatItem
            label="Average"
            value={stats.average}
            tooltip={tooltipText}
          />
          <StatItem label="Median" value={stats.median} tooltip={tooltipText} />
          <StatItem
            label="Mode"
            value={stats.mode.join(', ') || '-'}
            tooltip={tooltipText}
          />
        </div>
      )}

      {/* Distribution Section */}
      <div className="flex flex-wrap justify-center gap-3 animate-in fade-in duration-700">
        {sortedValues.map((val) => (
          <div
            key={val}
            className="flex flex-col items-center p-3 min-w-[60px] bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl"
          >
            <span className="text-xl font-black text-[var(--text-primary)]">
              {val}
            </span>
            <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
              {counts[val]} {counts[val] === 1 ? 'vote' : 'votes'}
            </span>
          </div>
        ))}
      </div>

      {isSplit && outlierPlayers.length > 0 && (
        <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-500">
          <div className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-[10px] font-bold uppercase tracking-wider border border-red-200 dark:border-red-800/50">
            <span>Needs Discussion</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {outlierPlayers.map((player) => {
              const vote = votes.find(
                (v) => v.identityId === player.identityId
              );
              return (
                <div
                  key={player.identityId}
                  className="flex items-center gap-1.5"
                >
                  <span className="text-xs font-medium text-[var(--text-secondary)]">
                    {player.name}
                  </span>
                  <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                    ({vote?.value})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
