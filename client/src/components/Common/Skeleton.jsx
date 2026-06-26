export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card" style={{ marginBottom: '0.75rem' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ height: 12, marginBottom: 8, width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 4 }) {
  return Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />);
}
