import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex justify-center items-center">
      <div 
        className={cn(
          'animate-spin rounded-full border-t-2 border-b-2 border-light-accent dark:border-dark-accent',
          sizeClasses[size],
          className
        )} 
      />
    </div>
  );
};

export default LoadingSpinner;