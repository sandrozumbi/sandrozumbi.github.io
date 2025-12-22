
import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className={`
            pointer-events-auto
            flex items-center p-4 rounded-xl shadow-2xl border min-w-[300px]
            animate-in slide-in-from-right-full duration-300
            ${toast.type === 'success' ? 'bg-white border-green-100' : ''}
            ${toast.type === 'warning' ? 'bg-white border-orange-100' : ''}
            ${toast.type === 'error' ? 'bg-white border-red-100' : ''}
            ${toast.type === 'info' ? 'bg-white border-blue-100' : ''}
          `}
        >
          <div className="mr-3">
            {toast.type === 'success' && <CheckCircle2 className="text-green-500" size={20} />}
            {toast.type === 'warning' && <AlertTriangle className="text-orange-500" size={20} />}
            {toast.type === 'error' && <XCircle className="text-red-500" size={20} />}
            {toast.type === 'info' && <Info className="text-blue-500" size={20} />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">{toast.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
