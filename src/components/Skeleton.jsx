/* ── Skeleton loading placeholders ── */

const shimmerKeyframes = `
@keyframes skeleton-shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
`;

const shimmerStyle = {
  background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
  backgroundSize: '800px 100%',
  animation: 'skeleton-shimmer 1.8s ease-in-out infinite',
  borderRadius: 8,
};

function Shimmer() {
  return <style>{shimmerKeyframes}</style>;
}

/* ── Card skeleton ── */
export function SkeletonCard() {
  return (
    <div className="gc" style={{ padding: 0, overflow: 'hidden' }}>
      <Shimmer />
      <div style={{ padding: 20 }}>
        {/* Title bar */}
        <div style={{ ...shimmerStyle, height: 16, width: '60%', marginBottom: 16 }} />
        {/* Body lines */}
        <div style={{ ...shimmerStyle, height: 12, width: '100%', marginBottom: 10 }} />
        <div style={{ ...shimmerStyle, height: 12, width: '85%', marginBottom: 10 }} />
        <div style={{ ...shimmerStyle, height: 12, width: '70%' }} />
      </div>
    </div>
  );
}

/* ── Stat card skeleton ── */
export function SkeletonStat() {
  return (
    <div style={{
      borderRadius: 28, height: 140, overflow: 'hidden',
      ...shimmerStyle,
    }}>
      <Shimmer />
    </div>
  );
}

/* ── Table skeleton (5 rows) ── */
export function SkeletonTable() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Shimmer />
      {/* Header */}
      <div style={{ ...shimmerStyle, height: 40, borderRadius: 10 }} />
      {/* Rows */}
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} style={{ ...shimmerStyle, height: 48, borderRadius: 8, opacity: 1 - i * 0.1 }} />
      ))}
    </div>
  );
}

/* ── Chart area skeleton ── */
export function SkeletonChart() {
  return (
    <div style={{ ...shimmerStyle, height: 280, borderRadius: 16 }}>
      <Shimmer />
    </div>
  );
}
