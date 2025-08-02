import React from 'react';
import { PlatformFormat } from '../types';
import { PLATFORM_FORMATS } from '../constants';

interface PlatformFormatSelectorProps {
  selectedFormat: PlatformFormat;
  onSelectFormat: (format: PlatformFormat) => void;
}

const PlatformFormatSelector: React.FC<PlatformFormatSelectorProps> = ({ selectedFormat, onSelectFormat }) => {
  return (
    <div className="flex flex-wrap justify-start gap-2">
      {PLATFORM_FORMATS.map((format) => (
        <button
          key={format}
          onClick={() => onSelectFormat(format)}
          className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-full transition-all duration-200 ease-in-out transform hover:scale-105
            ${
              selectedFormat === format
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }
          `}
        >
          {format}
        </button>
      ))}
    </div>
  );
};

export default PlatformFormatSelector;