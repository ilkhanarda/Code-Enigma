import { useMemo, useState } from "react";
import { ICONS8_DEFAULT_STYLE, resolveIconKey, resolveIcons8Name } from "../../lib/icons8-map.js";

function normalizeColor(color) {
  if (!color) return null;
  return color.replace("#", "").trim() || null;
}

function toLabel(value) {
  if (!value) return "icon";
  return String(value).replace(/[_-]+/g, " ").trim();
}

function buildIcons8Url({ styleName, size, color, iconName, format = "svg", requestSize }) {
  if (format === "svg") {
    const base = `https://img.icons8.com/${styleName}`;
    return color ? `${base}/${color}/${iconName}.svg` : `${base}/${iconName}.svg`;
  }

  const rasterSize = requestSize || Math.max(48, size * 2);
  const base = `https://img.icons8.com/${styleName}/${rasterSize}`;
  return color ? `${base}/${color}/${iconName}.png` : `${base}/${iconName}.png`;
}

export default function Icon({
  name,
  size = 20,
  alt,
  className = "",
  color,
  styleName = ICONS8_DEFAULT_STYLE,
  decorative = true,
  requestSize,
}) {
  const [hasError, setHasError] = useState(false);
  const [imgFormat, setImgFormat] = useState("svg");
  const [pngAttempted, setPngAttempted] = useState(false);

  const resolvedKey = useMemo(() => resolveIconKey(name), [name]);
  const icons8Name = useMemo(() => encodeURIComponent(resolveIcons8Name(name)), [name]);
  const colorToken = useMemo(() => normalizeColor(color), [color]);

  const src = useMemo(
    () => buildIcons8Url({ styleName, size, color: colorToken, iconName: icons8Name, format: imgFormat, requestSize }),
    [styleName, size, colorToken, icons8Name, imgFormat, requestSize]
  );

  const readableAlt = alt || toLabel(resolvedKey);

  if (hasError) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded bg-slate-100 text-slate-500 ${className}`}
        style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.6)) }}
        aria-hidden={decorative}
        title={decorative ? undefined : readableAlt}
      >
        ?
      </span>
    );
  }

  return (
    <img
      src={src}
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain" }}
      loading="lazy"
      decoding="async"
      className={className}
      alt={decorative ? "" : readableAlt}
      aria-hidden={decorative}
      onError={() => {
        if (imgFormat === "svg" && !pngAttempted) {
          setImgFormat("png");
          setPngAttempted(true);
          return;
        }
        setHasError(true);
      }}
    />
  );
}
