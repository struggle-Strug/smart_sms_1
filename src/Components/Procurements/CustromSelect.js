import React, { useState, useEffect, useRef } from 'react';

const CustomSelect = ({ options, placeholder = "Select an option", data, setData, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option) => {
    setSelectedOption(option);
    setData({ ...data, [name]: option });
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="bg-white border rounded-md p-2 cursor-pointer flex justify-between items-center"
        onClick={toggleDropdown}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
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

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border  rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className="cursor-pointer p-2 hover:bg-gray-100"
              onClick={() => selectOption(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
