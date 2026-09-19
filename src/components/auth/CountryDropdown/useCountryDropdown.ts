import { Country } from "@/features/country";
import { useState, useRef, useEffect, useMemo } from "react";

export interface UseCountryDropdownProps {
  value: string;
  countries?: Country[];
  onChange: (val: string) => void;
  onBlur: () => void;
}

export function useCountryDropdown({
  value,
  countries,
  onChange,
  onBlur,
}: UseCountryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Set default selection to the first country if no value is provided
  useEffect(() => {
    if (!value && countries && countries.length > 0) {
      onChange(countries[0].name);
    }
  }, [value, countries, onChange]);

  const filteredCountries = useMemo(() => {
    if (!countries) return [];
    return countries.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [countries, searchTerm]);

  const handleSelect = (countryName: string) => {
    onChange(countryName);
    setIsOpen(false);
    setSearchTerm("");
    onBlur();
  };

  return {
    isOpen,
    setIsOpen,
    searchTerm,
    setSearchTerm,
    dropdownRef,
    filteredCountries,
    handleSelect,
  };
}
