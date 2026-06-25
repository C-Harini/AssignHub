export const initials = (name) =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

export default function StudentCard({ student, right }) {
  return (
    <div className="list-item">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="avatar">{initials(student.name)}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{student.name}</div>
          <div className="meta">{student.rollNo} · {student.email}</div>
        </div>
      </div>
      {right}
    </div>
  );
}
