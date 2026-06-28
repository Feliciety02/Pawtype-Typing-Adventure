import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getSessions, type TypingSession } from "../lib/game/stats";

const CHAR_GRID = "abcdefghijklmnopqrstuvwxyz.,;:'\"!?-()[]{}1234567890@#$%^&*_+=/\\|`~<>".split("");

export function StatsView() {
  const [sessions, setSessions] = useState<TypingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSessions(100).then((s) => {
      setSessions(s);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="pixel-card p-8 text-center">
        <p className="font-pixel text-[0.65rem] text-muted-foreground">Loading stats...</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="pixel-card p-8 text-center">
        <span className="text-5xl">📊</span>
        <h2 className="text-3xl mt-4 mb-2">No Data Yet</h2>
        <p className="font-pixel text-[0.65rem] text-muted-foreground max-w-md mx-auto">
          Complete a typing test to see your stats here.
        </p>
      </div>
    );
  }

  const totalTests = sessions.length;
  const bestWpm = Math.max(...sessions.map((s) => s.wpm));
  const avgWpm = Math.round(sessions.reduce((a, s) => a + s.wpm, 0) / totalTests);
  const avgAcc = Math.round(sessions.reduce((a, s) => a + s.accuracy, 0) / totalTests);

  const chartData = [...sessions].reverse().map((s, i) => ({
    name: `#${i + 1}`,
    wpm: s.wpm,
    acc: s.accuracy,
    time: new Date(s.timestamp).toLocaleDateString(),
  }));

  // Build mistake heatmap
  const mistakeCount = new Map<string, number>();
  const totalCount = new Map<string, number>();
  for (const s of sessions) {
    for (const k of s.keystrokes) {
      const ch = k.target.toLowerCase();
      totalCount.set(ch, (totalCount.get(ch) ?? 0) + 1);
      if (!k.correct) {
        mistakeCount.set(ch, (mistakeCount.get(ch) ?? 0) + 1);
      }
    }
  }

  const heatmapChars = CHAR_GRID.filter((c) => (totalCount.get(c) ?? 0) > 0);
  const maxMistakeRate = Math.max(
    0.01,
    ...Array.from(mistakeCount.entries()).map(([c, m]) => m / (totalCount.get(c) ?? 1)),
  );

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard label="Tests" value={String(totalTests)} emoji="📝" />
        <SummaryCard label="Best WPM" value={String(bestWpm)} emoji="⚡" accent="var(--color-primary)" />
        <SummaryCard label="Avg WPM" value={String(avgWpm)} emoji="⌨" accent="var(--leaf)" />
        <SummaryCard label="Avg Acc" value={`${avgAcc}%`} emoji="🎯" accent="var(--coin)" />
      </div>

      {/* WPM Chart */}
      <div className="pixel-card p-5">
        <h3 className="text-2xl mb-4">Speed History</h3>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "2px solid var(--color-border)",
                  borderRadius: 4,
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="wpm" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mistake heatmap */}
      <div className="pixel-card p-5">
        <h3 className="text-2xl mb-3">Mistake Heatmap</h3>
        <p className="font-pixel text-[0.55rem] text-muted-foreground mb-3">
          Darker = more mistakes per attempt. Hover to see details.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {heatmapChars.map((ch) => {
            const total = totalCount.get(ch) ?? 1;
            const mistakes = mistakeCount.get(ch) ?? 0;
            const rate = mistakes / total;
            const intensity = Math.min(rate / maxMistakeRate, 1);
            return (
              <span
                key={ch}
                className="font-mono text-sm text-center cursor-default"
                title={`'${ch}': ${mistakes}/${total} mistakes (${Math.round(rate * 100)}%)`}
                style={{
                  width: 28,
                  height: 28,
                  lineHeight: "28px",
                  background: `color-mix(in oklab, var(--color-destructive) ${Math.round(intensity * 70)}%, var(--color-muted))`,
                  color: intensity > 0.5 ? "white" : "var(--color-foreground)",
                  borderRadius: 4,
                  border: "1px solid var(--color-border)",
                }}
              >
                {ch === " " ? "␣" : ch}
              </span>
            );
          })}
        </div>
      </div>

      {/* Recent sessions */}
      <div className="pixel-card p-5">
        <h3 className="text-2xl mb-3">Recent Sessions</h3>
        <div className="overflow-x-auto">
          <table className="w-full font-pixel text-[0.6rem]">
            <thead>
              <tr className="text-muted-foreground uppercase">
                <th className="text-left pb-2 pr-3">Date</th>
                <th className="text-right pb-2 pr-3">WPM</th>
                <th className="text-right pb-2 pr-3">Acc</th>
                <th className="text-right pb-2 pr-3">Duration</th>
                <th className="text-right pb-2">Chars</th>
              </tr>
            </thead>
            <tbody>
              {sessions.slice(0, 15).map((s) => (
                <tr key={s.id} className="border-t" style={{ borderColor: "var(--color-border)" }}>
                  <td className="py-2 pr-3 text-muted-foreground">
                    {new Date(s.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </td>
                  <td className="text-right py-2 pr-3" style={{ color: "var(--color-primary)" }}>{s.wpm}</td>
                  <td className="text-right py-2 pr-3" style={{ color: "var(--leaf)" }}>{s.accuracy}%</td>
                  <td className="text-right py-2 pr-3 text-muted-foreground">{Math.round(s.duration)}s</td>
                  <td className="text-right py-2 text-muted-foreground">{s.correctChars + s.mistakes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label, value, emoji, accent,
}: { label: string; value: string; emoji: string; accent?: string }) {
  return (
    <div className="pixel-card-sm p-3 text-center" style={accent ? { borderLeft: `4px solid ${accent}` } : undefined}>
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="font-display text-xl leading-tight" style={{ color: accent ?? "var(--color-foreground)" }}>
        {value}
      </div>
      <div className="font-pixel text-[0.55rem] text-muted-foreground uppercase mt-1">{label}</div>
    </div>
  );
}
