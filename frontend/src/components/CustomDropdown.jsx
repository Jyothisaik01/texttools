import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomDropdown({
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  className = '',
  buttonClassName = '',
  menuClassName = '',
  darkMode = false,
  showFontPreview = false,
  maxHeight = 'max-h-64',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  // Find currently selected option
  const selectedOption = options.find((opt) => opt.value === value) || {
    value,
    label: value || placeholder,
  };

  // Group options if groups are defined
  const grouped = options.reduce((acc, opt) => {
    const groupName = opt.group || '__default__';
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(opt);
    return acc;
  }, {});

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`px-2.5 py-1.5 rounded-xl border flex items-center justify-between gap-2 text-xs font-semibold cursor-pointer select-none transition-all duration-200 active:scale-98 ${
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/10 shadow-xs'
            : darkMode
            ? 'border-zinc-700 bg-zinc-950 text-zinc-200 hover:bg-zinc-900 hover:border-zinc-600'
            : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-300'
        } ${buttonClassName}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span
          className="truncate"
          style={showFontPreview && selectedOption.font ? { fontFamily: selectedOption.font } : undefined}
        >
          {selectedOption.label}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 text-slate-400 ${
            isOpen ? 'rotate-180 text-blue-500' : ''
          }`}
        />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div
          className={`absolute left-0 mt-1.5 min-w-[150px] w-max max-w-[280px] rounded-xl border shadow-xl z-50 overflow-hidden py-1 transition-all animate-in fade-in zoom-in-95 duration-150 ${
            darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          } ${menuClassName}`}
          role="listbox"
        >
          <div className={`overflow-y-auto ${maxHeight} scrollbar-thin`}>
            {Object.entries(grouped).map(([groupName, items]) => (
              <div key={groupName} className="py-0.5">
                {groupName !== '__default__' && (
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 select-none">
                    {groupName}
                  </div>
                )}
                {items.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-xs text-left flex items-center justify-between gap-2.5 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-bold'
                          : darkMode
                          ? 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className="flex flex-col min-w-0">
                        <span
                          className="truncate"
                          style={
                            showFontPreview && opt.font
                              ? { fontFamily: opt.font, fontSize: opt.isCursive ? '15px' : '13px' }
                              : undefined
                          }
                        >
                          {opt.label}
                        </span>
                        {opt.desc && (
                          <span className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">
                            {opt.desc}
                          </span>
                        )}
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-blue-600 dark:text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

