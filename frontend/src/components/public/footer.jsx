export default function Footer() {
  return (
      <footer className="flex items-center justify-between px-25 py-6 border-t border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="logo-hex w-7 h-7 flex items-center justify-center bg-[#2563EB] text-white font-bold text-[9px] tracking-tighter">C:E</div>
          <span className="font-semibold text-[14px] text-[#111827]">Code:Enigma</span>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-slate-400">© {new Date().getFullYear()} Açık ve Uzaktan Eğitim Projesi. Tüm hakları saklıdır.</p>
          <p className="mt-1 text-[10px] text-slate-400">
            Icons by{" "}
            <a
              href="https://icons8.com"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-slate-500 hover:text-[#2563EB]"
            >
              Icons8
            </a>
          </p>
        </div>
      </footer>
  );
}
