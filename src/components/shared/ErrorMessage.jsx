import React from 'react';
import { Button } from '@/components/ui/button.jsx';

const ErrorMessage = ({ message, retry }) => {
  return (
    <div className="text-center py-10">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <p className="text-red-600 mb-4 arabic-text">{message}</p>
        {retry && (
          <Button onClick={retry} variant="outline" className="arabic-text">
            إعادة المحاولة
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;

