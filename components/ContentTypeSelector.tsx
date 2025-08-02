import React from 'react';
import { ContentType } from '../types';
import { CONTENT_TYPES } from '../constants';

interface ContentTypeSelectorProps {
  selectedContentType: ContentType;
  onSelectContentType: (contentType: ContentType) => void;
}

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({ selectedContentType, onSelectContentType }) => {
  return (
    <div className="flex flex-wrap justify-start gap-2">
      {CONTENT_TYPES.map((contentType) => (
        <button
          key={contentType}
          onClick={() => onSelectContentType(contentType)}
          className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-full transition-all duration-200 ease-in-out transform hover:scale-105
            ${
              selectedContentType === contentType
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }
          `}
        >
          {contentType}
        </button>
      ))}
    </div>
  );
};

export default ContentTypeSelector;