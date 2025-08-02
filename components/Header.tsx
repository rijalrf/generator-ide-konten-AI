import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full text-center py-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white">
        Generator Ide Konten <span className="text-indigo-400">AI</span>
      </h1>
      <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
        Pilih kategori dan jumlah ide, dan biarkan AI membuatkan skrip konten viral untuk Anda, lengkap dengan prompt gambar stickman!
      </p>
    </header>
  );
};

export default Header;
