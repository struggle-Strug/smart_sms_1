import React, { useState, useRef, useEffect } from 'react';

const SimpleSelect = ({ options, placeholder = "選択してください", value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 外部クリックでメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-2/3" ref={dropdownRef}>
      <div
        className="bg-white border border-gray-300 rounded-lg p-2 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
        style={{ height: '46px' }}
      >
        <span>{value ? value.label : placeholder}</span>
        <svg
          className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* オプションリストの表示 */}
      {isOpen && (
        <div className="absolute mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10" style={{ width: '100%' }}>
          {options.map((option) => (
            <div
              key={option.value}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleSelect;
