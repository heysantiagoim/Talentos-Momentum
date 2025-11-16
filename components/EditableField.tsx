
import React from 'react';

interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'textarea' | 'number' | 'date';
  placeholder?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({ label, value, onChange, type = 'text', placeholder }) => {
  const commonClasses = "w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 text-brand-text-primary focus:ring-2 focus:ring-brand-accent focus:border-brand-accent outline-none transition-colors duration-200";

  return (
    <div>
      <label className="block text-sm font-medium text-brand-text-secondary mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${commonClasses} min-h-[80px]`}
          rows={3}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={commonClasses}
        />
      )}
    </div>
  );
};

export default EditableField;
