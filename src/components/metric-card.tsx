type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  emphasis?: boolean;
};

export function MetricCard({
  label,
  value,
  detail,
  emphasis,
}: MetricCardProps) {
  return (
    <div className={`metric-card${emphasis ? " emphasis" : ""}`}>
      <span className="eyebrow">{label}</span>
      <strong>{value}</strong>
      {detail ? <small>{detail}</small> : null}
    </div>
  );
}
