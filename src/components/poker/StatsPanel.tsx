import { calculateStats, identifyOutliers } from '../../utils/stats';

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
    <div
      className="flex flex-col items-center px-3 py-1.5 brutal-border bg-white brutal-shadow cursor-help"
      title={tooltip}
    >
      <span className="text-[7px] font-black uppercase tracking-widest opacity-60">
        {label}
      </span>
      <span
        className={`text-xl font-black uppercase ${label === 'Average' ? 'text-retro-pink' : 'text-black'}`}
      >
        {value}
      </span>
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
    <div className="flex flex-wrap items-center justify-center gap-6 w-full">
      {stats.count > 0 && (
        <div className="flex items-center gap-3 shrink-0">
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
      <div className="flex flex-wrap items-center gap-2">
        <div className="bg-black text-white px-2 py-0.5 brutal-border text-[7px] font-black uppercase tracking-widest shrink-0">
          DISTRO
        </div>
        {sortedValues.map((val) => (
          <div
            key={val}
            className="flex items-center gap-2 px-2 py-1 bg-retro-blue brutal-border brutal-shadow shrink-0"
          >
            <span className="text-xs font-black text-black uppercase">
              {val}
            </span>
            <span className="text-[7px] font-black text-black opacity-50 uppercase tracking-tighter">
              {counts[val]}V
            </span>
          </div>
        ))}
      </div>

      {isSplit && outlierPlayers.length > 0 && (
        <div className="flex items-center gap-3 p-2 bg-retro-pink brutal-border brutal-shadow shrink-0">
          <div className="bg-black text-white px-1.5 py-0.5 brutal-border text-[7px] font-black uppercase tracking-widest shrink-0">
            DISCUSS
          </div>
          <div className="flex gap-2">
            {outlierPlayers.slice(0, 3).map((player) => {
              const vote = votes.find(
                (v) => v.identityId === player.identityId
              );
              return (
                <div
                  key={player.identityId}
                  className="bg-white brutal-border px-1.5 py-0.5 text-[8px] font-black uppercase whitespace-nowrap"
                >
                  {player.name} ({vote?.value})
                </div>
              );
            })}
            {outlierPlayers.length > 3 && (
              <div className="text-[8px] font-black">+MORE</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
