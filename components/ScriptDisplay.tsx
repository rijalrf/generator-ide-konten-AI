import React, { useState, useCallback } from 'react';
import { Script, PlatformFormat } from '../types';
import { generateImage } from '../services/geminiService';

interface ScriptDisplayProps {
  scripts: Script[];
  platformFormat: PlatformFormat;
}

const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ scripts, platformFormat }) => {
  const [imageStates, setImageStates] = useState<{ 
    [key: string]: { loading: boolean; error: string | null; image: string | null; } 
  }>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyText = useCallback((text: string, key: string, type: 'prompt' | 'audio') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }).catch(err => {
      console.error(`Gagal menyalin teks ${type}: `, err);
    });
  }, []);

  const handleGenerateImage = useCallback(async (key: string, prompt: string) => {
    setImageStates(prev => ({ ...prev, [key]: { loading: true, error: null, image: null } }));
    try {
      const base64ImageBytes = await generateImage(prompt, platformFormat);
      const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
      setImageStates(prev => ({ ...prev, [key]: { loading: false, error: null, image: imageUrl } }));
    } catch (error: any) {
      setImageStates(prev => ({ ...prev, [key]: { loading: false, error: error.message || 'Gagal membuat gambar.', image: null } }));
    }
  }, [platformFormat]);

  const handleDownloadImage = (imageUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (scripts.length === 0) {
    return null;
  }

  const renderAudioContent = (content: string) => {
    return content.split('\n').map((line, i) => <p key={i} className="my-1">{line.trim()}</p>);
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-12 animate-fade-in">
      {scripts.map((script, index) => (
        <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
          <header className="p-6 bg-gray-800/50 border-b border-gray-700">
            <h2 className="text-xl md:text-2xl font-bold text-indigo-300">
              <span className="text-gray-500 mr-2">#{index + 1}</span> {script.judulKonten}
            </h2>
            <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                <span><strong className="font-semibold text-gray-300">Durasi:</strong> {script.durasi}</span>
                <span>|</span>
                <span><strong className="font-semibold text-gray-300">Karakter:</strong> {script.deskripsiKarakter}</span>
            </div>
          </header>
          
          <div className="p-6 md:p-8 space-y-6">
            {script.scenes.map((scene, sceneIndex) => {
              const imageStateKey = `${index}-${sceneIndex}`;
              const promptCopyKey = `prompt-${index}-${sceneIndex}`;
              const audioCopyKey = `audio-${index}-${sceneIndex}`;

              const sceneState = imageStates[imageStateKey] || { loading: false, error: null, image: null };
              const isPromptCopied = copiedKey === promptCopyKey;
              const isAudioCopied = copiedKey === audioCopyKey;

              return (
              <div key={sceneIndex} className="border-t border-gray-700 pt-6 first:border-t-0 first:pt-0">
                <h3 className="font-bold text-lg text-gray-200 mb-3">{scene.namaScene}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="flex flex-col gap-3">
                    <div className="bg-gray-900/50 p-4 rounded-lg flex-grow">
                      <p className="text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-2">PROMPT GAMBAR</p>
                      <div className="font-mono text-sm text-yellow-300 space-y-1">{scene.visual}</div>
                    </div>
                    <div className="flex items-center gap-2">
                       <button onClick={() => handleCopyText(scene.visual, promptCopyKey, 'prompt')} className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-200 ${isPromptCopied ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>
                          {isPromptCopied ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                          ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          )}
                          {isPromptCopied ? 'Disalin!' : 'Salin Prompt'}
                       </button>
                       <button onClick={() => handleGenerateImage(imageStateKey, scene.visual)} disabled={sceneState.loading} className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-200 bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-indigo-900/50 disabled:cursor-not-allowed">
                          {sceneState.loading ? (
                              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                          )}
                          {sceneState.loading ? 'Membuat...' : 'Buatkan Gambar'}
                       </button>
                    </div>
                    {sceneState.error && <p className="text-xs text-red-400 mt-2">{sceneState.error}</p>}
                    {sceneState.image && (
                      <div className="mt-2 p-2 bg-white rounded-lg shadow-md relative group animate-fade-in">
                          <img src={sceneState.image} alt={`Generated visual for ${scene.namaScene}`} className="rounded w-full h-auto" />
                          <button onClick={() => handleDownloadImage(sceneState.image!, `${script.judulKonten}-${scene.namaScene}`)} className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          </button>
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-green-400">AUDIO</p>
                        <button onClick={() => handleCopyText(scene.audio, audioCopyKey, 'audio')} className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-200 ${isAudioCopied ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>
                            {isAudioCopied ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            )}
                            {isAudioCopied ? 'Disalin!' : 'Salin Audio'}
                        </button>
                    </div>
                    <div className="text-sm text-gray-300 space-y-1">{renderAudioContent(scene.audio)}</div>
                  </div>
                </div>
              </div>
            )})}
          </div>

          <footer className="px-6 md:px-8 py-4 bg-gray-900/50 border-t border-gray-700 space-y-4">
             <div>
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Hashtags</h4>
                <p className="font-mono text-sm text-cyan-300">{script.hashtags}</p>
             </div>
          </footer>
        </div>
      ))}
    </div>
  );
};

export default ScriptDisplay;