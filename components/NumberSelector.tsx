import React from 'react';

interface NumberSelectorProps {
  selectedNumber: number;
  onSelectNumber: (num: number) => void;
}

const NumberSelector: React.FC<NumberSelectorProps> = ({ selectedNumber, onSelectNumber }) => {
  const numbers = [1, 2, 3, 4, 5];
  return (
    <div className="flex flex-wrap justify-start gap-3">
      {numbers.map((num) => (
        <button
          key={num}
          onClick={() => onSelectNumber(num)}
          aria-label={`Pilih ${num} ide`}
          aria-pressed={selectedNumber === num}
          className={`w-12 h-12 flex items-center justify-center text-sm font-semibold rounded-full transition-all duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500
            ${
              selectedNumber === num
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }
          `}
        >
          {num}
        </button>
      ))}
    </div>
  );
};

export default NumberSelector;