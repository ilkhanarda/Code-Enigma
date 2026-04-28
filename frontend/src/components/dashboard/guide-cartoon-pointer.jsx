import "./guide-cartoon-pointer.css";

const TARGET_PRESET = {
  topics: {
    startX: -46,
    startY: 22,
    curveX: -18,
    curveY: -10,
    startRotate: -14,
    curveRotate: -6,
    tap: 8,
  },
  mission: {
    startX: -44,
    startY: 24,
    curveX: -16,
    curveY: -8,
    startRotate: -15,
    curveRotate: -5,
    tap: 9,
  },
  showcase: {
    startX: -48,
    startY: 21,
    curveX: -20,
    curveY: -9,
    startRotate: -13,
    curveRotate: -5,
    tap: 8,
  },
};

function resolvePreset(target = "topics") {
  return TARGET_PRESET[target] || TARGET_PRESET.topics;
}

export default function GuideCartoonPointer({
  routeKey,
  className = "",
  target = "topics",
  side = "left",
  size = 84,
  label,
}) {
  const preset = resolvePreset(target);
  const isRight = side === "right";
  const direction = isRight ? -1 : 1;
  const replayKey = routeKey || `${target}-${side}-pointer`;

  return (
    <div
      key={replayKey}
      className={`guide-cartoon-pointer guide-cartoon-pointer--${side} ${className}`}
      style={{
        "--gcp-size": `${size}px`,
        "--gcp-width": `${Math.round(size * 1.28)}px`,
        "--gcp-height": `${Math.round(size * 1.12)}px`,
        "--gcp-start-x": `${preset.startX * direction}px`,
        "--gcp-start-y": `${preset.startY}px`,
        "--gcp-curve-x": `${preset.curveX * direction}px`,
        "--gcp-curve-y": `${preset.curveY}px`,
        "--gcp-start-rot": `${preset.startRotate * direction}deg`,
        "--gcp-curve-rot": `${preset.curveRotate * direction}deg`,
        "--gcp-tap-x": `${preset.tap * direction}px`,
      }}
      data-label={label || undefined}
      aria-hidden="true"
    >
      <span className="guide-cartoon-pointer-motion">
        <span className="guide-cartoon-pointer-character">
          <span className="guide-cartoon-pointer-orient">
            <svg className="guide-cartoon-pointer-art" viewBox="0 0 92.06 169.88">
              <path
                className="guide-hand-cls-1"
                d="M56.56,87.78h0c-5.57-1.4-11.02,2.6-11.41,8.33-1.41,20.82-6.4,40.74-14.98,59.77-2.36,5.23.56,11.33,6.13,12.72h0c4.39,1.1,8.92-1.16,10.71-5.32,9.04-21.03,14.54-42.94,16.48-65.75.38-4.51-2.54-8.64-6.93-9.74Z"
              />
              <ellipse
                className="guide-hand-cls-3"
                cx={55.15}
                cy={99.08}
                rx={18.92}
                ry={29.71}
                transform="translate(-46.37 149.59) rotate(-87.36)"
              />
              <g>
                <path
                  className="guide-hand-cls-5"
                  d="M17.06,75.95c-3.79-5.19-9.15-8.17-12.16-9.55-1.8-.82-3.13-2.42-3.58-4.34-2.57-10.86,10.8-18.72,30.8-1.23,0,0,1.4-18.96-.32-38.27-1.73-19.3,6.16-25.93,13.31-18.73,7.15,7.2,5.42,35.44,5.42,35.44,0,0,11.7-12.13,19.77.83,0,0,8.91-7.6,15.67-1.41,7.52,6.88,4.52,17.86,4.52,17.86,0,0,6.43,41.78-27.57,44.95-34,3.17-38.24-15.14-45.85-25.56Z"
                />
                <path
                  className="guide-hand-cls-4"
                  d="M17.06,75.95c-3.79-5.19-9.15-8.17-12.16-9.55-1.8-.82-3.13-2.42-3.58-4.34-2.57-10.86,10.8-18.72,30.8-1.23,0,0,1.4-18.96-.32-38.27-1.73-19.3,6.16-25.93,13.31-18.73,7.15,7.2,5.42,35.44,5.42,35.44,0,0,11.7-12.13,19.77.83,0,0,8.91-7.6,15.67-1.41,7.52,6.88,4.52,17.86,4.52,17.86,0,0,6.43,41.78-27.57,44.95-34,3.17-38.24-15.14-45.85-25.56Z"
                />
              </g>
              <path className="guide-hand-cls-2" d="M49.29,52.9s1.45-12.15,1.4-18.81" />
              <path className="guide-hand-cls-2" d="M69.97,49.1s.38-5.95.31-8.99" />
              <path className="guide-hand-cls-2" d="M31.74,71.25s1.12-8.08.68-16.25" />
            </svg>
          </span>
          <span className="guide-cartoon-pointer-accent guide-cartoon-pointer-accent--one" />
          <span className="guide-cartoon-pointer-accent guide-cartoon-pointer-accent--two" />
        </span>
      </span>
    </div>
  );
}
