import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="flex items-center bg-surface border border-border px-5 rounded mb-3">
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Password"}
        className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none text-text placeholder-text-muted"
      />

      {isShowPassword ? (
        <FaRegEyeSlash
          size={22}
          className="text-text-muted hover:text-primary cursor-pointer transition-colors"
          onClick={toggleShowPassword}
        />
      ) : (
        <FaRegEye
          size={22}
          className="text-text-muted hover:text-primary cursor-pointer transition-colors"
          onClick={toggleShowPassword}
        />
      )}
    </div>
  );
};

export default PasswordInput;
