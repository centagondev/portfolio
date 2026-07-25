import lockupPng from "../assets/centagon-lockup.png";

/**
 * The Centagon mark — a dotted "C" of rounded cells arced around an
 * open right side. Cells are kept as data so the mark can be animated
 * per-cell where needed.
 */
export interface Cell {
  x: number;
  y: number;
  w: number;
  h: number;
  rx: number;
}

/** Ordered around the arc: inner ring first, then outer ring. */
export const MARK_CELLS: Cell[] = [
  { x: 61.43, y: 64.28, w: 10.6, h: 10.6, rx: 3.39 },
  { x: 52.99, y: 70.04, w: 9.48, h: 9.48, rx: 3.03 },
  { x: 43.21, y: 71.68, w: 8.36, h: 8.36, rx: 2.68 },
  { x: 33.88, y: 69.03, w: 7.24, h: 7.24, rx: 2.32 },
  { x: 26.57, y: 62.49, w: 6.4, h: 6.4, rx: 2.05 },
  { x: 22.35, y: 53.0, w: 6.4, h: 6.4, rx: 2.05 },
  { x: 22.35, y: 42.6, w: 6.4, h: 6.4, rx: 2.05 },
  { x: 26.57, y: 33.11, w: 6.4, h: 6.4, rx: 2.05 },
  { x: 33.88, y: 25.73, w: 7.24, h: 7.24, rx: 2.32 },
  { x: 43.21, y: 21.96, w: 8.36, h: 8.36, rx: 2.68 },
  { x: 52.99, y: 22.48, w: 9.48, h: 9.48, rx: 3.03 },
  { x: 61.43, y: 27.12, w: 10.6, h: 10.6, rx: 3.39 },
  { x: 68.12, y: 71.71, w: 10.6, h: 10.6, rx: 3.39 },
  { x: 58.11, y: 78.7, w: 9.65, h: 9.65, rx: 3.09 },
  { x: 46.49, y: 81.64, w: 8.7, h: 8.7, rx: 2.79 },
  { x: 34.77, y: 80.23, w: 7.76, h: 7.76, rx: 2.48 },
  { x: 24.46, y: 74.71, w: 6.81, h: 6.81, rx: 2.18 },
  { x: 16.63, y: 65.54, w: 6.4, h: 6.4, rx: 2.05 },
  { x: 12.35, y: 53.97, w: 6.4, h: 6.4, rx: 2.05 },
  { x: 12.35, y: 41.63, w: 6.4, h: 6.4, rx: 2.05 },
  { x: 16.63, y: 30.06, w: 6.4, h: 6.4, rx: 2.05 },
  { x: 24.46, y: 20.48, w: 6.81, h: 6.81, rx: 2.18 },
  { x: 34.77, y: 14.01, w: 7.76, h: 7.76, rx: 2.48 },
  { x: 46.49, y: 11.66, w: 8.7, h: 8.7, rx: 2.79 },
  { x: 58.11, y: 13.65, w: 9.65, h: 9.65, rx: 3.09 },
  { x: 68.12, y: 19.69, w: 10.6, h: 10.6, rx: 3.39 },
];

export function Mark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {MARK_CELLS.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width={c.w} height={c.h} rx={c.rx} />
      ))}
    </svg>
  );
}

/**
 * Nav / footer lockup — the OFFICIAL combination logo asset (PNG,
 * white on transparent), not a code recreation.
 */
export function Lockup({ className = "h-8 w-auto" }: { className?: string }) {
  return <img src={lockupPng} alt="Centagon" className={className} />;
}
