import { Link } from "react-router-dom";

function Logo({ size = "md" }) {
  const sizes = {
    sm: {
      box: "h-7 w-7 text-[8px]",
      text: "text-[4px] tracking-[2px]",
      gap: "gap-1",
    },
    mg: {
      box: "h-9 w-9 text-[11px]",
      text: "text-[7px] tracking-[2px]",
      gap: "gap-1",
    },
    lg: {
      box: "h-13 w-13 text-[14px]",
      text: "text-[9px] tracking-[2.5px]",
      gap: "gap-1.5",
    },
    
  };

  const current = sizes[size] || sizes.md;

  return (
    <Link
      to="/"
      className={`flex flex-col items-center no-underline group ${current.gap}`}
      aria-label="Code:Enigma Ana Sayfa"
    >
      <div
        className={`flex items-center justify-center bg-[#2563EB] font-bold tracking-tighter text-white transition-transform duration-200 group-hover:scale-105 ${current.box}`}
        style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}
      >
        C:E
      </div>

      <span className={`text-center font-bold uppercase text-slate-300 ${current.text}`}>
        ENIGMA
      </span>
    </Link>
  );
}

export default Logo;