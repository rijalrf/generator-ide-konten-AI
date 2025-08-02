import React from 'react';
import { Script } from '../types';

interface ScriptDisplayProps {
  scripts: Script[];
}

const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ scripts }) => {
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
            {script.scenes.map((scene, sceneIndex) => (
              <div key={sceneIndex} className="border-t border-gray-700 pt-6 first:border-t-0 first:pt-0">
                <h3 className="font-bold text-lg text-gray-200 mb-3">{scene.namaScene}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <p className="text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-2">PROMPT GAMBAR</p>
                    <div className="font-mono text-sm text-yellow-300 space-y-1">{scene.visual}</div>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <p className="text-xs font-semibold uppercase tracking-wider text-green-400 mb-2">AUDIO</p>
                    <div className="text-sm text-gray-300 space-y-1">{renderAudioContent(scene.audio)}</div>
                  </div>
                </div>
              </div>
            ))}
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