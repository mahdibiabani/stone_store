import { X } from 'lucide-react';
import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    confirmButtonClass?: string;
    isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText,
    confirmButtonClass = "bg-red-600 hover:bg-red-700",
    isLoading = false
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 transform transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-stone-200">
                    <h3 className="text-lg font-semibold text-stone-800 font-persian">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-stone-400 hover:text-stone-600 transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-stone-600 font-persian leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 rtl:space-x-reverse p-6 pt-0">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-persian disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 text-white py-2 px-4 rounded-lg transition-colors font-persian disabled:opacity-50 ${confirmButtonClass}`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>{confirmText}</span>
                            </div>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
