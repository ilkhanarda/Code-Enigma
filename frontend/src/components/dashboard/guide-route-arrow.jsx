export default function GuideRouteArrow({
  routeKey,
  path,
  width = 280,
  height = 86,
  className = "",
}) {
  return (
    <div
      key={routeKey}
      className={`enigma-route-arrow ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="enigma-route-canvas">
        <path d={path} pathLength="1" className="enigma-route-line" />
      </svg>
      <span className="enigma-route-head" style={{ offsetPath: `path('${path}')` }}>
        <span className="enigma-route-head-tip" />
        <span className="enigma-route-head-tail" />
      </span>
    </div>
  );
}
