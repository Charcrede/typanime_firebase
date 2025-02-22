import React, { useState } from "react";
import { Citation, Synopsis } from "../otaku";

interface CustomSelectProps {
  options: Citation[] | Synopsis[];
  placeholder?: string;
  onSelect: (option: Citation | Synopsis) => void;
}

export default function CustomSelect({ options, placeholder = "Sélectionnez une option", onSelect}: CustomSelectProps) {
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Synopsis |Citation | null>(null);

  const filteredOptions = options.filter((option: Citation | Synopsis) =>{
    let searchField: string = "";
  
  if ("persoName" in option) {
    // option est de type Citation
    searchField = option.persoName;
  } else if ("anime" in option) {
    // option est de type Synopsis
    searchField = option.anime;
  }
  
  return searchField.toLowerCase().includes(search.toLowerCase());
  })
    

  const handleSelect = (option: Citation | Synopsis): void => {
    setSelected(option);
    setSearch("");
    onSelect(option)
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Barre d'entrée pour afficher la sélection */}
      <div
        className="border px-3 py-2 rounded cursor-pointer bg-white shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {placeholder}
      </div>

      {/* Dropdown avec recherche */}
      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border rounded shadow-lg z-10">
          {/* Barre de recherche */}
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border-b focus:outline-none"
          />
          <ul className="max-h-40 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option: Synopsis | Citation, index: number) => (
                <li
                  key={index}
                  className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => handleSelect(option)}
                >
                  {"persoName" in option ? option.persoName[0] == "A" || option.persoName[0] == "E" || option.persoName[0] == "I" || option.persoName[0] == "O" || option.persoName[0] == "U" || option.persoName[0] == "Y" ? "Citation d'" + option.persoName : "Citation de " + option.persoName : option.anime[0] == "A" || option.anime[0] == "E" || option.anime[0] == "I" || option.anime[0] == "O" || option.anime[0] == "U" || option.anime[0] == "Y" ? "Synopsis d'" + option.anime : "Synopsis de " + option.anime}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-500">Aucune option trouvée</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
