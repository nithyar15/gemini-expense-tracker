
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1">
        {label}
      </label>
      <input
        id={id}
        className="w-full bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:ring-sky-500 focus:border-sky-500 transition-colors"
        {...props}
      />
    </div>
  );
};

export default Input;
