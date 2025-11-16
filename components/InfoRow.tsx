
import React from 'react';

interface InfoRowProps {
  label: string;
  children: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, children }) => {
  return (
    <div className="py-3 border-b border-brand-border/50 last:border-b-0">
      <p className="text-sm font-medium text-brand-text-secondary">{label}</p>
      <div className="text-base text-brand-text-primary mt-1">{children}</div>
    </div>
  );
};

export default InfoRow;
