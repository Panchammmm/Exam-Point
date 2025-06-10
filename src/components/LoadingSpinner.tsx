
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2" data-id="7gir0mkep" data-path="src/components/LoadingSpinner.tsx">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-indigo-600`} data-id="rbfuo83d6" data-path="src/components/LoadingSpinner.tsx" />
      {text && <p className="text-sm text-gray-600" data-id="jd297r9tw" data-path="src/components/LoadingSpinner.tsx">{text}</p>}
    </div>);

};

export default LoadingSpinner;