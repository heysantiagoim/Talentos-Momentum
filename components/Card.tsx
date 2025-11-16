
import React from 'react';

interface CardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isCompleted?: boolean;
}

const Card: React.FC<CardProps> = ({ title, icon, children, isCompleted }) => {
  return (
    <div className={`bg-brand-surface border border-brand-border rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${isCompleted ? 'border-green-500/50' : 'border-brand-border'}`}>
      <div className="p-5 border-b border-brand-border flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {icon && <span className="text-brand-accent">{icon}</span>}
          <h3 className="text-md sm:text-lg font-semibold text-brand-text-primary">{title}</h3>
        </div>
        {isCompleted && (
          <div className="flex items-center space-x-2 text-green-400 text-xs font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Explicado</span>
          </div>
        )}
      </div>
      <div className="p-5 space-y-4">
        {children}
      </div>
    </div>
  );
};

export default Card;