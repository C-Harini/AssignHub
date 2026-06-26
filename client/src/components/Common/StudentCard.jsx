export default function StudentCard({ student, right }) {
  return (
    <div className="list-item">
      <div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{student.name}</div>
        <div className="meta">{student.email} · Roll: {student.rollNumber || student.rollNo || '—'}</div>
      </div>
      {right}
    </div>
  );
}
