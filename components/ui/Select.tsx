
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1">
        {label}
      </label>
      <select
        id={id}
        className="w-full bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:ring-sky-500 focus:border-sky-500 transition-colors"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;
