export default function Pagination({ page, pages, onChange }) {
  if (!pages || pages <= 1) return null;
  const go = (p) => onChange(Math.min(Math.max(1, p), pages));
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 16 }}>
      <button onClick={() => go(page - 1)} disabled={page <= 1} style={{ fontSize: 12 }}>‹ Prev</button>
      <span style={{ fontSize: 12, alignSelf: 'center', color: 'var(--color-text-secondary)' }}>
        Page {page} of {pages}
      </span>
      <button onClick={() => go(page + 1)} disabled={page >= pages} style={{ fontSize: 12 }}>Next ›</button>
    </div>
  );
}
