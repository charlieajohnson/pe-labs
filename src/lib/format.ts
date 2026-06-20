export function formatEurMillions(value: number) {
  return `€${value.toFixed(value >= 10 ? 0 : 1)}m`;
}

export function formatPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value}%`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}
