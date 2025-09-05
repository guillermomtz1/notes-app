import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, onClearSearch }) => {
  return (
    <div className="w-88 flex items-center px-4 bg-surface-light/50 border border-border-green rounded-md backdrop-blur-sm">
      <FaMagnifyingGlass className="text-secondary mr-2" />
      <input
        type="text"
        placeholder="Search notes..."
        className="w-full text-xs bg-transparent py-[11px] outline-none text-text placeholder-text-muted"
        value={value}
        onChange={onChange}
      />

      {value && (
        <IoMdClose
          className="text-xl text-text-muted cursor-pointer hover:text-secondary transition-colors"
          onClick={onClearSearch}
        />
      )}
    </div>
  );
};

export default SearchBar;
