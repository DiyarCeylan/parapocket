interface Props {
  icon: string
  title: string
  desc?: string
}

export default function EmptyState({ icon, title, desc }: Props) {
  return (
    <div className="empty-state">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      {desc && <p>{desc}</p>}
    </div>
  )
}
