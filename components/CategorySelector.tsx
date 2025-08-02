import React from 'react';
import { Category } from '../types';
import { CATEGORIES } from '../constants';

interface CategorySelectorProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap justify-start gap-2">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-full transition-all duration-200 ease-in-out transform hover:scale-105
            ${
              selectedCategory === category
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }
          `}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;