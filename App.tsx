import React, { useState, useCallback } from 'react';
import { Category, Script, ContentType, PlatformFormat } from './types';
import { generateScripts } from './services/geminiService';
import Header from './components/Header';
import CategorySelector from './components/CategorySelector';
import ScriptDisplay from './components/ScriptDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';
import NumberSelector from './components/NumberSelector';
import ContentTypeSelector from './components/ContentTypeSelector';
import PlatformFormatSelector from './components/PlatformFormatSelector';
import { CATEGORIES, CONTENT_TYPES, PLATFORM_FORMATS } from './constants';

const App: React.FC = () => {
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [contentType, setContentType] = useState<ContentType>(CONTENT_TYPES[0]);
  const [platformFormat, setPlatformFormat] = useState<PlatformFormat>(PLATFORM_FORMATS[0]);
  const [numberOfScripts, setNumberOfScripts] = useState<number>(1);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateScripts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setScripts([]);

    try {
      const result = await generateScripts(category, contentType, platformFormat, numberOfScripts);
      if (result.length === 0) {
        setError("AI tidak dapat menghasilkan ide untuk saat ini. Coba lagi.");
      } else {
        setScripts(result);
      }
    } catch (e: any) {
      setError(e.message || 'Terjadi kesalahan yang tidak diketahui.');
    } finally {
      setIsLoading(false);
    }
  }, [category, contentType, platformFormat, numberOfScripts]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-4">
      <main className="w-full max-w-4xl mx-auto flex-grow">
        <Header />

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                1. Pilih Kategori
              </label>
              <CategorySelector selectedCategory={category} onSelectCategory={setCategory} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                2. Pilih Jenis Konten
              </label>
              <ContentTypeSelector selectedContentType={contentType} onSelectContentType={setContentType} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                3. Pilih Format Platform
              </label>
              <PlatformFormatSelector selectedFormat={platformFormat} onSelectFormat={setPlatformFormat} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                4. Pilih Jumlah Ide
              </label>
              <NumberSelector selectedNumber={numberOfScripts} onSelectNumber={setNumberOfScripts} />
            </div>
          </div>


          <button
            onClick={handleGenerateScripts}
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed disabled:text-gray-400 transition-all duration-200 transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Membuat Skrip Profesional...
              </>
            ) : 'Buatkan Skrip Profesional!'}
          </button>
        </div>
        
        {error && (
            <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                {error}
            </div>
        )}

        {isLoading && <LoadingSpinner />}

        {!isLoading && scripts.length > 0 && <ScriptDisplay scripts={scripts} />}

        {!isLoading && scripts.length === 0 && !error && (
          <div className="text-center py-16 px-6 bg-gray-800/30 border border-dashed border-gray-700 rounded-xl mt-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-300">Skrip Profesional Anda Akan Muncul di Sini</h3>
            <p className="mt-1 text-sm text-gray-500">Pilih kriteria di atas dan biarkan AI menulis untuk Anda.</p>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default App;