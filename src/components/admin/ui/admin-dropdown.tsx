"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface AdminDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export function AdminDropdown({
  options,
  value,
  onChange,
  placeholder = "Pilih pilihan...",
  label,
  disabled = false,
  className = "",
  fullWidth = false,
}: AdminDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown" && isOpen) {
      e.preventDefault();
      const currentIndex = options.findIndex((opt) => opt.value === value);
      const nextIndex = (currentIndex + 1) % options.length;
      onChange(options[nextIndex].value);
    } else if (e.key === "ArrowUp" && isOpen) {
      e.preventDefault();
      const currentIndex = options.findIndex((opt) => opt.value === value);
      const prevIndex = (currentIndex - 1 + options.length) % options.length;
      onChange(options[prevIndex].value);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {label && (
        <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 bg-[#17191E] border ${
          isOpen ? "border-[#FF3845] ring-1 ring-[#FF3845]" : "border-[#37383D]"
        } rounded-lg text-sm text-left transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#202126] admin-focus-ring`}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon && (
            <span className="flex-shrink-0 text-[#FF3845]">
              {selectedOption.icon}
            </span>
          )}
          <span
            className={
              selectedOption ? "text-white font-medium" : "text-[#96989F]"
            }
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#96989F] flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-white" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute z-40 left-0 right-0 mt-1.5 bg-[#17191E] border border-[#37383D] rounded-lg shadow-[0_12px_36px_rgba(0,0,0,0.85)] max-h-60 overflow-y-auto admin-scrollbar py-1 admin-panel-enter"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <div
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 text-sm cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-[#202126] text-white font-semibold"
                    : "text-[#C5C6CA] hover:bg-[#1F2128] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate pr-2">
                  {option.icon && (
                    <span
                      className={`flex-shrink-0 ${
                        isSelected ? "text-[#FF3845]" : "text-[#96989F]"
                      }`}
                    >
                      {option.icon}
                    </span>
                  )}
                  <div className="truncate">
                    <p className="truncate">{option.label}</p>
                    {option.description && (
                      <p className="text-[11px] text-[#96989F] truncate">
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-[#FF3845] flex-shrink-0 ml-2" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
