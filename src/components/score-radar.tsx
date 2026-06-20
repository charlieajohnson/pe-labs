import type { DimensionResult } from "@/lib/scoring";

function point(index: number, count: number, radius: number) {
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
  return [
    100 + Math.cos(angle) * radius,
    100 + Math.sin(angle) * radius,
  ] as const;
}

function polygonPoints(count: number, radius: number) {
  return Array.from({ length: count }, (_, index) =>
    point(index, count, radius).join(","),
  ).join(" ");
}

export function ScoreRadar({ dimensions }: { dimensions: DimensionResult[] }) {
  const dataPoints = dimensions
    .map((dimension, index) => {
      const ratio = dimension.score / dimension.max;
      return point(index, dimensions.length, 68 * ratio).join(",");
    })
    .join(" ");

  return (
    <div className="radar-wrap">
      <svg
        viewBox="0 0 200 200"
        role="img"
        aria-label="Screening score by dimension"
      >
        {[68, 51, 34, 17].map((radius) => (
          <polygon
            key={radius}
            points={polygonPoints(dimensions.length, radius)}
            className="radar-grid"
          />
        ))}
        {dimensions.map((dimension, index) => {
          const [x, y] = point(index, dimensions.length, 68);
          return (
            <line
              key={dimension.key}
              x1="100"
              y1="100"
              x2={x}
              y2={y}
              className="radar-grid"
            />
          );
        })}
        <polygon points={dataPoints} className="radar-shape" />
        {dimensions.map((dimension, index) => {
          const [x, y] = point(
            index,
            dimensions.length,
            68 * (dimension.score / dimension.max),
          );
          return (
            <circle
              key={dimension.key}
              cx={x}
              cy={y}
              r="2.5"
              className="radar-dot"
            />
          );
        })}
      </svg>
    </div>
  );
}
