export function CardSkeleton() {
  return <div className="glass-card h-28 animate-pulse bg-surface-100/40" />;
}

export function ChartSkeleton({ height = 260 }) {
  return <div className="glass-card animate-pulse bg-surface-100/40" style={{ height }} />;
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="rounded-xl border border-surface-border overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 border-b border-surface-border last:border-0 bg-surface-100/30 animate-pulse" />
      ))}
    </div>
  );
}
