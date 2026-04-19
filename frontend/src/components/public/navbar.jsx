import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {

    const formatCoin = (value) => new Intl.NumberFormat('tr-TR').format(value);
    const [coins] = useState(1240);
    const [selectedAvatar] = useState('🦊');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-25 h-16 bg-white border-b border-slate-200 shadow-sm backdrop-blur-md bg-opacity-95">
      <Link to="/" className="group flex flex-col items-center gap-2 no-underline ">
        <div className="flex items-center gap-3 transition-transform duration-200 group-hover:scale-101">
          <div className="logo-hex w-9 h-9 flex items-center justify-center bg-[#2563EB] text-white font-bold text-[11px] tracking-tighter">C:E</div>
          <div>
            <p className="font-bold text-[15px] tracking-tight text-[#111827]">Code:Enigma</p>
            <p className="text-[9px] font-medium tracking-[1.8px] uppercase text-slate-400 mt-px">Uzaktan Eğitim Platformu</p>
          </div>
        </div>
      </Link>

     {/*  <nav className="hidden md:flex gap-8">
       <a href="#anasayfa" className="nav-link text-[12px] font-medium text-slate-500 hover:text-[#111827] transition-colors no-underline">Ana Sayfa</a>
        <a href="#sistem" className="nav-link text-[12px] font-medium text-slate-500 hover:text-[#111827] transition-colors no-underline">Sistem İşleyişi</a>
        <a href="#moduller" className="nav-link text-[12px] font-medium text-slate-500 hover:text-[#111827] transition-colors no-underline">Öğrenim Modülleri</a>
        <a href="#gorevler" className="nav-link text-[12px] font-medium text-slate-500 hover:text-[#111827] transition-colors no-underline">Görev Takibi</a>
       
        <Link to="/Video" className="nav-link text-[12px] font-medium text-slate-500 hover:text-[#111827] transition-colors no-underline">Video</Link>
      </nav> */} 
      

      <div className="flex items-center gap-2">
        <Link to="/login" className="text-[12px] font-medium text-slate-500 hover:text-[#111827] transition-colors px-4 py-2 bg-transparent border-none cursor-pointer no-underline">
          Giriş Yap
        </Link>
        <Link to="/register" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[12px] font-medium px-5 py-2 rounded-md border-none cursor-pointer transition-colors no-underline">
          Kayıt Ol
        </Link>
      </div>
    </header>
  );
}
