import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  className 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={cn(
          "bg-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200",
          className
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-lg">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-accent rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {footer && (
          <div className="p-4 border-t bg-muted/30 flex justify-end space-x-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
