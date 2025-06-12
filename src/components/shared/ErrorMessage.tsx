import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  retry?: () => void;
}

const ErrorMessage = ({ 
  message = 'حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.',
  retry 
}: ErrorMessageProps) => {
  return (
    <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
        </div>
        <div className="mr-3">
          <p className="text-sm font-medium text-red-800 dark:text-red-300">
            {message}
          </p>
        </div>
      </div>
      {retry && (
        <div className="mt-3">
          <button
            onClick={retry}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-theme"
          >
            <RefreshCw className="ml-1.5 h-4 w-4" />
            إعادة المحاولة
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;