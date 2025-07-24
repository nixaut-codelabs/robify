'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDownIcon } from './icons';

export default function ModernDropdown({
  value,
  onChange,
  options,
  placeholder = "Select option",
  className = "",
  displayLabels = {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current && !buttonRef.current.contains(event.target) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    const handleResize = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 240; // Max height of dropdown

      let top = rect.bottom + 8; // 8px gap
      
      // If not enough space below, show above
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        top = rect.top - dropdownHeight - 8;
      }

      setDropdownPosition({
        top,
        left: rect.left,
        width: rect.width
      });
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      updateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const getDisplayValue = (option) => {
    return displayLabels[option] || option;
  };

  return (
    <>
      <div className={`relative ${className}`}>
        <button
          ref={buttonRef}
          onClick={handleToggle}
          className="w-full bg-card-bg border border-border-light rounded-lg px-4 py-3 text-left text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 flex items-center justify-between hover:border-accent/50"
        >
          <span className={value ? 'text-foreground' : 'text-text-muted'}>
            {value ? getDisplayValue(value) : placeholder}
          </span>
          <ChevronDownIcon 
            className={`w-5 h-5 text-text-muted transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>
      </div>

      {mounted && isOpen && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed bg-card-bg border border-border-light rounded-lg shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            zIndex: 99999,
            maxHeight: '240px'
          }}
        >
          <div className="overflow-y-auto max-h-60">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(option)}
                className={`w-full px-4 py-3 text-left transition-colors duration-150 hover:bg-accent/10 hover:text-accent border-b border-border-light/50 last:border-b-0 ${
                  value === option
                    ? 'bg-accent/20 text-accent font-semibold'
                    : 'text-foreground'
                }`}
              >
                {getDisplayValue(option)}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}